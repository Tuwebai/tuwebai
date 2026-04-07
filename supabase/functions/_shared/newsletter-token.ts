const toBase64Url = (value: string): string =>
  btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

const fromBase64Url = (value: string): string => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return atob(`${normalized}${padding}`);
};

const encodeUtf8 = (value: string): Uint8Array => new TextEncoder().encode(value);

const createSignature = async (payloadBase64: string, secret: string): Promise<string> => {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encodeUtf8(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encodeUtf8(payloadBase64));
  return toBase64Url(String.fromCharCode(...new Uint8Array(signature)));
};

export const encodeNewsletterToken = async (
  emailNormalized: string,
  purpose: 'newsletter-confirmation' | 'newsletter-unsubscribe',
  secret: string,
): Promise<string> => {
  const payload = JSON.stringify({
    emailNormalized,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 2,
    purpose,
  });
  const payloadBase64 = toBase64Url(payload);
  const signature = await createSignature(payloadBase64, secret);
  return `${payloadBase64}.${signature}`;
};

export const decodeNewsletterToken = async (
  token: string,
  expectedPurpose: 'newsletter-confirmation' | 'newsletter-unsubscribe',
  secret: string,
): Promise<{ emailNormalized: string } | null> => {
  const [payloadBase64, signature] = token.split('.');
  if (!payloadBase64 || !signature) {
    return null;
  }

  const expectedSignature = await createSignature(payloadBase64, secret);
  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(payloadBase64)) as {
      emailNormalized?: string;
      exp?: number;
      purpose?: string;
    };

    if (
      !payload.emailNormalized ||
      typeof payload.exp !== 'number' ||
      payload.exp < Date.now() ||
      payload.purpose !== expectedPurpose
    ) {
      return null;
    }

    return { emailNormalized: payload.emailNormalized };
  } catch {
    return null;
  }
};

export const getSubscriberDocumentId = (emailNormalized: string): string => toBase64Url(emailNormalized);

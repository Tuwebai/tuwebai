interface BrevoSendEmailInput {
  htmlContent?: string;
  senderEmail: string;
  senderName: string;
  subject: string;
  textContent: string;
  to: string;
}

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export const sendBrevoTransactionalEmail = async (
  input: BrevoSendEmailInput,
): Promise<void> => {
  const apiKey = Deno.env.get('BREVO_API_KEY')?.trim();

  if (!apiKey) {
    throw new Error('brevo_api_key_missing');
  }

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender: {
        email: input.senderEmail,
        name: input.senderName,
      },
      to: [{ email: input.to }],
      subject: input.subject,
      textContent: input.textContent,
      ...(input.htmlContent ? { htmlContent: input.htmlContent } : {}),
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => 'brevo_send_failed');
    throw new Error(`brevo_send_failed_${response.status}:${body}`);
  }
};

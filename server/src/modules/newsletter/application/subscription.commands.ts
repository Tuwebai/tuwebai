import {
  queueBrevoNewsletterSubscribeSync,
  queueBrevoNewsletterUnsubscribeSync,
} from '../../../infrastructure/mail/brevo-newsletter.service';
import type { NewsletterSubscriptionContext, NewsletterSubscriberRecord } from '../domain/newsletter.repository';
import {
  buildSubscriberRecord,
  decodeNewsletterToken,
  encodeNewsletterToken,
  getSubscriberDocumentId,
  newsletterRepository,
  normalizeEmail,
  omitUndefinedFields,
  type NewsletterActionResult,
  type NewsletterSubscriptionResult,
} from './shared';

export const registerNewsletterSubscription = async (
  context: NewsletterSubscriptionContext,
): Promise<NewsletterSubscriptionResult> => {
  const nowIso = new Date().toISOString();
  const source = context.source.trim() || 'website';
  const normalizedContext: NewsletterSubscriptionContext = {
    ...context,
    source,
  };

  if (!newsletterRepository.isAvailable()) {
    throw new Error('newsletter_repository_unavailable');
  }

  const emailNormalized = normalizeEmail(context.email);
  const subscriberId = getSubscriberDocumentId(emailNormalized);
  const existing = await newsletterRepository.getSubscriberById(subscriberId);
  const subscriber = buildSubscriberRecord(existing ?? undefined, normalizedContext, nowIso);

  await newsletterRepository.upsertSubscriberById(subscriberId, subscriber);

  return {
    isExistingSubscriber: !!existing,
    persistedIn: 'supabase',
    subscriber,
    confirmationToken: encodeNewsletterToken(emailNormalized, 'newsletter-confirmation'),
  };
};

export const confirmNewsletterSubscription = async (
  token: string,
): Promise<NewsletterActionResult> => {
  const decoded = decodeNewsletterToken(token, 'newsletter-confirmation');
  if (!decoded) {
    return {
      success: false,
      message: 'El enlace de confirmacion no es valido o ya vencio.',
    };
  }

  if (!newsletterRepository.isAvailable()) {
    return {
      success: false,
      message: 'No se pudo confirmar la suscripcion en este momento.',
    };
  }

  const subscriberId = getSubscriberDocumentId(decoded.emailNormalized);
  const existing = await newsletterRepository.getSubscriberById(subscriberId);
  if (!existing) {
    return {
      success: false,
      message: 'No encontramos una suscripcion pendiente para este enlace.',
    };
  }

  const nowIso = new Date().toISOString();
  const nextSubscriber = omitUndefinedFields({
    ...existing,
    status: 'subscribed',
    confirmedAt: existing.confirmedAt || nowIso,
    unsubscribedAt: undefined,
    updatedAt: nowIso,
    consent: {
      ...existing.consent,
      submittedAt: existing.consent?.submittedAt || nowIso,
    },
  }) as NewsletterSubscriberRecord;

  await newsletterRepository.upsertSubscriberById(subscriberId, nextSubscriber);
  queueBrevoNewsletterSubscribeSync(nextSubscriber, {
    event: 'newsletter.brevo_subscribe',
    meta: { source: nextSubscriber.lastSource },
  });

  return {
    success: true,
    message:
      existing.status === 'subscribed'
        ? 'Tu suscripcion ya estaba confirmada.'
        : 'Tu email fue confirmado correctamente. Ya quedaste suscripto.',
    subscriber: nextSubscriber,
    unsubscribeToken: encodeNewsletterToken(decoded.emailNormalized, 'newsletter-unsubscribe'),
    justConfirmed: existing.status !== 'subscribed',
  };
};

export const unsubscribeNewsletterSubscription = async (
  token: string,
): Promise<NewsletterActionResult> => {
  const decoded = decodeNewsletterToken(token, 'newsletter-unsubscribe');
  if (!decoded) {
    return {
      success: false,
      message: 'El enlace de baja no es valido o ya vencio.',
    };
  }

  if (!newsletterRepository.isAvailable()) {
    return {
      success: false,
      message: 'No se pudo procesar la baja en este momento.',
    };
  }

  const subscriberId = getSubscriberDocumentId(decoded.emailNormalized);
  const existing = await newsletterRepository.getSubscriberById(subscriberId);
  if (!existing) {
    return {
      success: false,
      message: 'No encontramos una suscripcion activa para este enlace.',
    };
  }

  const nowIso = new Date().toISOString();
  const nextSubscriber: NewsletterSubscriberRecord = {
    ...existing,
    status: 'unsubscribed',
    unsubscribedAt: existing.unsubscribedAt || nowIso,
    updatedAt: nowIso,
  };

  await newsletterRepository.upsertSubscriberById(subscriberId, nextSubscriber);
  queueBrevoNewsletterUnsubscribeSync(nextSubscriber, {
    event: 'newsletter.brevo_unsubscribe',
    meta: { source: nextSubscriber.lastSource },
  });

  return {
    success: true,
    message:
      existing.status === 'unsubscribed'
        ? 'Tu suscripcion ya estaba dada de baja.'
        : 'Tu email fue dado de baja correctamente.',
    subscriber: nextSubscriber,
  };
};

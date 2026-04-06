import type { NewsletterSubscriberRecord } from '../domain/newsletter.repository';
import {
  getSubscriberDocumentId,
  newsletterRepository,
  normalizeEmail,
  omitUndefinedFields,
  type NewsletterWebhookResult,
} from './shared';

export const applyNewsletterProviderEvent = async (
  email: string,
  providerEvent: 'hard_bounce' | 'soft_bounce' | 'complaint' | 'unsubscribe',
): Promise<NewsletterWebhookResult> => {
  if (!newsletterRepository.isAvailable()) {
    return {
      success: false,
      message: 'No se pudo procesar el webhook en este momento.',
    };
  }

  const emailNormalized = normalizeEmail(email);
  const subscriberId = getSubscriberDocumentId(emailNormalized);
  const existing = await newsletterRepository.getSubscriberById(subscriberId);
  if (!existing) {
    return {
      success: false,
      message: 'No encontramos un suscriptor para este evento.',
    };
  }

  const nowIso = new Date().toISOString();
  const nextSubscriber = omitUndefinedFields({
    ...existing,
    status:
      providerEvent === 'complaint'
        ? 'complained'
        : providerEvent === 'unsubscribe'
          ? 'unsubscribed'
          : 'bounced',
    unsubscribedAt: providerEvent === 'unsubscribe' ? existing.unsubscribedAt || nowIso : existing.unsubscribedAt,
    bouncedAt:
      providerEvent === 'hard_bounce' || providerEvent === 'soft_bounce' ? existing.bouncedAt || nowIso : existing.bouncedAt,
    complainedAt: providerEvent === 'complaint' ? existing.complainedAt || nowIso : existing.complainedAt,
    updatedAt: nowIso,
  }) as NewsletterSubscriberRecord;

  await newsletterRepository.upsertSubscriberById(subscriberId, nextSubscriber);

  return {
    success: true,
    message: 'Evento de proveedor aplicado correctamente.',
    subscriber: nextSubscriber,
  };
};

import {
  queueBrevoNewsletterSubscribeSync,
  queueBrevoNewsletterUnsubscribeSync,
} from '../../../infrastructure/mail/brevo-newsletter.service';
import { newsletterRepository, type NewsletterReconcileResult } from './shared';

export const reconcileNewsletterBrevoSync = async (limit = 50): Promise<NewsletterReconcileResult> => {
  if (!newsletterRepository.isAvailable()) {
    return {
      success: false,
      message: 'No se pudo reconciliar newsletter en este momento.',
      scanned: 0,
      scheduled: 0,
      items: [],
    };
  }

  const safeLimit = Math.max(1, Math.min(limit, 100));
  const subscribers = await newsletterRepository.listSubscribersForReconcile(safeLimit * 3);

  const items: NewsletterReconcileResult['items'] = [];

  for (const subscriber of subscribers) {
    const syncStatus = subscriber.brevoSync?.status;
    if (syncStatus === 'synced') continue;

    const operation = subscriber.status === 'subscribed' ? 'subscribe' : 'unsubscribe';
    items.push({
      emailNormalized: subscriber.emailNormalized,
      operation,
      status: subscriber.status,
    });

    if (operation === 'subscribe') {
      queueBrevoNewsletterSubscribeSync(subscriber, {
        event: 'newsletter.brevo_reconcile_subscribe',
        meta: { source: 'manual_reconcile' },
      });
    } else {
      queueBrevoNewsletterUnsubscribeSync(subscriber, {
        event: 'newsletter.brevo_reconcile_unsubscribe',
        meta: { source: 'manual_reconcile' },
      });
    }

    if (items.length >= safeLimit) break;
  }

  return {
    success: true,
    message:
      items.length > 0
        ? 'Reconciliacion de Brevo programada correctamente.'
        : 'No encontramos suscriptores pendientes de reconciliacion con Brevo.',
    scanned: subscribers.length,
    scheduled: items.length,
    items,
  };
};

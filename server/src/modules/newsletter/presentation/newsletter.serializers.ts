import type {
  NewsletterActionResult,
  NewsletterReconcileResult,
  NewsletterSubscriptionResult,
  NewsletterWebhookResult,
} from '../application/shared';

export const serializeNewsletterSubscriptionResult = (
  result: NewsletterSubscriptionResult,
): NewsletterSubscriptionResult => ({
  confirmationToken: result.confirmationToken,
  isExistingSubscriber: result.isExistingSubscriber,
  persistedIn: result.persistedIn,
  subscriber: result.subscriber,
});

export const serializeNewsletterActionResult = (
  result: NewsletterActionResult,
): NewsletterActionResult => ({
  success: result.success,
  message: result.message,
  ...(result.subscriber ? { subscriber: result.subscriber } : {}),
  ...(result.unsubscribeToken ? { unsubscribeToken: result.unsubscribeToken } : {}),
  ...(typeof result.justConfirmed === 'boolean' ? { justConfirmed: result.justConfirmed } : {}),
});

export const serializeNewsletterWebhookResult = (
  result: NewsletterWebhookResult,
): NewsletterWebhookResult => ({
  success: result.success,
  message: result.message,
  ...(result.subscriber ? { subscriber: result.subscriber } : {}),
});

export const serializeNewsletterReconcileResult = (
  result: NewsletterReconcileResult,
): NewsletterReconcileResult => ({
  items: result.items,
  message: result.message,
  scanned: result.scanned,
  scheduled: result.scheduled,
  success: result.success,
});

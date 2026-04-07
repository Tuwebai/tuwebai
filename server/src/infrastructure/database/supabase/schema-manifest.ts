export const SUPABASE_TABLES = {
  newsletterSubscribers: 'newsletter_subscribers',
  newsletterSubscriptionEvents: 'newsletter_subscription_events',
  profiles: 'profiles',
  userPreferences: 'user_preferences',
  userPrivacySettings: 'user_privacy_settings',
  users: 'users',
} as const;

export const SUPABASE_USER_IDENTITY_COLUMNS = {
  authUid: 'auth_uid',
  supabaseAuthUserId: 'supabase_auth_user_id',
} as const;

export const NEWSLETTER_SUBSCRIBER_STATUSES = [
  'pending_confirmation',
  'subscribed',
  'unsubscribed',
  'bounced',
  'complained',
] as const;

export const NEWSLETTER_EVENT_TYPES = [
  'submitted',
  'confirmed',
  'unsubscribed',
  'bounced',
  'complained',
  'brevo_sync',
] as const;

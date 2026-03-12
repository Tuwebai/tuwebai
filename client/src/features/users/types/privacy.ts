export interface UserPrivacySettings {
  marketingConsent: boolean;
  analyticsConsent: boolean;
  profileEmailVisible: boolean;
  profileStatusVisible: boolean;
  updatedAt?: string;
  updatedBy?: 'self';
}

export type UpdateUserPrivacyPayload = Partial<
  Pick<
    UserPrivacySettings,
    'marketingConsent' | 'analyticsConsent' | 'profileEmailVisible' | 'profileStatusVisible'
  >
>;

export const DEFAULT_USER_PRIVACY_SETTINGS: UserPrivacySettings = {
  marketingConsent: false,
  analyticsConsent: false,
  profileEmailVisible: true,
  profileStatusVisible: true,
};

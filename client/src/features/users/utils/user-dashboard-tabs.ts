export const USER_DASHBOARD_TAB_SEGMENTS = {
  profile: 'perfil',
  security: 'seguridad',
  privacy: 'privacidad',
  integrations: 'integraciones',
} as const;

export type UserDashboardTab = keyof typeof USER_DASHBOARD_TAB_SEGMENTS;

const DASHBOARD_SEGMENT_TO_TAB = Object.entries(USER_DASHBOARD_TAB_SEGMENTS).reduce<Record<string, UserDashboardTab>>(
  (accumulator, [tab, segment]) => {
    accumulator[segment] = tab as UserDashboardTab;
    return accumulator;
  },
  {},
);

export const DEFAULT_USER_DASHBOARD_TAB: UserDashboardTab = 'profile';

export const resolveUserDashboardTab = (segment?: string | null): UserDashboardTab =>
  (segment && DASHBOARD_SEGMENT_TO_TAB[segment]) || DEFAULT_USER_DASHBOARD_TAB;

export const buildUserDashboardPath = (tab: UserDashboardTab): string =>
  `/panel/${USER_DASHBOARD_TAB_SEGMENTS[tab]}`;

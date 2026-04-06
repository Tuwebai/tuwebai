export type ClientDataSurface = {
  accessMode: 'client_rls' | 'server_only';
  containsSensitiveData: boolean;
  ownerModule: string;
  table: string;
};

export const clientDataAccessManifest: ClientDataSurface[] = [
  {
    table: 'users',
    ownerModule: 'users',
    accessMode: 'server_only',
    containsSensitiveData: true,
  },
  {
    table: 'user_preferences',
    ownerModule: 'users',
    accessMode: 'server_only',
    containsSensitiveData: true,
  },
  {
    table: 'user_privacy_settings',
    ownerModule: 'users',
    accessMode: 'server_only',
    containsSensitiveData: true,
  },
  {
    table: 'projects',
    ownerModule: 'projects',
    accessMode: 'server_only',
    containsSensitiveData: true,
  },
  {
    table: 'payments',
    ownerModule: 'payments',
    accessMode: 'server_only',
    containsSensitiveData: true,
  },
  {
    table: 'newsletter_subscribers',
    ownerModule: 'newsletter',
    accessMode: 'server_only',
    containsSensitiveData: true,
  },
  {
    table: 'public_submissions',
    ownerModule: 'contact',
    accessMode: 'server_only',
    containsSensitiveData: true,
  },
  {
    table: 'testimonials',
    ownerModule: 'testimonials',
    accessMode: 'server_only',
    containsSensitiveData: false,
  },
];

export const getClientExposedTables = (): ClientDataSurface[] =>
  clientDataAccessManifest.filter((surface) => surface.accessMode === 'client_rls');

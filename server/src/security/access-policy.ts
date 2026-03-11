export type AccessRole = 'owner' | 'admin';
export type AccessAction = 'read' | 'list' | 'update';
export type ResourceType = 'tickets' | 'projects';

type ResourcePolicy = Record<AccessAction, readonly AccessRole[]>;

export const accessPolicy: Record<ResourceType, ResourcePolicy> = {
  tickets: {
    read: ['owner', 'admin'],
    list: ['admin'],
    update: ['owner', 'admin'],
  },
  projects: {
    read: ['owner', 'admin'],
    list: ['admin'],
    update: ['owner', 'admin'],
  },
} as const;


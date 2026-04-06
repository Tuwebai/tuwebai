export type AccessRole = 'owner' | 'admin';
export type AccessAction = 'read' | 'list' | 'update';
export type ResourceType = 'projects';

type ResourcePolicy = Record<AccessAction, readonly AccessRole[]>;

export const accessPolicy: Record<ResourceType, ResourcePolicy> = {
  projects: {
    read: ['owner', 'admin'],
    list: ['admin'],
    update: ['owner', 'admin'],
  },
} as const;

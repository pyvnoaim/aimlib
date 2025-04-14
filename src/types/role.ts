export const ROLES = {
  ADMIN: 'Admin',
  USER: 'User',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface User {
  uid: string;
  email: string;
  username?: string;
  name?: string;
  image?: string;
  role?: string;
  isActive?: boolean;
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  newsletter: boolean;
  darkMode: boolean;
  language: string;
}

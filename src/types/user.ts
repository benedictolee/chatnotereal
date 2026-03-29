export interface AppUser {
  uid: string;
  email: string | null;
  plan: 'free' | 'premium';
  chatCount: number;
  chatCountResetAt?: any;
  createdAt?: any;
}

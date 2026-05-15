export interface UserRecord {
  telegramId: number;
  uuid: string;
  email: string;
  keyUrl: string;
  createdAt: number;
  expiresAt: number | null;
  isActive: number;
}

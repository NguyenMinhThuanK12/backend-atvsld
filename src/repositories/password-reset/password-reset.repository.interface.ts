import { PasswordReset } from 'src/entities/password-reset.entity';
export const IPasswordResetRepository = 'IPasswordResetRepository';
export interface IPasswordResetRepository {
  createAndSave(userId: number, token: string, expiresAt: Date): Promise<PasswordReset>;
  findByToken(token: string): Promise<PasswordReset | undefined>;
  deleteByToken(token: string): Promise<void>;
}

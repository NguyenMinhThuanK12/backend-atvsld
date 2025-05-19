import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordReset } from 'src/entities/password-reset.entity';
import { IPasswordResetRepository } from './password-reset.repository.interface';

@Injectable()
export class PasswordResetRepository implements IPasswordResetRepository {
  constructor(
    @InjectRepository(PasswordReset)
    private readonly repo: Repository<PasswordReset>,
  ) {}

  async createAndSave(userId: number, token: string, expiresAt: Date): Promise<PasswordReset> {
    const reset = this.repo.create({ user_id: userId, token, expires_at: expiresAt });
    return await this.repo.save(reset);
  }

  async findByToken(token: string): Promise<PasswordReset | undefined> {
    return await this.repo.findOne({ where: { token } });
  }

  async deleteByToken(token: string): Promise<void> {
    await this.repo.delete({ token });
  }
}

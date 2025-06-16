import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from 'src/entities/password-reset.entity';
import { PasswordResetRepository } from 'src/repositories/password-reset/password-reset.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordReset])],
  providers: [
    {
      provide: 'IPasswordResetRepository',
      useClass: PasswordResetRepository,
    },
  ],
  exports: ['IPasswordResetRepository'],
})
export class PasswordResetModule {}

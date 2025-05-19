import { IsEmail, MaxLength } from 'class-validator';

export class ForgotPasswordRequest {
  @IsEmail()
  email: string;
}
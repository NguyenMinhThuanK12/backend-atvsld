import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordRequest {
  @IsNotEmpty()
  token: string;

  @IsString()
  newPassword: string;
}

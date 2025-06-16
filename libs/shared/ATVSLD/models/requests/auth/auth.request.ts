import { IsString } from 'class-validator';

export class AuthRequest {
  @IsString()
  account: string;

  @IsString()
  password: string;
}

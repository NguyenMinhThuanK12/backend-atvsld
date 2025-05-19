import { IsString, Matches, MinLength, IsNumber } from 'class-validator';

export class AuthRequest {
  @IsNumber()
  department_id: number;

  @IsString()
  account: string;

  @IsString()
  password: string;
}

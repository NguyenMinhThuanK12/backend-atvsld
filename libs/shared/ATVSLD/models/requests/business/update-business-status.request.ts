import { IsBoolean } from 'class-validator';

export class UpdateBusinessStatusRequest {
  @IsBoolean()
  isActive: boolean;
}
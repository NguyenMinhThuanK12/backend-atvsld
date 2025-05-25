import { IsBoolean } from 'class-validator';

export class UpdateDepartmentStatusRequest {
  @IsBoolean()
  isActive: boolean;
}
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateRoleRequest {
  @IsString()
  name: string;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  permissionIds?: string[];
}

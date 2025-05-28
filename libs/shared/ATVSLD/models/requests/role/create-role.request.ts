import { IsString, IsNotEmpty, IsArray, IsUUID } from 'class-validator';

export class CreateRoleRequest {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsUUID('all', { each: true })
  permissionIds: string[];
}

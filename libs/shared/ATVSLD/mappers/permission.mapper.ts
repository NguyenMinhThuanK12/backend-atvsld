import { Permission } from 'src/entities/permission.entity';
import { PermissionResponse } from '../models/response/permission/permission.response';

export function mapToPermissionResponse(entity: Permission, children?: PermissionResponse[]): PermissionResponse {
  return {
    id: entity.id,
    code: entity.code,
    name: entity.name,
    type: entity.type,
    parentCode: entity.parentCode,
    ...(children ? { children } : {}),
  };
}

import { Role } from 'src/entities/role.entity';
import { RoleResponse } from '../models/response/role/role.response';
import { CreateRoleRequest } from '../models/requests/role/create-role.request';

export function mapToRoleResponse(role: Role): RoleResponse {
  return {
    id: role.id,
    code: role.code,
    name: role.name,
    permissionIds: role.rolePermissions?.map((rp) => rp.permission_id) ?? [],
  };
}

export function mapToRoleEntity(dto: CreateRoleRequest): Role {
  const role = new Role();
  role.code = dto.code;
  role.name = dto.name;
  return role;
}

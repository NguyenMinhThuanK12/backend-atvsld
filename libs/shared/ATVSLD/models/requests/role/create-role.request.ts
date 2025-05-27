export class CreateRoleRequest {
  code: string;
  name: string;
  permissionIds: string[]; // UUID của các quyền
}

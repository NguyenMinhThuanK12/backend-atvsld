import { IBaseRepository } from 'src/repositories/base/base.repository.interface';
import { Role } from 'src/entities/role.entity';
import { SearchRoleQueryRequest } from 'libs/shared/ATVSLD/models/requests/role/search-role-query.request';

export const IRoleRepository = 'IRoleRepository';

export interface IRoleRepository extends IBaseRepository<Role> {
  assignPermissions(roleId: string, permissionIds: string[]): Promise<void>;
  clearPermissions(roleId: string): Promise<void>;
  findAdvanced(query: SearchRoleQueryRequest): Promise<[Role[], number]>;
}

import { IBaseRepository } from 'src/repositories/base/base.repository.interface';
import { Permission } from 'src/entities/permission.entity';
import { SearchPermissionComponentRequest } from 'libs/shared/ATVSLD/models/requests/permission/search-permission-component.request';
import { SearchPermissionGroupRequest } from 'libs/shared/ATVSLD/models/requests/permission/search-permission-group.request';

export const IPermissionRepository = 'IPermissionRepository';

export interface IPermissionRepository extends IBaseRepository<Permission> {
  findGroupPaginated(query: SearchPermissionGroupRequest): Promise<[Permission[], number]>;
  findComponentsByParentCode(query: SearchPermissionComponentRequest): Promise<Permission[]>;
  getPermissionCodesByUserId(userId: string): Promise<string[]>;
}

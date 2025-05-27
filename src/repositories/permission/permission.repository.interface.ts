import { IBaseRepository } from 'src/repositories/base/base.repository.interface';
import { Permission } from 'src/entities/permission.entity';

export const IPermissionRepository = 'IPermissionRepository';

export interface IPermissionRepository extends IBaseRepository<Permission> {
  findAll(): Promise<Permission[]>;
}

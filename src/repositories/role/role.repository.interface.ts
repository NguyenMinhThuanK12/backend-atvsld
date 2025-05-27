import { IBaseRepository } from 'src/repositories/base/base.repository.interface';
import { Role } from 'src/entities/role.entity';

export const IRoleRepository = 'IRoleRepository';

export interface IRoleRepository extends IBaseRepository<Role> {
  assignPermissions(roleId: string, permissionIds: string[]): Promise<void>;
}

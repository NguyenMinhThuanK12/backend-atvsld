import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/entities/role.entity';
import { BaseRepository } from 'src/repositories/base/base.repository';
import { IRoleRepository } from './role.repository.interface';
import { RolePermission } from 'src/entities/role-permission.entity';

@Injectable()
export class RoleRepository extends BaseRepository<Role> implements IRoleRepository {
  constructor(
    @InjectRepository(Role)
    roleRepo: Repository<Role>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepo: Repository<RolePermission>,
  ) {
    super(roleRepo);
  }

  async assignPermissions(roleId: string, permissionIds: string[]): Promise<void> {
    // Xoá hết quyền cũ
    await this.rolePermissionRepo.delete({ role_id: roleId });

    // Thêm mới quyền
    const records = permissionIds.map((pid) => {
      const rp = new RolePermission();
      rp.role_id = roleId;
      rp.permission_id = pid;
      return rp;
    });
    await this.rolePermissionRepo.save(records);
  }
}

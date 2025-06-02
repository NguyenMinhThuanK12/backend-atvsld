import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/entities/role.entity';
import { BaseRepository } from 'src/repositories/base/base.repository';
import { IRoleRepository } from './role.repository.interface';
import { RolePermission } from 'src/entities/role-permission.entity';
import { SearchRoleQueryRequest } from 'libs/shared/ATVSLD/models/requests/role/search-role-query.request';

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

    if (!permissionIds || permissionIds.length === 0) {
      return; // Không gán quyền mới nếu không có danh sách
    }
    // Thêm mới quyền
    const records = permissionIds.map((pid) => {
      const rp = new RolePermission();
      rp.role_id = roleId;
      rp.permission_id = pid;
      return rp;
    });
    console.log('Records to insert:', records);
    await this.rolePermissionRepo.save(records);
  }
  async clearPermissions(roleId: string): Promise<void> {
    await this.rolePermissionRepo.delete({ role: { id: roleId } });
  }

  async findPaginated(page: number, limit: number): Promise<[Role[], number]> {
    return this.repo.findAndCount({
      relations: ['rolePermissions'],
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findById(id: string): Promise<Role | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['rolePermissions'],
    });
  }

  async findAdvanced(query: SearchRoleQueryRequest): Promise<[Role[], number]> {
    const qb = this.repo.createQueryBuilder('role').leftJoinAndSelect('role.rolePermissions', 'rolePermissions');

    if (query.code) {
      qb.andWhere('unaccent(role.code) ILIKE unaccent(:code)', {
        code: `%${query.code}%`,
      });
    }

    if (query.name) {
      qb.andWhere('unaccent(role.name) ILIKE unaccent(:name)', {
        name: `%${query.name}%`,
      });
    }

    // Phân trang
    qb.skip((query.page - 1) * query.limit).take(query.limit);

    return qb.getManyAndCount();
  }
}

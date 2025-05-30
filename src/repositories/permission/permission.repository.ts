import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from 'src/entities/permission.entity';
import { BaseRepository } from 'src/repositories/base/base.repository';
import { IPermissionRepository } from './permission.repository.interface';
import { PermissionEnum } from 'libs/shared/ATVSLD/enums/permission.enum';
import { User } from 'src/entities/user.entity';
import { SearchPermissionComponentRequest } from 'libs/shared/ATVSLD/models/requests/permission/search-permission-component.request';
import { SearchPermissionGroupRequest } from 'libs/shared/ATVSLD/models/requests/permission/search-permission-group.request';

@Injectable()
export class PermissionRepository extends BaseRepository<Permission> implements IPermissionRepository {
  constructor(
    @InjectRepository(Permission)
    repo: Repository<Permission>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super(repo);
  }

  async findGroupPaginated(query: SearchPermissionGroupRequest): Promise<[Permission[], number]> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const qb = this.repo
      .createQueryBuilder('permission')
      .where('permission.type = :type', { type: PermissionEnum.GROUP })
      .orderBy('permission.code', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    if (query.code) {
      qb.andWhere(`unaccent(lower(permission.code)) LIKE unaccent(:code)`, {
        code: `%${query.code.toLowerCase()}%`,
      });
    }

    if (query.name) {
      qb.andWhere(`unaccent(lower(permission.name)) LIKE unaccent(:name)`, {
        name: `%${query.name.toLowerCase()}%`,
      });
    }

    return qb.getManyAndCount();
  }
  async findComponentsByParentCode(query: SearchPermissionComponentRequest): Promise<Permission[]> {
    return this.repo.find({
      where: {
        type: PermissionEnum.COMPONENT,
        parentCode: query.parentCode,
      },
      order: { code: 'ASC' },
    });
  }

  async getPermissionCodesByUserId(userId: string): Promise<string[]> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission'],
    });

    if (!user?.role?.rolePermissions) return [];

    return user.role.rolePermissions.map((rp) => rp.permission.code);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from 'src/entities/permission.entity';
import { BaseRepository } from 'src/repositories/base/base.repository';
import { IPermissionRepository } from './permission.repository.interface';
import { PermissionEnum } from 'libs/shared/ATVSLD/enums/permission.enum';
import { User } from 'src/entities/user.entity';

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

  async findGroupPaginated(page: number, limit: number, code?: string, name?: string): Promise<[Permission[], number]> {
    const query = this.repo
      .createQueryBuilder('permission')
      .where('permission.type = :type', { type: PermissionEnum.GROUP })
      .orderBy('permission.code', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    if (code) {
      query.andWhere(`unaccent(lower(permission.code)) LIKE unaccent(:code)`, {
        code: `%${code.toLowerCase()}%`,
      });
    }

    if (name) {
      query.andWhere(`unaccent(lower(permission.name)) LIKE unaccent(:name)`, {
        name: `%${name.toLowerCase()}%`,
      });
    }

    return query.getManyAndCount();
  }

  async findComponentsByParentCode(parentCode: string): Promise<Permission[]> {
    return this.repo.find({
      where: {
        type: PermissionEnum.COMPONENT,
        parentCode,
      },
      order: { code: 'ASC' },
    });
  }

  async getPermissionCodesByUserId(userId: string): Promise<string[]> {
    console.log('Fetching permissions for userId:', userId);
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission'],
    });

    if (!user?.role?.rolePermissions) return [];

    return user.role.rolePermissions.map((rp) => rp.permission.code);
  }
}

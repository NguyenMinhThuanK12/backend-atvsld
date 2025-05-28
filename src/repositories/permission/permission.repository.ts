import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from 'src/entities/permission.entity';
import { BaseRepository } from 'src/repositories/base/base.repository';
import { IPermissionRepository } from './permission.repository.interface';
import { PermissionEnum } from 'libs/shared/ATVSLD/enums/permission.enum';

@Injectable()
export class PermissionRepository extends BaseRepository<Permission> implements IPermissionRepository {
  constructor(
    @InjectRepository(Permission)
    repo: Repository<Permission>,
  ) {
    super(repo);
  }

  async findGroupPaginated(page: number, limit: number): Promise<[Permission[], number]> {
    return this.repo.findAndCount({
      where: { type: PermissionEnum.GROUP },
      order: { code: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
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
}

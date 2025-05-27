import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from 'src/entities/permission.entity';
import { BaseRepository } from 'src/repositories/base/base.repository';
import { IPermissionRepository } from './permission.repository.interface';

@Injectable()
export class PermissionRepository extends BaseRepository<Permission> implements IPermissionRepository {
  constructor(
    @InjectRepository(Permission)
    repo: Repository<Permission>,
  ) {
    super(repo);
  }

  async findAll(): Promise<Permission[]> {
    return this.repo.find();
  }
}

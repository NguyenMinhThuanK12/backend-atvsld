import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from 'src/entities/department.entity';
import { IDepartmentRepository } from './department.repository.interface';
import { DepartmentResponse } from 'libs/shared/ATVSLD/models/response/department/department.response';


@Injectable()
export class DepartmentRepository implements IDepartmentRepository {
  constructor(
    @InjectRepository(Department)
    private readonly repo: Repository<Department>,
  ) {}

   
  async findForLogin(): Promise<{ id: number; name: string }[]> {
    return this.repo
      .createQueryBuilder('d')
      .select([
        'd.id AS id',
        'd.name AS name',
      ])
      .orderBy('d.name', 'ASC')
      .getRawMany();
  }

   async findAll(): Promise<DepartmentResponse[]> {
    const departments = await this.repo.find();

    return departments.map((d) => ({
      id: d.id,
      name: d.name,
      level: d.level,
      province: d.province,
      district: d.district,
      ward: d.ward,
      parent_id: d.parent_id,
      created_at: d.created_at,
    }));
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from 'src/entities/department.entity';
import { IDepartmentRepository } from './department.repository.interface';
import { SearchDepartmentQueryRequest } from 'libs/shared/ATVSLD/models/requests/department/search-department-query.request';
import { BaseRepository } from 'src/repositories/base/base.repository';

@Injectable()
export class DepartmentRepository extends BaseRepository<Department> implements IDepartmentRepository {
  constructor(
    @InjectRepository(Department)
    departmentRepo: Repository<Department>,
  ) {
    super(departmentRepo);
  }
  // async delete(id: number): Promise<void> {
  //   await this.softDelete(id); // dùng soft delete  (override lại hàm delete trong BaseRepository)
  // }

  async updateStatus(id: number, isActive: boolean): Promise<Department> {
    await this.repo.update({ id }, { isActive });
    return this.repo.findOne({ where: { id } });
  }

  async findAdvanced(query: SearchDepartmentQueryRequest): Promise<[Department[], number]> {
    const qb = this.repo.createQueryBuilder('department');

    if (query.name) {
      qb.andWhere('department.name ILIKE :name', { name: `%${query.name}%` });
    }

    if (query.taxCode) {
      qb.andWhere('department.taxCode = :taxCode', { taxCode: query.taxCode });
    }

    if (query.businessType) {
      qb.andWhere('department.businessType = :businessType', { businessType: query.businessType });
    }

    if (query.mainBusinessField) {
      qb.andWhere('department.mainBusinessField ILIKE :mainBusinessField', {
        mainBusinessField: `%${query.mainBusinessField}%`,
      });
    }

    if (query.operationCity) {
      qb.andWhere('department.operationCity = :operationCity', { operationCity: query.operationCity });
    }

    if (query.operationDistrict) {
      qb.andWhere('department.operationDistrict = :operationDistrict', {
        operationDistrict: query.operationDistrict,
      });
    }

    if (query.operationWard) {
      qb.andWhere('department.operationWard = :operationWard', { operationWard: query.operationWard });
    }

    if (query.operationAddress) {
      qb.andWhere('department.operationAddress ILIKE :operationAddress', {
        operationAddress: `%${query.operationAddress}%`,
      });
    }

    qb.skip((query.page - 1) * query.limit).take(query.limit);

    return qb.getManyAndCount();
  }
}

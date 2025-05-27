import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from 'src/entities/business.entity';
import { IBusinessRepository } from './business.repository.interface';
import { SearchBusinessQueryRequest } from 'libs/shared/ATVSLD/models/requests/business/search-business-query.request';
import { BaseRepository } from 'src/repositories/base/base.repository';

@Injectable()
export class BusinessRepository extends BaseRepository<Business> implements IBusinessRepository {
  constructor(
    @InjectRepository(Business)
    businessRepo: Repository<Business>,
  ) {
    super(businessRepo);
  }
  // async delete(id: number): Promise<void> {
  //   await this.softDelete(id); // dùng soft delete  (override lại hàm delete trong BaseRepository)
  // }

  async updateStatus(id: string, isActive: boolean): Promise<Business> {
    await this.repo.update({ id }, { isActive });
    return this.repo.findOne({ where: { id } });
  }

  async findAdvanced(query: SearchBusinessQueryRequest): Promise<[Business[], number]> {
    const qb = this.repo.createQueryBuilder('business');

    if (query.name) {
      qb.andWhere('business.name ILIKE :name', { name: `%${query.name}%` });
    }

    if (query.taxCode) {
      qb.andWhere('business.taxCode ILIKE :taxCode', { taxCode: `%${query.taxCode}%` });
    }

    if (query.businessType) {
      qb.andWhere('business.businessType = :businessType', { businessType: query.businessType });
    }

    if (query.mainBusinessField) {
      qb.andWhere('business.mainBusinessField ILIKE :mainBusinessField', {
        mainBusinessField: `%${query.mainBusinessField}%`,
      });
    }

    if (query.operationCity) {
      qb.andWhere('business.operationCity = :operationCity', { operationCity: query.operationCity });
    }

    if (query.operationDistrict) {
      qb.andWhere('business.operationDistrict = :operationDistrict', {
        operationDistrict: query.operationDistrict,
      });
    }

    if (query.operationWard) {
      qb.andWhere('business.operationWard = :operationWard', { operationWard: query.operationWard });
    }

    if (query.operationAddress) {
      qb.andWhere('business.operationAddress ILIKE :operationAddress', {
        operationAddress: `%${query.operationAddress}%`,
      });
    }

    // Sắp xếp theo ID giảm dần
    qb.orderBy('business.id', 'DESC');

    // phân trang
    qb.skip((query.page - 1) * query.limit).take(query.limit);

    return qb.getManyAndCount();
  }
}

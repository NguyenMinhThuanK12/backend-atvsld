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
  async delete(id: string): Promise<void> {
    await this.softDelete(id); // dùng soft delete  (override lại hàm delete trong BaseRepository)
  }
  async findActive(): Promise<Business[]> {
    return this.repo.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, isActive: boolean): Promise<Business> {
    await this.repo.update({ id }, { isActive });
    return this.repo.findOne({ where: { id } });
  }

  async findAdvanced(query: SearchBusinessQueryRequest): Promise<[Business[], number]> {
    const qb = this.repo.createQueryBuilder('business');

    if (query.name) {
      qb.andWhere('unaccent(business.name) ILIKE unaccent(:name)', { name: `%${query.name}%` });
    }

    if (query.taxCode) {
      qb.andWhere('unaccent(business.taxCode) ILIKE unaccent(:taxCode)', { taxCode: `%${query.taxCode}%` });
    }

    if (query.businessType) {
      qb.andWhere('business.businessType = :businessType', { businessType: query.businessType });
    }

    if (query.mainBusinessField) {
      qb.andWhere('unaccent(business.mainBusinessField) ILIKE unaccent(:mainBusinessField)', {
        mainBusinessField: `%${query.mainBusinessField}%`,
      });
    }

    if (query.registrationCity) {
      qb.andWhere('unaccent(business.registrationCity) ILIKE unaccent(:registrationCity)', {
        registrationCity: `%${query.registrationCity}%`,
      });
    }

    if (query.registrationDistrict) {
      qb.andWhere('unaccent(business.registrationDistrict) ILIKE unaccent(:registrationDistrict)', {
        registrationDistrict: `%${query.registrationDistrict}%`,
      });
    }

    if (query.registrationWard) {
      qb.andWhere('unaccent(business.registrationWard) ILIKE unaccent(:registrationWard)', {
        registrationWard: `%${query.registrationWard}%`,
      });
    }

    if (query.registrationAddress) {
      qb.andWhere('unaccent(business.registrationAddress) ILIKE unaccent(:registrationAddress)', {
        registrationAddress: `%${query.registrationAddress}%`,
      });
    }

    // Sắp xếp theo Ngày tạo giảm dần
    qb.orderBy('business.createdAt', 'DESC');

    // Phân trang
    qb.skip((query.page - 1) * query.limit).take(query.limit);

    return qb.getManyAndCount();
  }
}

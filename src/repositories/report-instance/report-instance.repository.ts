import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportInstance } from 'src/entities/report-instance.entity';
import { BaseRepository } from '../base/base.repository';

import { SearchReportInstanceRequest } from 'libs/shared/ATVSLD/models/requests/report-instance/search-report-instance.request';
import { IReportInstanceRepository } from './report-instance.repository.interface';

@Injectable()
export class ReportInstanceRepository extends BaseRepository<ReportInstance> implements IReportInstanceRepository {
  constructor(
    @InjectRepository(ReportInstance)
    repo: Repository<ReportInstance>,
  ) {
    super(repo);
  }

  async findAdvanced(query: SearchReportInstanceRequest, businessId?: string): Promise<[ReportInstance[], number]> {
    const qb = this.repo
      .createQueryBuilder('instance')
      .leftJoinAndSelect('instance.configuration', 'config')
      .leftJoinAndSelect('instance.business', 'business');

    qb.andWhere('config.isActive = true');

    if (businessId) {
      qb.andWhere('instance.businessId = :businessId', { businessId });
    }

    if (query.status) {
      qb.andWhere('instance.status = :status', { status: query.status });
    }

    if (query.businessName) {
      qb.andWhere('unaccent(business.name) ILIKE unaccent(:name)', { name: `%${query.businessName}%` });
    }

    if (query.startDate && query.endDate) {
      qb.andWhere('(config.startDate <= :endDate AND config.endDate >= :startDate)', {
        startDate: query.startDate,
        endDate: query.endDate,
      });
    } else if (query.startDate) {
      qb.andWhere('config.startDate >= :start', { start: query.startDate });
    } else if (query.endDate) {
      qb.andWhere('config.endDate <= :end', { end: query.endDate });
    }

    if (query.year) {
      qb.andWhere(`TO_CHAR(config.startDate, 'YYYY') LIKE :year`, {
        year: `%${query.year}%`,
      });
    }

    if (query.period) {
      qb.andWhere('config.period = :period', { period: query.period });
    }

    if (query.lastUpdatedFrom && query.lastUpdatedTo) {
      qb.andWhere('instance.lastUpdatedDate BETWEEN :from AND :to', {
        from: query.lastUpdatedFrom,
        to: query.lastUpdatedTo,
      });
    }

    if (query.updatedBy) {
      qb.andWhere('unaccent(instance.lastUpdatedBy) ILIKE unaccent(:up)', {
        up: `%${query.updatedBy}%`,
      });
    }

    qb.orderBy('instance.createdAt', 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit);

    return qb.getManyAndCount();
  }
}

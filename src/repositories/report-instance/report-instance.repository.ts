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
      qb.andWhere('DATE(config.startDate) >= DATE(:startDate) AND DATE(config.endDate) <= DATE(:endDate)', {
        startDate: query.startDate,
        endDate: query.endDate,
      });
    } else if (query.startDate) {
      qb.andWhere('config.startDate >= :startDate', { startDate: query.startDate });
    }

    // Ngày kết thúc
    else if (!query.startDate && query.endDate) {
      qb.andWhere('config.endDate <= :endDate', { endDate: query.endDate });
    }

    if (query.year) {
      qb.andWhere('CAST(config.year AS TEXT) LIKE :year', {
        year: `%${query.year}%`,
      });
    }

    if (query.period) {
      qb.andWhere('config.period = :period', { period: query.period });
    }

    if (query.lastUpdated) {
      qb.andWhere('instance.lastUpdatedDate  >= :lastUpdated', { lastUpdated: query.lastUpdated });
    }

    if (query.updatedBy) {
      qb.andWhere('unaccent(instance.lastUpdatedBy) ILIKE unaccent(:up)', {
        up: `%${query.updatedBy}%`,
      });
    }

    qb.orderBy('instance.createdAt', 'DESC');

    return qb.getManyAndCount();
  }

  async findActiveYears(): Promise<number[]> {
    const results = await this.repo
      .createQueryBuilder('instance')
      .leftJoin('instance.configuration', 'config')
      .where('config.isActive = true')
      .select('config.year', 'year')
      .addSelect('MAX(instance.createdAt)', 'createdAt')
      .groupBy('config.year')
      .orderBy('MAX(instance.createdAt)', 'DESC')
      .getRawMany();

    return results.map((r) => Number(r.year));
  }
}

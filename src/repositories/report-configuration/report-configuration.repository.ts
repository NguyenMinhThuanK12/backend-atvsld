import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportConfiguration } from 'src/entities/report-configuration.entity';
import { BaseRepository } from '../base/base.repository';
import { IReportConfigurationRepository } from './report-configuration.repository.interface';
import { SearchReportConfigRequest } from 'libs/shared/ATVSLD/models/requests/report-configuration/search-report-config.request';

@Injectable()
export class ReportConfigurationRepository
  extends BaseRepository<ReportConfiguration>
  implements IReportConfigurationRepository
{
  constructor(
    @InjectRepository(ReportConfiguration)
    repo: Repository<ReportConfiguration>,
  ) {
    super(repo);
  }

  async findAdvanced(query: SearchReportConfigRequest): Promise<[ReportConfiguration[], number]> {
    const qb = this.repo.createQueryBuilder('config');

    if (query.reportName) {
      qb.andWhere('config.report_name::text ILIKE :name', {
        name: `%${query.reportName}%`,
      });
    }

    if (query.year) {
      qb.andWhere('CAST(config.year AS TEXT) LIKE :year', {
        year: `%${query.year}%`,
      });
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

    if (query.period) {
      qb.andWhere('config.period = :period', { period: query.period });
    }

    if (query.isActive !== undefined) {
      qb.andWhere('config.isActive = :isActive', { isActive: query.isActive });
    }

    qb.orderBy('config.createdAt', 'DESC');
    qb.skip((query.page - 1) * query.limit).take(query.limit);

    return qb.getManyAndCount();
  }

  async checkYearConflict(reportName: string, year: number, excludeId?: string): Promise<boolean> {
    const qb = this.repo
      .createQueryBuilder('config')
      .where('config.reportName = :reportName', { reportName })
      .andWhere('config.year = :year', { year });

    if (excludeId) {
      qb.andWhere('config.id != :excludeId', { excludeId });
    }

    const count = await qb.getCount();
    return count > 0;
  }
}

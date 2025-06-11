import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportDetail } from 'src/entities/report-detail.entity';

import { BaseRepository } from '../base/base.repository';
import { IReportDetailRepository } from './report-detail.repository.interface';

@Injectable()
export class ReportDetailRepository extends BaseRepository<ReportDetail> implements IReportDetailRepository {
  constructor(
    @InjectRepository(ReportDetail)
    private readonly reportDetailRepo: Repository<ReportDetail>,
  ) {
    super(reportDetailRepo);
  }
  async findByInstanceId(instanceId: string): Promise<ReportDetail | null> {
    return this.repo.findOne({ where: { instanceId } });
  }
}

import { IBaseRepository } from '../base/base.repository.interface';
import { ReportDetail } from 'src/entities/report-detail.entity';

export const IReportDetailRepository = 'IReportDetailRepository';
export interface IReportDetailRepository extends IBaseRepository<ReportDetail> {
  findByInstanceId(instanceId: string): Promise<ReportDetail | null>;
}

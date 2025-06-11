import { SearchReportInstanceRequest } from 'libs/shared/ATVSLD/models/requests/report-instance/search-report-instance.request';
import { IBaseRepository } from '../base/base.repository.interface';
import { ReportInstance } from 'src/entities/report-instance.entity';

export const IReportInstanceRepository = 'IReportInstanceRepository';

export interface IReportInstanceRepository extends IBaseRepository<ReportInstance> {
  findAdvanced(query: SearchReportInstanceRequest): Promise<[ReportInstance[], number]>;
}

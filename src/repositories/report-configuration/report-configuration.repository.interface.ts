import { IBaseRepository } from '../base/base.repository.interface';
import { ReportConfiguration } from 'src/entities/report-configuration.entity';
import { SearchReportConfigRequest } from 'libs/shared/ATVSLD/models/requests/report-configuration/search-report-config.request';

export const IReportConfigurationRepository = 'IReportConfigurationRepository';

export interface IReportConfigurationRepository extends IBaseRepository<ReportConfiguration> {
  findAdvanced(query: SearchReportConfigRequest): Promise<[ReportConfiguration[], number]>;
  checkYearConflict(reportName: string, year: number, excludeId?: string): Promise<boolean>;
}

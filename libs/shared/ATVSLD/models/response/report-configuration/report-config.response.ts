import { ReportNameEnum } from 'libs/shared/ATVSLD/enums/report-name.enum';
import { ReportPeriodEnum } from 'libs/shared/ATVSLD/enums/reporting-period.enum';

export class ReportConfigResponse {
  id: string;
  reportName: ReportNameEnum;
  year: string;
  period: ReportPeriodEnum;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

import { ReportPeriodEnum } from 'libs/shared/ATVSLD/enums/reporting-period.enum';

export class ReportConfigResponse {
  id: string;
  reportName: string;
  year: number;
  period: ReportPeriodEnum;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

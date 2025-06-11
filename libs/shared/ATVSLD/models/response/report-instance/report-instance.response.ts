import { ReportStatusEnum } from 'libs/shared/ATVSLD/enums/report-status.enum';
import { ReportPeriodEnum } from 'libs/shared/ATVSLD/enums/reporting-period.enum';

export class ReportInstanceResponse {
  id: string;
  status: ReportStatusEnum;

  businessName: string;

  startDate: Date;
  endDate: Date;
  period: ReportPeriodEnum;

  lastUpdatedDate: Date | null;
  lastUpdatedBy: string | null;
}

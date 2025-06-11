import { ReportInstance } from 'src/entities/report-instance.entity';
import { ReportInstanceResponse } from '../models/response/report-instance/report-instance.response';

export const mapToReportInstanceResponse = (instance: ReportInstance): ReportInstanceResponse => ({
  id: instance.id,
  status: instance.status,

  businessName: instance.business.name,

  startDate: instance.configuration.startDate,
  endDate: instance.configuration.endDate,
  period: instance.configuration.period,

  lastUpdatedDate: instance.lastUpdatedDate ?? null,
  lastUpdatedBy: instance.lastUpdatedBy ?? null,
});

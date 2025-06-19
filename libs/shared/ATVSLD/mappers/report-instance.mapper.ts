import { ReportInstance } from 'src/entities/report-instance.entity';
import { ReportInstanceResponse } from '../models/response/report-instance/report-instance.response';
import { ReportInstanceBusinessResponse } from '../models/response/report-instance/report-instance-business.response';

export const mapToReportInstanceResponse = (instance: ReportInstance): ReportInstanceResponse => ({
  id: instance.id,
  status: instance.status,
  isOverdue: instance.configuration.isOverdue,
  businessName: instance.business.name,
  year: instance.configuration.year.toString(),

  startDate: instance.configuration.startDate,
  endDate: instance.configuration.endDate,
  period: instance.configuration.period,

  lastUpdatedDate: instance.lastUpdatedDate ?? null,
  lastUpdatedBy: instance.lastUpdatedBy ?? null,
});

export function mapToReportInstanceBusinessResponse(instance: ReportInstance): ReportInstanceBusinessResponse {
  const business = instance.business;
  const config = instance.configuration;

  const parts = [
    business?.operationAddress,
    business?.operationWard,
    business?.operationDistrict,
    business?.operationCity,
  ].filter(Boolean); // loại bỏ undefined/null

  return {
    name: business?.name || '',
    businessType: business?.businessType || '',
    mainBusinessField: business?.mainBusinessField || '',
    phoneNumber: business?.phoneNumber || '',
    year: config?.year || 0,
    fullAddress: parts.join(', '), // địa chỉ gộp
  };
}

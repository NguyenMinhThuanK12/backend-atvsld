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
    lastUpdatedText: formatDateToVietnamese(instance.lastUpdatedDate),
  };
}
function formatDateToVietnamese(date?: Date | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `Ngày ${day} tháng ${month} năm ${year}`;
}

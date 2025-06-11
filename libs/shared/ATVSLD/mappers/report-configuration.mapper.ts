import { ReportConfiguration } from 'src/entities/report-configuration.entity';
import { ReportConfigResponse } from '../models/response/report-configuration/report-config.response';
import { CreateReportConfigRequest } from '../models/requests/report-configuration/create-report-config.request';

export const mapToReportConfigResponse = (entity: ReportConfiguration): ReportConfigResponse => ({
  id: entity.id,
  reportName: entity.reportName,
  year: entity.year,
  period: entity.period,
  startDate: entity.startDate,
  endDate: entity.endDate,
  isActive: entity.isActive,
});

export const mapToReportConfigEntity = (dto: CreateReportConfigRequest): ReportConfiguration => {
  const entity = new ReportConfiguration();
  entity.reportName = dto.reportName;
  entity.year = dto.year;
  entity.period = dto.period;
  entity.startDate = dto.startDate;
  entity.endDate = dto.endDate;
  return entity;
};

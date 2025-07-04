import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';
import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { ReportPeriodEnum } from 'libs/shared/ATVSLD/enums/reporting-period.enum';

export class SearchReportConfigRequest extends PaginationQueryRequest {
  @IsOptional()
  @IsString()
  reportName?: string;

  @IsOptional()
  @IsString()
  year?: number;

  @IsOptional()
  @IsEnum(ReportPeriodEnum)
  period?: ReportPeriodEnum;

  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;
}

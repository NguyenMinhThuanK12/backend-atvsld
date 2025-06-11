import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';
import { IsEnum, IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';
import { ReportStatusEnum } from 'libs/shared/ATVSLD/enums/report-status.enum';
import { ReportPeriodEnum } from 'libs/shared/ATVSLD/enums/reporting-period.enum';
import { Type } from 'class-transformer';

export class SearchReportInstanceRequest extends PaginationQueryRequest {
  @IsOptional()
  @IsEnum(ReportStatusEnum)
  status?: ReportStatusEnum;

  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsEnum(ReportPeriodEnum)
  period?: ReportPeriodEnum;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year?: number;

  @IsOptional()
  @IsDateString()
  lastUpdatedFrom?: Date;

  @IsOptional()
  @IsDateString()
  lastUpdatedTo?: Date;

  @IsOptional()
  @IsString()
  updatedBy?: string;
}

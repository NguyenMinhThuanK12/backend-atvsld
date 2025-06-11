import { IsEnum, IsDateString, IsInt, Min, IsOptional } from 'class-validator';
import { ReportNameEnum } from 'libs/shared/ATVSLD/enums/report-name.enum';
import { ReportPeriodEnum } from 'libs/shared/ATVSLD/enums/reporting-period.enum';

export class UpdateReportConfigRequest {
  @IsOptional()
  @IsEnum(ReportNameEnum)
  reportName: ReportNameEnum;

  @IsOptional()
  @IsInt()
  @Min(2000)
  year?: number;

  @IsOptional()
  @IsEnum(ReportPeriodEnum)
  period?: ReportPeriodEnum;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  isActive?: boolean;
}

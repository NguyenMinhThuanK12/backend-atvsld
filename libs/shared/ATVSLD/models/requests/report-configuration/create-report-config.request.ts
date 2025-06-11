import { IsEnum, IsDateString, IsInt, Min } from 'class-validator';
import { ReportNameEnum } from 'libs/shared/ATVSLD/enums/report-name.enum';
import { ReportPeriodEnum } from 'libs/shared/ATVSLD/enums/reporting-period.enum';

export class CreateReportConfigRequest {
  @IsEnum(ReportNameEnum)
  reportName: ReportNameEnum;

  @IsInt()
  @Min(2000)
  year: number;

  @IsEnum(ReportPeriodEnum)
  period: ReportPeriodEnum;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;
}

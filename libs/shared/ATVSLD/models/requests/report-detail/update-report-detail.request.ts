import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ReportStatusEnum } from 'libs/shared/ATVSLD/enums/report-status.enum';

export class UpdateReportDetailRequest {
  @IsUUID()
  instanceId: string;

  @IsEnum(ReportStatusEnum)
  status?: ReportStatusEnum;

  @IsString()
  fullName: string;

  // 1. Thông tin lao động
  @IsString() totalEmployees: string;
  @IsString() femaleEmployees: string;
  @IsString() under15Employees: string;
  @IsString() atvsldStaff: string;
  @IsString() medicalStaff: string;
  @IsString() hazardousWorkers: string;
  @IsString() minorWorkers: string;
  @IsString() elderlyWorkers: string;
  @IsString() disabledWorkers: string;

  // 2. Tai nạn lao động
  @IsString() accidentCases: string;
  @IsString() fatalAccidents: string;
  @IsString() injuredEmployees: string;
  @IsString() accidentDaysOff: string;
  @IsString() accidentCost: string;

  // 3. Bệnh nghề nghiệp
  @IsString() totalBNNBefore: string;
  @IsString() retiredBNN: string;
  @IsString() newBNNCases: string;
  @IsString() bnnLeaveDays: string;
  @IsString() bnnCost: string;

  // 4. Sức khoẻ lao động
  @IsString() healthTypeI: string;
  @IsString() healthTypeII: string;
  @IsString() healthTypeIII: string;
  @IsString() healthTypeIV: string;
  @IsString() healthTypeV: string;

  // 5. Huấn luyện
  @IsString() trainingGroup1: string;
  @IsString() trainingSelf: string;
  @IsString() trainingGroup2: string;
  @IsString() trainingProvider: string;
  @IsString() trainingGroup3: string;
  @IsString() trainingGroup4: string;
  @IsString() trainingGroup5: string;
  @IsString() trainingGroup6: string;
  @IsString() trainingCost: string;

  // 6. Máy móc thiết bị
  @IsString() totalMachines: string;
  @IsString() machinesUsing: string;
  @IsString() machinesChecked: string;
  @IsString() machinesDeclared: string;
  @IsString() machinesUnchecked: string;

  // 7. Giờ làm việc
  @IsString() totalWorkers: string;
  @IsString() totalWorkingHours: string;
  @IsString() maxWorkingHours: string;

  // 8. Bồi dưỡng chống độc
  @IsString() toxicSupportWorkers: string;
  @IsString() toxicSupportCost: string;

  // 9. Quan trắc môi trường
  @IsString() envSamples: string;
  @IsString() envNotQualified: string;
  @IsString() tempNotQualified: string;
  @IsString() humidityNotQualified: string;
  @IsString() lightNotQualified: string;
  @IsString() noiseNotQualified: string;
  @IsString() gasNotQualified: string;
  @IsString() dustNotQualified: string;
  @IsString() radiationNotQualified: string;
  @IsString() otherEnvNotQualified: string;

  // 10. Chi phí ATVS
  @IsString() costMeasureSafe: string;
  @IsString() costMeasureHygiene: string;
  @IsString() costHealthcare: string;
  @IsString() costTraining: string;
  @IsString() costProtection: string;
  @IsString() costRiskEval: string;
  @IsString() costOthers: string;
  @IsString() costTotal: string;

  // 11. Dịch vụ
  @IsString() @IsOptional() atvsldServiceProvider?: string;
  @IsString() @IsOptional() medicalServiceProvider?: string;

  // 12. Thời điểm đánh giá
  @IsString() riskAssessmentTime: string;
}

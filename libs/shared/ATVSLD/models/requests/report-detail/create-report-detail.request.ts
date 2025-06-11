import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateReportDetailRequest {
  @IsUUID()
  instanceId: string;

  // 1. Thông tin lao động
  @IsNumber() totalEmployees: number;
  @IsNumber() femaleEmployees: number;
  @IsNumber() under15Employees: number;
  @IsNumber() atvsldStaff: number;
  @IsNumber() medicalStaff: number;
  @IsNumber() hazardousWorkers: number;
  @IsNumber() minorWorkers: number;
  @IsNumber() elderlyWorkers: number;
  @IsNumber() disabledWorkers: number;

  // 2. Tai nạn lao động
  @IsNumber() accidentCases: number;
  @IsNumber() fatalAccidents: number;
  @IsNumber() injuredEmployees: number;
  @IsNumber() accidentDaysOff: number;
  @IsNumber() accidentCost: number;

  // 3. Bệnh nghề nghiệp
  @IsNumber() totalBNNBefore: number;
  @IsNumber() retiredBNN: number;
  @IsNumber() newBNNCases: number;
  @IsNumber() bnnLeaveDays: number;
  @IsNumber() bnnCost: number;

  // 4. Sức khoẻ lao động
  @IsNumber() healthTypeI: number;
  @IsNumber() healthTypeII: number;
  @IsNumber() healthTypeIII: number;
  @IsNumber() healthTypeIV: number;
  @IsNumber() healthTypeV: number;

  // 5. Huấn luyện
  @IsNumber() trainingGroup1: number;
  @IsNumber() trainingSelf: number;
  @IsNumber() trainingGroup2: number;
  @IsNumber() trainingProvider: number;
  @IsNumber() trainingGroup3: number;
  @IsNumber() trainingGroup4: number;
  @IsNumber() trainingGroup5: number;
  @IsNumber() trainingGroup6: number;
  @IsNumber() trainingCost: number;

  // 6. Máy móc thiết bị
  @IsNumber() totalMachines: number;
  @IsNumber() machinesUsing: number;
  @IsNumber() machinesChecked: number;
  @IsNumber() machinesDeclared: number;
  @IsNumber() machinesUnchecked: number;

  // 7. Giờ làm việc
  @IsNumber() totalWorkers: number;
  @IsNumber() totalWorkingHours: number;
  @IsNumber() maxWorkingHours: number;

  // 8. Bồi dưỡng chống độc
  @IsNumber() toxicSupportWorkers: number;
  @IsNumber() toxicSupportCost: number;

  // 9. Quan trắc môi trường
  @IsNumber() envSamples: number;
  @IsNumber() envNotQualified: number;
  @IsNumber() tempNotQualified: number;
  @IsNumber() humidityNotQualified: number;
  @IsNumber() lightNotQualified: number;
  @IsNumber() noiseNotQualified: number;
  @IsNumber() gasNotQualified: number;
  @IsNumber() dustNotQualified: number;
  @IsNumber() radiationNotQualified: number;
  @IsNumber() otherEnvNotQualified: number;

  // 10. Chi phí ATVS
  @IsNumber() costMeasureSafe: number;
  @IsNumber() costMeasureHygiene: number;
  @IsNumber() costHealthcare: number;
  @IsNumber() costTraining: number;
  @IsNumber() costProtection: number;
  @IsNumber() costRiskEval: number;
  @IsNumber() costOthers: number;
  @IsNumber() costTotal: number;

  // 11. Dịch vụ
  @IsString() @IsOptional() atvsldServiceProvider?: string;
  @IsString() @IsOptional() medicalServiceProvider?: string;

  // 12. Thời điểm đánh giá
  @IsString() riskAssessmentTime: string;
}

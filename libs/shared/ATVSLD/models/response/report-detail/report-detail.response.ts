export class ReportDetailResponse {
  id: string;

  // Gắn với bản ghi báo cáo của doanh nghiệp (report instance)
  instanceId: string;

  // ===== 1. Thông tin lao động =====
  totalEmployees: number;
  femaleEmployees: number;
  under15Employees: number;
  atvsldStaff: number;
  medicalStaff: number;
  hazardousWorkers: number;
  minorWorkers: number;
  elderlyWorkers: number;
  disabledWorkers: number;

  // ===== 2. Tai nạn lao động =====
  accidentCases: number;
  fatalAccidents: number;
  injuredEmployees: number;
  accidentDaysOff: number;
  accidentCost: number;

  // ===== 3. Bệnh nghề nghiệp =====
  totalBNNBefore: number;
  retiredBNN: number;
  newBNNCases: number;
  bnnLeaveDays: number;
  bnnCost: number;

  // ===== 4. Sức khoẻ lao động =====
  healthTypeI: number;
  healthTypeII: number;
  healthTypeIII: number;
  healthTypeIV: number;
  healthTypeV: number;

  // ===== 5. Huấn luyện =====
  trainingGroup1: number;
  trainingSelf: number;
  trainingGroup2: number;
  trainingProvider: number;
  trainingGroup3: number;
  trainingGroup4: number;
  trainingGroup5: number;
  trainingGroup6: number;
  trainingCost: number;

  // ===== 6. Máy móc thiết bị =====
  totalMachines: number;
  machinesUsing: number;
  machinesChecked: number;
  machinesDeclared: number;
  machinesUnchecked: number;

  // ===== 7. Giờ làm việc =====
  totalWorkers: number;
  totalWorkingHours: number;
  maxWorkingHours: number;

  // ===== 8. Bồi dưỡng chống độc =====
  toxicSupportWorkers: number;
  toxicSupportCost: number;

  // ===== 9. Quan trắc môi trường =====
  envSamples: number;
  envNotQualified: number;
  tempNotQualified: number;
  humidityNotQualified: number;
  lightNotQualified: number;
  noiseNotQualified: number;
  gasNotQualified: number;
  dustNotQualified: number;
  radiationNotQualified: number;
  otherEnvNotQualified: number;

  // ===== 10. Chi phí ATVS =====
  costMeasureSafe: number;
  costMeasureHygiene: number;
  costHealthcare: number;
  costTraining: number;
  costProtection: number;
  costRiskEval: number;
  costOthers: number;
  costTotal: number;

  // ===== 11. Dịch vụ =====
  atvsldServiceProvider: string;
  medicalServiceProvider: string;

  // ===== 12. Thời điểm đánh giá =====
  riskAssessmentTime: string;
}

export class ReportDetailResponse {
  id: string;

  // Gắn với bản ghi báo cáo của doanh nghiệp (report instance)
  instanceId: string;

  // ===== 1. Thông tin lao động =====
  totalEmployees: string;
  femaleEmployees: string;
  under15Employees: string;
  atvsldStaff: string;
  medicalStaff: string;
  hazardousWorkers: string;
  minorWorkers: string;
  elderlyWorkers: string;
  disabledWorkers: string;

  // ===== 2. Tai nạn lao động =====
  accidentCases: string;
  fatalAccidents: string;
  injuredEmployees: string;
  accidentDaysOff: string;
  accidentCost: string;

  // ===== 3. Bệnh nghề nghiệp =====
  totalBNNBefore: string;
  retiredBNN: string;
  newBNNCases: string;
  bnnLeaveDays: string;
  bnnCost: string;

  // ===== 4. Sức khoẻ lao động =====
  healthTypeI: string;
  healthTypeII: string;
  healthTypeIII: string;
  healthTypeIV: string;
  healthTypeV: string;

  // ===== 5. Huấn luyện =====
  trainingGroup1: string;
  trainingSelf: string;
  trainingGroup2: string;
  trainingProvider: string;
  trainingGroup3: string;
  trainingGroup4: string;
  trainingGroup5: string;
  trainingGroup6: string;
  trainingCost: string;

  // ===== 6. Máy móc thiết bị =====
  totalMachines: string;
  machinesUsing: string;
  machinesChecked: string;
  machinesDeclared: string;
  machinesUnchecked: string;

  // ===== 7. Giờ làm việc =====
  totalWorkers: string;
  totalWorkingHours: string;
  maxWorkingHours: string;

  // ===== 8. Bồi dưỡng chống độc =====
  toxicSupportWorkers: string;
  toxicSupportCost: string;

  // ===== 9. Quan trắc môi trường =====
  envSamples: string;
  envNotQualified: string;
  tempNotQualified: string;
  humidityNotQualified: string;
  lightNotQualified: string;
  noiseNotQualified: string;
  gasNotQualified: string;
  dustNotQualified: string;
  radiationNotQualified: string;
  otherEnvNotQualified: string;

  // ===== 10. Chi phí ATVS =====
  costMeasureSafe: string;
  costMeasureHygiene: string;
  costHealthcare: string;
  costTraining: string;
  costProtection: string;
  costRiskEval: string;
  costOthers: string;
  costTotal: string;

  // ===== 11. Dịch vụ =====
  atvsldServiceProvider: string;
  medicalServiceProvider: string;

  // ===== 12. Thời điểm đánh giá =====
  riskAssessmentTime: string;
}

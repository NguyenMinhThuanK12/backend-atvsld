import { ReportDetail } from 'src/entities/report-detail.entity';
import { ReportDetailResponse } from '../models/response/report-detail/report-detail.response';
import { UpdateReportDetailRequest } from '../models/requests/report-detail/update-report-detail.request';

export function mapToReportDetailResponse(entity: ReportDetail): ReportDetailResponse {
  return {
    id: entity.id,
    instanceId: entity.instanceId,

    // ===== 1. Thông tin lao động =====
    totalEmployees: entity.totalEmployees,
    femaleEmployees: entity.femaleEmployees,
    under15Employees: entity.under15Employees,
    atvsldStaff: entity.atvsldStaff,
    medicalStaff: entity.medicalStaff,
    hazardousWorkers: entity.hazardousWorkers,
    minorWorkers: entity.minorWorkers,
    elderlyWorkers: entity.elderlyWorkers,
    disabledWorkers: entity.disabledWorkers,

    // ===== 2. Tai nạn lao động =====
    accidentCases: entity.accidentCases,
    fatalAccidents: entity.fatalAccidents,
    injuredEmployees: entity.injuredEmployees,
    accidentDaysOff: entity.accidentDaysOff,
    accidentCost: entity.accidentCost,

    // ===== 3. Bệnh nghề nghiệp =====
    totalBNNBefore: entity.totalBNNBefore,
    retiredBNN: entity.retiredBNN,
    newBNNCases: entity.newBNNCases,
    bnnLeaveDays: entity.bnnLeaveDays,
    bnnCost: entity.bnnCost,

    // ===== 4. Sức khoẻ lao động =====
    healthTypeI: entity.healthTypeI,
    healthTypeII: entity.healthTypeII,
    healthTypeIII: entity.healthTypeIII,
    healthTypeIV: entity.healthTypeIV,
    healthTypeV: entity.healthTypeV,

    // ===== 5. Huấn luyện =====
    trainingGroup1: entity.trainingGroup1,
    trainingSelf: entity.trainingSelf,
    trainingGroup2: entity.trainingGroup2,
    trainingProvider: entity.trainingProvider,
    trainingGroup3: entity.trainingGroup3,
    trainingGroup4: entity.trainingGroup4,
    trainingGroup5: entity.trainingGroup5,
    trainingGroup6: entity.trainingGroup6,
    trainingCost: entity.trainingCost,

    // ===== 6. Máy móc thiết bị =====
    totalMachines: entity.totalMachines,
    machinesUsing: entity.machinesUsing,
    machinesChecked: entity.machinesChecked,
    machinesDeclared: entity.machinesDeclared,
    machinesUnchecked: entity.machinesUnchecked,

    // ===== 7. Giờ làm việc =====
    totalWorkers: entity.totalWorkers,
    totalWorkingHours: entity.totalWorkingHours,
    maxWorkingHours: entity.maxWorkingHours,

    // ===== 8. Bồi dưỡng chống độc =====
    toxicSupportWorkers: entity.toxicSupportWorkers,
    toxicSupportCost: entity.toxicSupportCost,

    // ===== 9. Quan trắc môi trường =====
    envSamples: entity.envSamples,
    envNotQualified: entity.envNotQualified,
    tempNotQualified: entity.tempNotQualified,
    humidityNotQualified: entity.humidityNotQualified,
    lightNotQualified: entity.lightNotQualified,
    noiseNotQualified: entity.noiseNotQualified,
    gasNotQualified: entity.gasNotQualified,
    dustNotQualified: entity.dustNotQualified,
    radiationNotQualified: entity.radiationNotQualified,
    otherEnvNotQualified: entity.otherEnvNotQualified,

    // ===== 10. Chi phí ATVS =====
    costMeasureSafe: entity.costMeasureSafe,
    costMeasureHygiene: entity.costMeasureHygiene,
    costHealthcare: entity.costHealthcare,
    costTraining: entity.costTraining,
    costProtection: entity.costProtection,
    costRiskEval: entity.costRiskEval,
    costOthers: entity.costOthers,
    costTotal: entity.costTotal,

    // ===== 11. Dịch vụ =====
    atvsldServiceProvider: entity.atvsldServiceProvider,
    medicalServiceProvider: entity.medicalServiceProvider,

    // ===== 12. Thời điểm đánh giá =====
    riskAssessmentTime: entity.riskAssessmentTime,
  };
}
export function mapToReportDetailEntity(dto: UpdateReportDetailRequest): ReportDetail {
  const entity = new ReportDetail();

  entity.instanceId = dto.instanceId;

  // ===== 1. Thông tin lao động =====
  entity.totalEmployees = dto.totalEmployees;
  entity.femaleEmployees = dto.femaleEmployees;
  entity.under15Employees = dto.under15Employees;
  entity.atvsldStaff = dto.atvsldStaff;
  entity.medicalStaff = dto.medicalStaff;
  entity.hazardousWorkers = dto.hazardousWorkers;
  entity.minorWorkers = dto.minorWorkers;
  entity.elderlyWorkers = dto.elderlyWorkers;
  entity.disabledWorkers = dto.disabledWorkers;

  // ===== 2. Tai nạn lao động =====
  entity.accidentCases = dto.accidentCases;
  entity.fatalAccidents = dto.fatalAccidents;
  entity.injuredEmployees = dto.injuredEmployees;
  entity.accidentDaysOff = dto.accidentDaysOff;
  entity.accidentCost = dto.accidentCost;

  // ===== 3. Bệnh nghề nghiệp =====
  entity.totalBNNBefore = dto.totalBNNBefore;
  entity.retiredBNN = dto.retiredBNN;
  entity.newBNNCases = dto.newBNNCases;
  entity.bnnLeaveDays = dto.bnnLeaveDays;
  entity.bnnCost = dto.bnnCost;

  // ===== 4. Sức khoẻ lao động =====
  entity.healthTypeI = dto.healthTypeI;
  entity.healthTypeII = dto.healthTypeII;
  entity.healthTypeIII = dto.healthTypeIII;
  entity.healthTypeIV = dto.healthTypeIV;
  entity.healthTypeV = dto.healthTypeV;

  // ===== 5. Huấn luyện =====
  entity.trainingGroup1 = dto.trainingGroup1;
  entity.trainingSelf = dto.trainingSelf;
  entity.trainingGroup2 = dto.trainingGroup2;
  entity.trainingProvider = dto.trainingProvider;
  entity.trainingGroup3 = dto.trainingGroup3;
  entity.trainingGroup4 = dto.trainingGroup4;
  entity.trainingGroup5 = dto.trainingGroup5;
  entity.trainingGroup6 = dto.trainingGroup6;
  entity.trainingCost = dto.trainingCost;

  // ===== 6. Máy móc thiết bị =====
  entity.totalMachines = dto.totalMachines;
  entity.machinesUsing = dto.machinesUsing;
  entity.machinesChecked = dto.machinesChecked;
  entity.machinesDeclared = dto.machinesDeclared;
  entity.machinesUnchecked = dto.machinesUnchecked;

  // ===== 7. Giờ làm việc =====
  entity.totalWorkers = dto.totalWorkers;
  entity.totalWorkingHours = dto.totalWorkingHours;
  entity.maxWorkingHours = dto.maxWorkingHours;

  // ===== 8. Bồi dưỡng chống độc =====
  entity.toxicSupportWorkers = dto.toxicSupportWorkers;
  entity.toxicSupportCost = dto.toxicSupportCost;

  // ===== 9. Quan trắc môi trường =====
  entity.envSamples = dto.envSamples;
  entity.envNotQualified = dto.envNotQualified;
  entity.tempNotQualified = dto.tempNotQualified;
  entity.humidityNotQualified = dto.humidityNotQualified;
  entity.lightNotQualified = dto.lightNotQualified;
  entity.noiseNotQualified = dto.noiseNotQualified;
  entity.gasNotQualified = dto.gasNotQualified;
  entity.dustNotQualified = dto.dustNotQualified;
  entity.radiationNotQualified = dto.radiationNotQualified;
  entity.otherEnvNotQualified = dto.otherEnvNotQualified;

  // ===== 10. Chi phí ATVS =====
  entity.costMeasureSafe = dto.costMeasureSafe;
  entity.costMeasureHygiene = dto.costMeasureHygiene;
  entity.costHealthcare = dto.costHealthcare;
  entity.costTraining = dto.costTraining;
  entity.costProtection = dto.costProtection;
  entity.costRiskEval = dto.costRiskEval;
  entity.costOthers = dto.costOthers;
  entity.costTotal = dto.costTotal;

  // ===== 11. Dịch vụ =====
  entity.atvsldServiceProvider = dto.atvsldServiceProvider;
  entity.medicalServiceProvider = dto.medicalServiceProvider;

  // ===== 12. Thời điểm đánh giá =====
  entity.riskAssessmentTime = dto.riskAssessmentTime;

  return entity;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReportInstance } from './report-instance.entity';

@Entity('report_details')
export class ReportDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Gắn với bản ghi báo cáo của doanh nghiệp (report instance)
  @ManyToOne(() => ReportInstance)
  @JoinColumn({ name: 'instance_id' })
  reportInstance: ReportInstance;

  @Column({ name: 'instance_id' })
  instanceId: string;

  // ===== 1. Thông tin lao động =====
  @Column({ type: 'varchar', default: '' }) totalEmployees: string;
  @Column({ type: 'varchar', default: '' }) femaleEmployees: string;
  @Column({ type: 'varchar', default: '' }) under15Employees: string;
  @Column({ type: 'varchar', default: '' }) atvsldStaff: string;
  @Column({ type: 'varchar', default: '' }) medicalStaff: string;
  @Column({ type: 'varchar', default: '' }) hazardousWorkers: string;
  @Column({ type: 'varchar', default: '' }) minorWorkers: string;
  @Column({ type: 'varchar', default: '' }) elderlyWorkers: string;
  @Column({ type: 'varchar', default: '' }) disabledWorkers: string;

  // ===== 2. Tai nạn lao động =====
  @Column({ type: 'varchar', default: '' }) accidentCases: string;
  @Column({ type: 'varchar', default: '' }) fatalAccidents: string;
  @Column({ type: 'varchar', default: '' }) injuredEmployees: string;
  @Column({ type: 'varchar', default: '' }) accidentDaysOff: string;
  @Column({ type: 'varchar', default: '' }) accidentCost: string;

  // ===== 3. Bệnh nghề nghiệp =====
  @Column({ type: 'varchar', default: '' }) totalBNNBefore: string;
  @Column({ type: 'varchar', default: '' }) retiredBNN: string;
  @Column({ type: 'varchar', default: '' }) newBNNCases: string;
  @Column({ type: 'varchar', default: '' }) bnnLeaveDays: string;
  @Column({ type: 'varchar', default: '' }) bnnCost: string;

  // ===== 4. Sức khoẻ lao động =====
  @Column({ type: 'varchar', default: '' }) healthTypeI: string;
  @Column({ type: 'varchar', default: '' }) healthTypeII: string;
  @Column({ type: 'varchar', default: '' }) healthTypeIII: string;
  @Column({ type: 'varchar', default: '' }) healthTypeIV: string;
  @Column({ type: 'varchar', default: '' }) healthTypeV: string;

  // ===== 5. Huấn luyện =====
  @Column({ type: 'varchar', default: '' }) trainingGroup1: string;
  @Column({ type: 'varchar', default: '' }) trainingSelf: string;
  @Column({ type: 'varchar', default: '' }) trainingGroup2: string;
  @Column({ type: 'varchar', default: '' }) trainingProvider: string;
  @Column({ type: 'varchar', default: '' }) trainingGroup3: string;
  @Column({ type: 'varchar', default: '' }) trainingGroup4: string;
  @Column({ type: 'varchar', default: '' }) trainingGroup5: string;
  @Column({ type: 'varchar', default: '' }) trainingGroup6: string;
  @Column({ type: 'varchar', default: '' }) trainingCost: string;

  // ===== 6. Máy móc thiết bị =====
  @Column({ type: 'varchar', default: '' }) totalMachines: string;
  @Column({ type: 'varchar', default: '' }) machinesUsing: string;
  @Column({ type: 'varchar', default: '' }) machinesChecked: string;
  @Column({ type: 'varchar', default: '' }) machinesDeclared: string;
  @Column({ type: 'varchar', default: '' }) machinesUnchecked: string;
  // ===== 7. Giờ làm việc =====
  @Column({ type: 'varchar', default: '' }) totalWorkers: string;
  @Column({ type: 'varchar', default: '' }) totalWorkingHours: string;
  @Column({ type: 'varchar', default: '' }) maxWorkingHours: string;
  // ===== 8. Bồi dưỡng chống độc =====
  @Column({ type: 'varchar', default: '' }) toxicSupportWorkers: string;
  @Column({ type: 'varchar', default: '' }) toxicSupportCost: string;

  // ===== 9. Quan trắc môi trường =====
  @Column({ type: 'varchar', default: '' }) envSamples: string;
  @Column({ type: 'varchar', default: '' }) envNotQualified: string;
  @Column({ type: 'varchar', default: '' }) tempNotQualified: string;
  @Column({ type: 'varchar', default: '' }) humidityNotQualified: string;
  @Column({ type: 'varchar', default: '' }) lightNotQualified: string;
  @Column({ type: 'varchar', default: '' }) noiseNotQualified: string;
  @Column({ type: 'varchar', default: '' }) gasNotQualified: string;
  @Column({ type: 'varchar', default: '' }) dustNotQualified: string;
  @Column({ type: 'varchar', default: '' }) radiationNotQualified: string;
  @Column({ type: 'varchar', default: '' }) otherEnvNotQualified: string;

  // ===== 10. Chi phí ATVS =====
  @Column({ type: 'varchar', default: '' }) costMeasureSafe: string;
  @Column({ type: 'varchar', default: '' }) costMeasureHygiene: string;
  @Column({ type: 'varchar', default: '' }) costHealthcare: string;
  @Column({ type: 'varchar', default: '' }) costTraining: string;
  @Column({ type: 'varchar', default: '' }) costProtection: string;
  @Column({ type: 'varchar', default: '' }) costRiskEval: string;
  @Column({ type: 'varchar', default: '' }) costOthers: string;
  @Column({ type: 'varchar', default: '' }) costTotal: string;

  // ===== 11. Dịch vụ =====
  @Column({ type: 'varchar', default: '' }) atvsldServiceProvider: string;
  @Column({ type: 'varchar', default: '' }) medicalServiceProvider: string;

  // ===== 12. Thời điểm đánh giá =====

  @Column({ type: 'varchar', length: 20 }) riskAssessmentTime: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

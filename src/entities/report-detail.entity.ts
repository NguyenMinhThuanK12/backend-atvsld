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
  @Column('int') totalEmployees: number;
  @Column('int') femaleEmployees: number;
  @Column('int') under15Employees: number;
  @Column('int') atvsldStaff: number;
  @Column('int') medicalStaff: number;
  @Column('int') hazardousWorkers: number;
  @Column('int') minorWorkers: number;
  @Column('int') elderlyWorkers: number;
  @Column('int') disabledWorkers: number;

  // ===== 2. Tai nạn lao động =====
  @Column('int') accidentCases: number;
  @Column('int') fatalAccidents: number;
  @Column('int') injuredEmployees: number;
  @Column('int') accidentDaysOff: number;
  @Column('float') accidentCost: number;

  // ===== 3. Bệnh nghề nghiệp =====
  @Column('int') totalBNNBefore: number;
  @Column('int') retiredBNN: number;
  @Column('int') newBNNCases: number;
  @Column('int') bnnLeaveDays: number;
  @Column('float') bnnCost: number;

  // ===== 4. Sức khoẻ lao động =====
  @Column('int') healthTypeI: number;
  @Column('int') healthTypeII: number;
  @Column('int') healthTypeIII: number;
  @Column('int') healthTypeIV: number;
  @Column('int') healthTypeV: number;

  // ===== 5. Huấn luyện =====
  @Column('int') trainingGroup1: number;
  @Column('int') trainingSelf: number;
  @Column('int') trainingGroup2: number;
  @Column('int') trainingProvider: number;
  @Column('int') trainingGroup3: number;
  @Column('int') trainingGroup4: number;
  @Column('int') trainingGroup5: number;
  @Column('int') trainingGroup6: number;
  @Column('float') trainingCost: number;

  // ===== 6. Máy móc thiết bị =====
  @Column('int') totalMachines: number;
  @Column('int') machinesUsing: number;
  @Column('int') machinesChecked: number;
  @Column('int') machinesDeclared: number;
  @Column('int') machinesUnchecked: number;

  // ===== 7. Giờ làm việc =====
  @Column('int') totalWorkers: number;
  @Column('int') totalWorkingHours: number;
  @Column('int') maxWorkingHours: number;

  // ===== 8. Bồi dưỡng chống độc =====
  @Column('int') toxicSupportWorkers: number;
  @Column('float') toxicSupportCost: number;

  // ===== 9. Quan trắc môi trường =====
  @Column('int') envSamples: number;
  @Column('int') envNotQualified: number;
  @Column('int') tempNotQualified: number;
  @Column('int') humidityNotQualified: number;
  @Column('int') lightNotQualified: number;
  @Column('int') noiseNotQualified: number;
  @Column('int') gasNotQualified: number;
  @Column('int') dustNotQualified: number;
  @Column('int') radiationNotQualified: number;
  @Column('int') otherEnvNotQualified: number;

  // ===== 10. Chi phí ATVS =====
  @Column('float') costMeasureSafe: number;
  @Column('float') costMeasureHygiene: number;
  @Column('float') costHealthcare: number;
  @Column('float') costTraining: number;
  @Column('float') costProtection: number;
  @Column('float') costRiskEval: number;
  @Column('float') costOthers: number;
  @Column('float') costTotal: number;

  // ===== 11. Dịch vụ =====
  @Column('text', { nullable: true })
  atvsldServiceProvider: string;
  @Column('text', { nullable: true })
  medicalServiceProvider: string;

  // ===== 12. Thời điểm đánh giá =====
  @Column({ type: 'varchar', length: 20 })
  riskAssessmentTime: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

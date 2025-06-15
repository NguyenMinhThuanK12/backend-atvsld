import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ReportConfiguration } from './report-configuration.entity';
import { Business } from './business.entity';
import { ReportStatusEnum } from '../../libs/shared/ATVSLD/enums/report-status.enum';

@Entity('report_instances')
export class ReportInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ReportConfiguration, (config) => config.instances)
  @JoinColumn({ name: 'config_id' })
  configuration: ReportConfiguration;

  @Column({ name: 'config_id' })
  configId: string;

  @ManyToOne(() => Business)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column({ name: 'business_id' })
  businessId: string;

  @Column({ type: 'enum', enum: ReportStatusEnum, default: ReportStatusEnum.PENDING })
  status: ReportStatusEnum;

  @Column({ name: 'is_overdue', default: false })
  isOverdue: boolean;

  @Column({ name: 'last_updated_date', type: 'timestamp', nullable: true })
  lastUpdatedDate: Date;

  @Column({ name: 'last_updated_by', nullable: true })
  lastUpdatedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

import { ReportPeriodEnum } from '../../libs/shared/ATVSLD/enums/reporting-period.enum';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Unique } from 'typeorm';
import { ReportInstance } from './report-instance.entity';
import { ReportNameEnum } from '../../libs/shared/ATVSLD/enums/report-name.enum';

@Entity('report_configurations')
@Unique(['year', 'reportName']) // chỉ 1 báo cáo 1 năm
export class ReportConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ReportNameEnum, name: 'report_name' })
  reportName: ReportNameEnum;

  @Column()
  year: number;

  @Column({ type: 'enum', enum: ReportPeriodEnum })
  period: ReportPeriodEnum;

  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'is_overdue', default: false })
  isOverdue: boolean;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ReportInstance, (ri) => ri.configuration)
  instances: ReportInstance[];
}

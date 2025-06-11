import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportDetailService } from 'src/services/report-detail/report-detail.service';
import { ReportDetail } from 'src/entities/report-detail.entity';
import { ReportInstance } from 'src/entities/report-instance.entity';
import { ReportDetailRepository } from 'src/repositories/report-detail/report-detail.repository';
import { IReportDetailRepository } from 'src/repositories/report-detail/report-detail.repository.interface';
import { ReportDetailController } from 'src/controllers/report-detail.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ReportDetail, ReportInstance])],
  controllers: [ReportDetailController],
  providers: [
    ReportDetailService,
    {
      provide: 'IReportDetailService',
      useClass: ReportDetailService,
    },
    {
      provide: IReportDetailRepository,
      useClass: ReportDetailRepository,
    },
  ],
  exports: [ReportDetailService],
})
export class ReportDetailModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportInstance } from 'src/entities/report-instance.entity';
import { ReportInstanceController } from 'src/controllers/report-instance.controller';

import { ReportInstanceRepository } from 'src/repositories/report-instance/report-instance.repository';
import { ReportInstanceService } from 'src/services/report-instance/report-instance.service';
import { ReportConfiguration } from 'src/entities/report-configuration.entity';
import { Business } from 'src/entities/business.entity';
import { IReportInstanceRepository } from 'src/repositories/report-instance/report-instance.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([ReportInstance, ReportConfiguration, Business])],
  controllers: [ReportInstanceController],
  providers: [
    ReportInstanceService,
    {
      provide: IReportInstanceRepository,
      useClass: ReportInstanceRepository,
    },
  ],
  exports: [ReportInstanceService],
})
export class ReportInstanceModule {}

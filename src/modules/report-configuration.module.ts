import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportConfiguration } from 'src/entities/report-configuration.entity';
import { ReportConfigurationController } from 'src/controllers/report-configuration.controller';
import { IReportConfigurationRepository } from 'src/repositories/report-configuration/report-configuration.repository.interface';
import { ReportConfigurationRepository } from 'src/repositories/report-configuration/report-configuration.repository';
import { ReportConfigurationService } from 'src/services/report-configuration/report-configuration.service';
import { IBusinessRepository } from 'src/repositories/business/business.repository.interface';
import { BusinessRepository } from 'src/repositories/business/business.respository';
import { Business } from 'src/entities/business.entity';
import { ReportInstance } from 'src/entities/report-instance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReportConfiguration, Business, ReportInstance])],
  controllers: [ReportConfigurationController],
  providers: [
    ReportConfigurationService,
    {
      provide: 'IReportConfigurationService',
      useClass: ReportConfigurationService,
    },
    {
      provide: IReportConfigurationRepository,
      useClass: ReportConfigurationRepository,
    },
    {
      provide: IBusinessRepository,
      useClass: BusinessRepository,
    },
  ],
  exports: [ReportConfigurationService],
})
export class ReportConfigurationModule {}

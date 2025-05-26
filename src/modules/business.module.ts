import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from 'src/entities/business.entity';
import { BusinessController } from 'src/controllers/business.controller';
import { IBusinessRepository } from 'src/repositories/business/business.repository.interface';
import { BusinessService } from 'src/services/business/business.service';
import { BusinessRepository } from 'src/repositories/business/business.respository';
import { BusinessImportService } from 'src/imports/business-import.service';
import { PdfModule } from './pdf.module';
import { SupabaseModule } from 'libs/core/supabase/supabase.module';

@Module({
  imports: [TypeOrmModule.forFeature([Business]), PdfModule, SupabaseModule],
  controllers: [BusinessController],
  providers: [
    BusinessImportService,
    BusinessService,
    {
      provide: IBusinessRepository,
      useClass: BusinessRepository,
    },
  ],
  exports: [BusinessService, BusinessImportService],
})
export class BusinessModule {}

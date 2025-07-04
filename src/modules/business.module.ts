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
import { PermissionModule } from './permission.module';
import { IUserRepository } from 'src/repositories/user/user.repository.interface';
import { UserRepository } from 'src/repositories/user/user.repository';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Business, User]), PdfModule, SupabaseModule, PermissionModule],
  controllers: [BusinessController],
  providers: [
    BusinessImportService,
    BusinessService,
    {
      provide: IBusinessRepository,
      useClass: BusinessRepository,
    },
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  exports: [BusinessService, BusinessImportService],
})
export class BusinessModule {}

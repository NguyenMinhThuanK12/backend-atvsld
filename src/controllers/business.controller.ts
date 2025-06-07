import {
  Controller,
  Get,
  Body,
  Post,
  Query,
  Patch,
  Delete,
  Param,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UploadedFile,
  Res,
  UploadedFiles,
} from '@nestjs/common';
import { BusinessService } from 'src/services/business/business.service';
import { CreateBusinessRequest } from 'libs/shared/ATVSLD/models/requests/business/create-business.request';
import { BusinessResponse } from 'libs/shared/ATVSLD/models/response/business/business.response';
import { UpdateBusinessRequest } from 'libs/shared/ATVSLD/models/requests/business/update-business.request';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';
import { SearchBusinessQueryRequest } from 'libs/shared/ATVSLD/models/requests/business/search-business-query.request';
import { UpdateBusinessStatusRequest } from 'libs/shared/ATVSLD/models/requests/business/update-business-status.request';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Express, Response } from 'express';
import { BusinessImportService } from 'src/imports/business-import.service';
import { ExportBusinessRequest } from 'libs/shared/ATVSLD/models/requests/export/export-business.request';
import { RequirePermission } from 'libs/core/auth/require-permission.decorator';
import { PermissionConstant } from 'libs/shared/ATVSLD/common/permission';
import { Public } from 'libs/core/auth/public.decorator';

@Controller('businesses')
export class BusinessController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly businessImportService: BusinessImportService,
  ) {}

  // ------- PUBLIC -------
  @Get('check-duplicate-tax-code')
  async checkDuplicateTaxCode(@Query('taxCode') taxCode: string, @Query('excludeId') excludeId?: string) {
    return this.businessService.checkDuplicateTaxCode(taxCode, excludeId);
  }

  @Get('check-duplicate-email')
  async checkDuplicateEmail(@Query('email') email: string, @Query('excludeId') excludeId?: string) {
    return this.businessService.checkDuplicateEmail(email, excludeId);
  }

  // ------- VIEW -------
  @RequirePermission(PermissionConstant.BUSINESS.VIEW)
  @Get()
  async getAllBusiness(@Query() query: PaginationQueryRequest) {
    return this.businessService.findAllPaginated(query);
  }

  @RequirePermission(PermissionConstant.BUSINESS.CREATE)
  @Get('search')
  async findAdvancedBusiness(@Query() query: SearchBusinessQueryRequest) {
    return this.businessService.findAdvanced(query);
  }

  @Public()
  @Get('active')
  async getActiveBusinesses(): Promise<ApiResponse<BusinessResponse[]>> {
    return this.businessService.findActive();
  }

  @RequirePermission(PermissionConstant.BUSINESS.VIEW)
  @Get(':id')
  async getBusinessById(@Param('id') id: string): Promise<ApiResponse<BusinessResponse>> {
    return this.businessService.findById(id);
  }

  @RequirePermission(PermissionConstant.BUSINESS.VIEW)
  @Post('export')
  async exportPdf(@Body() dto: ExportBusinessRequest, @Res() res: Response): Promise<void> {
    const pdfBuffer = await this.businessService.exportPdf(dto.ids);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="danhsach_doanhnghiep.pdf"',
    });
    res.send(pdfBuffer);
  }

  // ------- CREATE -------
  @RequirePermission(PermissionConstant.BUSINESS.CREATE)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'businessLicense', maxCount: 1 },
      { name: 'otherDocument', maxCount: 1 },
    ]),
  )
  async createBusinessWithFiles(
    @UploadedFiles() files: { businessLicense?: Express.Multer.File[]; otherDocument?: Express.Multer.File[] },
    @Body() dto: CreateBusinessRequest,
  ): Promise<ApiResponse<BusinessResponse>> {
    return this.businessService.create(dto, files);
  }

  @RequirePermission(PermissionConstant.BUSINESS.CREATE)
  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const name = path.basename(file.originalname, ext);
          cb(null, `${name}-${Date.now()}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx)$/)) {
          return cb(new Error('Chỉ chấp nhận file Excel .xlsx'), false);
        }
        cb(null, true);
      },
    }),
  )
  async importFromExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('Không có file nào được upload', HttpStatus.BAD_REQUEST);
    }
    return this.businessImportService.importFromExcel(file.path);
  }

  // ------- UPDATE -------
  @RequirePermission(PermissionConstant.BUSINESS.UPDATE)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBusinessStatusRequest,
  ): Promise<ApiResponse<BusinessResponse>> {
    return this.businessService.updateStatus(id, dto.isActive);
  }

  @RequirePermission(PermissionConstant.BUSINESS.UPDATE)
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'businessLicense', maxCount: 1 },
      { name: 'otherDocument', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @UploadedFiles() files,
    @Body() dto: UpdateBusinessRequest,
  ): Promise<ApiResponse<BusinessResponse>> {
    return this.businessService.update(id, dto, files);
  }

  // ------- DELETE -------
  @RequirePermission(PermissionConstant.BUSINESS.DELETE)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponse<null>> {
    return this.businessService.delete(id);
  }
}

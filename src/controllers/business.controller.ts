import {
  Controller,
  Get,
  UseGuards,
  Body,
  Post,
  Query,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UploadedFile,
  Header,
  Res,
  UploadedFiles,
} from '@nestjs/common';
import { JwtAuthGuard } from 'libs/core/auth/jwt-auth.guard';
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
import { Express } from 'express';
import { Response } from 'express';
import { BusinessImportService } from 'src/imports/business-import.service';
import { ExportBusinessRequest } from 'libs/shared/ATVSLD/models/requests/export/export-business.request';


@Controller('business')
export class BusinessController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly businessImportService: BusinessImportService,
  ) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  async getAllBusiness(@Query() query: PaginationQueryRequest) {
    return this.businessService.findAllPaginated(query);
  }

  @Get('search')
  // @UseGuards(JwtAuthGuard)
  async findAdvancedBusiness(@Query() query: SearchBusinessQueryRequest) {
    return this.businessService.findAdvanced(query);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'businessLicense', maxCount: 1 },
        { name: 'otherDocument', maxCount: 1 },
      ],
      {
        fileFilter: (req, file, cb) => {
          if (!file.originalname.match(/\.(pdf)$/)) {
            return cb(new Error('Chỉ cho phép file PDF'), false);
          }
          cb(null, true);
        },
      },
    ),
  )
  async createBusinessWithFiles(
    @UploadedFiles()
    files: {
      businessLicense?: Express.Multer.File[];
      otherDocument?: Express.Multer.File[];
    },
    @Body() dto: CreateBusinessRequest,
  ): Promise<ApiResponse<BusinessResponse>> {
    return this.businessService.create(dto, files);
  }

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

  @Patch(':id/status')
  // @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBusinessStatusRequest,
  ): Promise<ApiResponse<BusinessResponse>> {
    return this.businessService.updateStatus(id, dto.isActive);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'businessLicense', maxCount: 1 },
      { name: 'otherDocument', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files,
    @Body() dto: UpdateBusinessRequest,
  ): Promise<ApiResponse<BusinessResponse>> {
    return this.businessService.update(id, dto, files);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<null>> {
    return this.businessService.delete(id);
  }
  @Post('export')
  async exportPdf(@Body() dto: ExportBusinessRequest, @Res() res: Response): Promise<void> {
    const pdfBuffer = await this.businessService.exportPdf(dto.ids);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="danhsach_doanhnghiep.pdf"',
    });
    res.send(pdfBuffer);
  }
}

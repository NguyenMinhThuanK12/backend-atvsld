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
} from '@nestjs/common';
import { JwtAuthGuard } from 'libs/core/auth/jwt-auth.guard';
import { DepartmentService } from 'src/services/department/department.service';
import { CreateDepartmentRequest } from 'libs/shared/ATVSLD/models/requests/department/create-department.request';
import { DepartmentResponse } from 'libs/shared/ATVSLD/models/response/department/department.response';

import { UpdateDepartmentRequest } from 'libs/shared/ATVSLD/models/requests/department/update-department.request';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';
import { SearchDepartmentQueryRequest } from 'libs/shared/ATVSLD/models/requests/department/search-department-query.request';
import { UpdateDepartmentStatusRequest } from 'libs/shared/ATVSLD/models/requests/department/update-department-status.request';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Express } from 'express';
import { Response } from 'express';
import { DepartmentImportService } from 'src/imports/department-import.service';
import { ExportDepartmentRequest } from 'libs/shared/ATVSLD/models/requests/export/export-department.request';

@Controller('departments')
export class DepartmentController {
  constructor(
    private readonly departmentService: DepartmentService,
    private readonly departmentImportService: DepartmentImportService,
  ) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  async getAllDepartments(@Query() query: PaginationQueryRequest) {
    return this.departmentService.findAllPaginated(query);
  }

  @Get('search')
  // @UseGuards(JwtAuthGuard)
  async findAdvancedDepartments(@Query() query: SearchDepartmentQueryRequest) {
    return this.departmentService.findAdvanced(query);
  }

  @Post()
  // @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateDepartmentRequest): Promise<ApiResponse<DepartmentResponse>> {
    return this.departmentService.create(dto);
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

    return this.departmentImportService.importFromExcel(file.path);
  }

  @Patch(':id/status')
  // @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDepartmentStatusRequest,
  ): Promise<ApiResponse<DepartmentResponse>> {
    return this.departmentService.updateStatus(id, dto.isActive);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDepartmentRequest,
  ): Promise<ApiResponse<DepartmentResponse>> {
    return this.departmentService.update(id, dto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<null>> {
    return this.departmentService.delete(id);
  }
  @Post('export')
  async exportPdf(@Body() dto: ExportDepartmentRequest, @Res() res: Response): Promise<void> {
    const pdfBuffer = await this.departmentService.exportPdf(dto.ids);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="danhsach_doanhnghiep.pdf"',
    });
    res.send(pdfBuffer);
  }
}

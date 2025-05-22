import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Body,
  Post,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'libs/core/auth/jwt-auth.guard';
import { DepartmentService } from 'src/services/department/department.service';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { CreateDepartmentRequest } from 'libs/shared/ATVSLD/models/requests/department/create-department.request';
import { DepartmentResponse } from 'libs/shared/ATVSLD/models/response/department/department.response';
import { PaginationQueryDto } from 'libs/shared/ATVSLD/common/pagination-query.dto';
import { SUCCESS_GET_DEPARTMENT_LIST } from 'libs/shared/ATVSLD/constants/department-message.constant';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllDepartments(@Query() query: PaginationQueryDto) {
    return this.departmentService.findAllPaginated(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateDepartmentRequest,
  ): Promise<DepartmentResponse> {
    return this.departmentService.create(dto);
  }
}

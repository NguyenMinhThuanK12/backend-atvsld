import { Controller, Get, UseGuards, Body, Post, Query, Patch, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'libs/core/auth/jwt-auth.guard';
import { DepartmentService } from 'src/services/department/department.service';
import { CreateDepartmentRequest } from 'libs/shared/ATVSLD/models/requests/department/create-department.request';
import { DepartmentResponse } from 'libs/shared/ATVSLD/models/response/department/department.response';

import { UpdateDepartmentRequest } from 'libs/shared/ATVSLD/models/requests/department/update-department.request';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';
import { SearchDepartmentQueryRequest } from 'libs/shared/ATVSLD/models/requests/department/search-department-query.request';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

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
}

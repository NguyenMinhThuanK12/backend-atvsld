import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { RoleService } from 'src/services/role/role.service';
import { CreateRoleRequest } from 'libs/shared/ATVSLD/models/requests/role/create-role.request';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { RoleResponse } from 'libs/shared/ATVSLD/models/response/role/role.response';
import { UpdateRoleRequest } from 'libs/shared/ATVSLD/models/requests/role/update-role.request';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async findAllPaginated(
    @Query() query: PaginationQueryRequest,
  ): Promise<ApiResponse<PaginatedResponse<RoleResponse>>> {
    return this.roleService.findAllPaginated(query);
  }

  @Post()
  async create(@Body() dto: CreateRoleRequest): Promise<ApiResponse<RoleResponse>> {
    return this.roleService.createRole(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRoleRequest): Promise<ApiResponse<RoleResponse>> {
    return this.roleService.updateRole(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponse<null>> {
    return this.roleService.deleteRole(id);
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { RoleService } from 'src/services/role/role.service';
import { CreateRoleRequest } from 'libs/shared/ATVSLD/models/requests/role/create-role.request';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { RoleResponse } from 'libs/shared/ATVSLD/models/response/role/role.response';
import { UpdateRoleRequest } from 'libs/shared/ATVSLD/models/requests/role/update-role.request';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';
import { SearchRoleQueryRequest } from 'libs/shared/ATVSLD/models/requests/role/search-role-query.request';
import { RequirePermission } from 'libs/core/auth/require-permission.decorator';
import { PermissionConstant } from 'libs/shared/ATVSLD/common/permission';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // ------- VIEW -------
  @RequirePermission(PermissionConstant.ROLE.VIEW)
  @Get()
  async getPaginatedRoles(
    @Query() query: PaginationQueryRequest,
  ): Promise<ApiResponse<PaginatedResponse<RoleResponse>>> {
    return this.roleService.getPaginatedRoles(query);
  }

  @RequirePermission(PermissionConstant.ROLE.VIEW)
  @Get('search')
  async search(@Query() query: SearchRoleQueryRequest): Promise<ApiResponse<PaginatedResponse<RoleResponse>>> {
    return this.roleService.findAdvanced(query);
  }

  @RequirePermission(PermissionConstant.ROLE.VIEW)
  @Get(':id')
  async getById(@Param('id') id: string): Promise<ApiResponse<RoleResponse>> {
    return this.roleService.findById(id);
  }

  // ------- CREATE -------
  @RequirePermission(PermissionConstant.ROLE.CREATE)
  @Post()
  async create(@Body() dto: CreateRoleRequest): Promise<ApiResponse<RoleResponse>> {
    return this.roleService.createRole(dto);
  }

  // ------- UPDATE -------
  @RequirePermission(PermissionConstant.ROLE.UPDATE)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRoleRequest): Promise<ApiResponse<RoleResponse>> {
    return this.roleService.updateRole(id, dto);
  }

  // ------- DELETE -------
  @RequirePermission(PermissionConstant.ROLE.DELETE)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponse<null>> {
    return this.roleService.deleteRole(id);
  }
}

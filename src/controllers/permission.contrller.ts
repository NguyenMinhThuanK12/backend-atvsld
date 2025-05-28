import { Controller, Get, Query } from '@nestjs/common';
import { PermissionService } from 'src/services/permission/permission.service';
import { PaginationQueryRequest } from 'libs/shared/ATVSLD/common/pagination-query.request';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { PermissionResponse } from 'libs/shared/ATVSLD/models/response/permission/permission.response';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('groups')
  async getGroups(
    @Query() query: PaginationQueryRequest & { code?: string; name?: string },
  ): Promise<ApiResponse<PaginatedResponse<PermissionResponse>>> {
    return this.permissionService.getGroupPermissions(query);
  }

  @Get('components')
  async getComponentPermissions(@Query('parentCode') parentCode: string): Promise<ApiResponse<PermissionResponse[]>> {
    return this.permissionService.getComponentPermissionsByGroup(parentCode);
  }
}

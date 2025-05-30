import { Controller, Get, Query } from '@nestjs/common';
import { PermissionService } from 'src/services/permission/permission.service';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { PermissionResponse } from 'libs/shared/ATVSLD/models/response/permission/permission.response';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { RequirePermission } from 'libs/core/auth/require-permission.decorator';
import { PermissionConstant } from 'libs/shared/ATVSLD/constants/permission-message.constant';
import { SearchPermissionGroupRequest } from 'libs/shared/ATVSLD/models/requests/permission/search-permission-group.request';
import { SearchPermissionComponentRequest } from 'libs/shared/ATVSLD/models/requests/permission/search-permission-component.request';
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // ------- VIEW -------
  @RequirePermission(PermissionConstant.PERMISSION.VIEW)
  @Get('groups')
  async getGroups(
    @Query() query: SearchPermissionGroupRequest,
  ): Promise<ApiResponse<PaginatedResponse<PermissionResponse>>> {
    return this.permissionService.getGroupPermissions(query);
  }

  @RequirePermission(PermissionConstant.PERMISSION.VIEW)
  @Get('components')
  async getComponentPermissions(
    @Query() query: SearchPermissionComponentRequest,
  ): Promise<ApiResponse<PermissionResponse[]>> {
    return this.permissionService.getComponentPermissionsByGroup(query);
  }
}

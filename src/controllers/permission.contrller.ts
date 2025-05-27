import { Controller, Get } from '@nestjs/common';
import { PermissionService } from 'src/services/permission/permission.service';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { PermissionResponse } from 'libs/shared/ATVSLD/models/response/permission/permission.response';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}
  @Get('grouped')
  async getTree(): Promise<ApiResponse<PermissionResponse[]>> {
    return this.permissionService.getGroupedPermissions();
  }
}

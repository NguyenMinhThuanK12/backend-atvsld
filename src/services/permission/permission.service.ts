import { Inject, Injectable } from '@nestjs/common';
import {
  IPermissionRepository,
  IPermissionRepository as IPermissionRepoToken,
} from 'src/repositories/permission/permission.repository.interface';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { mapToPermissionResponse } from 'libs/shared/ATVSLD/mappers/permission.mapper';
import { SUCCESS_GET_PERMISSION_GROUPED } from 'libs/shared/ATVSLD/constants/permission-message.constant';
import { PaginatedResponse } from 'libs/shared/ATVSLD/common/paginated-response';
import { PermissionResponse } from 'libs/shared/ATVSLD/models/response/permission/permission.response';
import { IPermissionService } from './permission.service.interface';
import { SearchPermissionGroupRequest } from 'libs/shared/ATVSLD/models/requests/permission/search-permission-group.request';
import { SearchPermissionComponentRequest } from 'libs/shared/ATVSLD/models/requests/permission/search-permission-component.request';

@Injectable()
export class PermissionService implements IPermissionService {
  constructor(
    @Inject(IPermissionRepoToken)
    private readonly permissionRepo: IPermissionRepository,
  ) {}

  async getGroupPermissions(query: SearchPermissionGroupRequest) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const [items, total] = await this.permissionRepo.findGroupPaginated(query);
    const data = items.map((item) => mapToPermissionResponse(item));

    const response: PaginatedResponse<PermissionResponse> = {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };

    return ApiResponse.success(200, SUCCESS_GET_PERMISSION_GROUPED, response);
  }

  async getComponentPermissionsByGroup(query: SearchPermissionComponentRequest) {
    const items = await this.permissionRepo.findComponentsByParentCode(query);
    const data = items.map(mapToPermissionResponse);

    return ApiResponse.success(200, SUCCESS_GET_PERMISSION_GROUPED, data);
  }
}

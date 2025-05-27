import { Inject, Injectable } from '@nestjs/common';
import {
  IPermissionRepository,
  IPermissionRepository as IPermissionRepoToken,
} from 'src/repositories/permission/permission.repository.interface';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { PermissionEnum } from 'libs/shared/ATVSLD/enums/permission.enum';
import { PermissionResponse } from 'libs/shared/ATVSLD/models/response/permission/permission.response';
import { mapToPermissionResponse } from 'libs/shared/ATVSLD/mappers/permission.mapper';
import { SUCCESS_GET_PERMISSION_GROUPED } from 'libs/shared/ATVSLD/constants/permission-message.constant';

@Injectable()
export class PermissionService {
  constructor(
    @Inject(IPermissionRepoToken)
    private readonly permissionRepo: IPermissionRepository,
  ) {}

  async getGroupedPermissions(): Promise<ApiResponse<PermissionResponse[]>> {
    const all = await this.permissionRepo.findAll();
    const groups = all.filter((p) => p.type === PermissionEnum.GROUP);
    const components = all.filter((p) => p.type === PermissionEnum.COMPONENT);

    const result: PermissionResponse[] = groups.map((group) => {
      const children = components.filter((c) => c.parentCode === group.code).map((c) => mapToPermissionResponse(c));

      return mapToPermissionResponse(group, children);
    });

    return ApiResponse.success(200, SUCCESS_GET_PERMISSION_GROUPED, result);
  }
}

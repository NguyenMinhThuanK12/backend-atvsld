import { PermissionEnum } from 'libs/shared/ATVSLD/enums/permission.enum';

export class PermissionResponse {
  id: string;
  code: string;
  name: string;
  type: PermissionEnum; // 'Group' | 'Component'
  parentCode?: string; // chỉ có nếu là Component
}

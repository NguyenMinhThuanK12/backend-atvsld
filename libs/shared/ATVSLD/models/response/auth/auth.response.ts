import { PermissionMap } from 'libs/shared/ATVSLD/common/permission';

export interface AuthResponse {
  userAuthenticated: {
    id: string;
    full_name: string;
    permissions: PermissionMap;
  };
  access_token: string;
  refresh_token: string;
}

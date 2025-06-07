import { PermissionMap } from 'libs/shared/ATVSLD/common/permission';

export interface AuthResponse {
  userAuthenticated: {
    id: string;
    full_name: string;
    user_type: string;
    avatar: string;
    permissions?: PermissionMap; // chỉ có nếu là ADMIN
  };
  access_token: string;
  refresh_token: string;
}

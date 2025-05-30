// ERROR messages
export const ERROR_PERMISSION_NOT_FOUND_BY_ID = 'Không tìm thấy quyền theo ID';
export const ERROR_PERMISSION_GROUP_NOT_FOUND = 'Nhóm quyền không tồn tại';

// SUCCESS messages
export const SUCCESS_GET_PERMISSION_GROUPED = 'Lấy danh sách quyền theo nhóm thành công';

export const PermissionConstant = {
  BUSINESS: {
    VIEW: 'ADMIN.C_BUSINESS_VIEW',
    CREATE: 'ADMIN.C_BUSINESS_CREATE',
    UPDATE: 'ADMIN.C_BUSINESS_UPDATE',
    DELETE: 'ADMIN.C_BUSINESS_DELETE',
  },
  ROLE: {
    VIEW: 'ADMIN.C_ROLE_VIEW',
    CREATE: 'ADMIN.C_ROLE_CREATE',
    UPDATE: 'ADMIN.C_ROLE_UPDATE',
    DELETE: 'ADMIN.C_ROLE_DELETE',
  },
  USER: {
    VIEW: 'ADMIN.C_USER_VIEW',
    CREATE: 'ADMIN.C_USER_CREATE',
    UPDATE: 'ADMIN.C_USER_UPDATE',
    DELETE: 'ADMIN.C_USER_DELETE',
  },
  PERMISSION: {
    VIEW: 'ADMIN.C_PERMISSION_VIEW',
  },
} as const;

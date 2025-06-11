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
  REPORT_CONFIGURATION: {
    CREATE: 'ADMIN.C_REPORT_CONFIGURATION_CREATE',
    UPDATE: 'ADMIN.C_REPORT_CONFIGURATION_UPDATE',
  },
} as const;
type PermissionGroupKeys = keyof typeof PermissionConstant;

export type PermissionMap = {
  [GroupKey in PermissionGroupKeys]: {
    [ActionKey in keyof (typeof PermissionConstant)[GroupKey]]: boolean;
  };
};

export function mapPermissionsToBooleanObject(codes: string[]): PermissionMap {
  const temp: Partial<{
    [K in PermissionGroupKeys]: Record<string, boolean>;
  }> = {};

  for (const groupKey in PermissionConstant) {
    const group = PermissionConstant[groupKey as PermissionGroupKeys];
    const groupPermissions: Record<string, boolean> = {};

    for (const actionKey in group) {
      const permissionCode = group[actionKey as keyof typeof group];
      groupPermissions[actionKey] = codes.includes(permissionCode);
    }

    temp[groupKey as PermissionGroupKeys] = groupPermissions;
  }

  return temp as PermissionMap;
}

import { applyDecorators, UseGuards } from '@nestjs/common';
import { Permission } from './permissions.decorator';
import { PermissionsGuard } from './permissions.guard';

export function RequirePermission(...permissions: string[]) {
  return applyDecorators(Permission(...permissions), UseGuards(PermissionsGuard));
}

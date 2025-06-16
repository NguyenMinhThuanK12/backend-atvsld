import { Injectable, CanActivate, ExecutionContext, Inject, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IPermissionRepository } from 'src/repositories/permission/permission.repository.interface';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { ERROR_FORBIDDEN } from 'libs/shared/ATVSLD/constants/auth-message.constant';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(IPermissionRepository)
    private readonly permissionRepo: IPermissionRepository,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissionDisabled = this.configService.get('PERMISSION_DISABLED');
    if (permissionDisabled) return true;

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return false;

    const userPermissions = await this.permissionRepo.getPermissionCodesByUserId(user.id);
    const hasPermission = requiredPermissions.every((perm) => userPermissions.includes(perm));

    if (!hasPermission) {
      throw new ForbiddenException(ERROR_FORBIDDEN);
    }

    return true;
  }
}

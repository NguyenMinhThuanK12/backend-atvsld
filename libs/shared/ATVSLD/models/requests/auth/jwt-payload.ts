import { UserTypeEnum } from 'libs/shared/ATVSLD/enums/user-type.enum';

export interface JwtPayload {
  id: string;
  userType: UserTypeEnum;
  businessId?: string;
}

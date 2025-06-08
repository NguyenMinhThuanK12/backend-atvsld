import { User } from 'src/entities/user.entity';
import { UserResponse } from '../models/response/user/user.response';
import { CreateUserRequest } from '../models/requests/user/create-user.request';

export function mapToUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    username: user.username,
    password: user.password,
    fullName: user.fullName,
    birthday: user.birthday || null,
    email: user.email,
    phoneNumber: user.phoneNumber,
    jobTitle: user.jobTitle,
    roleId: user.roleId || null,
    businessId: user.businessId || null,
    userType: user.userType,
    gender: user.gender,
    is_active: user.isActive,
    avatar: user.avatar,
    address: user.address || null,
    province: user.province || null,
    district: user.district || null,
    ward: user.ward || null,
  };
}

export function mapToUserEntity(dto: CreateUserRequest): User {
  const user = new User();
  user.username = dto.username;
  user.password = dto.password;
  user.fullName = dto.fullName;
  user.jobTitle = dto.jobTitle;
  user.gender = dto.gender;
  user.userType = dto.userType;
  user.birthday = dto.birthday ? new Date(dto.birthday) : null;
  user.email = dto.email;
  user.phoneNumber = dto.phoneNumber;
  user.roleId = dto.roleId || null;
  user.businessId = dto.businessId || null;
  user.province = dto.province || null;
  user.district = dto.district || null;
  user.ward = dto.ward || null;
  user.address = dto.address || null;
  user.avatar = dto.avatar || null;
  return user;
}

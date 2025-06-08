import { User } from 'src/entities/user.entity';
import { UserResponse } from '../models/response/user/user.response';
import { CreateUserRequest } from '../models/requests/user/create-user.request';
export function mapToUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    username: user.account,
    password: user.password,
    fullName: user.full_name,
    birthday: user.birthday || null,
    email: user.email,
    phoneNumber: user.phone,
    jobTitle: user.job_title,
    roleId: user.role_id || null,
    businessId: user.business_id || null,
    userType: user.user_type,
    gender: user.gender,
    is_active: user.is_active,
    avatar: user.avatar_url,
    address: user.address || null,
    province: user.province || null,
    district: user.district || null,
    ward: user.ward || null,
  };
}
export function mapToUserEntity(dto: CreateUserRequest): User {
  const user = new User();
  user.account = dto.username;
  user.password = dto.password; // bcrypt xử lý trước khi gọi hàm
  user.full_name = dto.fullName;
  user.job_title = dto.jobTitle;
  user.gender = dto.gender;
  user.user_type = dto.userType;
  user.birthday = dto.birthday ? new Date(dto.birthday) : null;
  user.email = dto.email;
  user.phone = dto.phoneNumber;
  user.role_id = dto.roleId || null;
  user.business_id = dto.businessId || null;
  user.province = dto.province || null;
  user.district = dto.district || null;
  user.ward = dto.ward || null;
  user.address = dto.address || null;
  user.avatar_url = dto.avatar || null;
  return user;
}

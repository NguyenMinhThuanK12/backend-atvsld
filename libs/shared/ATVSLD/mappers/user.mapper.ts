import { User } from 'src/entities/user.entity';
import { UserResponse } from '../models/response/user/user.response';
import { CreateUserRequest } from '../models/requests/user/create-user.request';
export function mapToUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    account: user.account,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    job_title: user.job_title,
    role: {
      id: user.role?.id,
      name: user.role?.name,
    },
    user_type: user.user_type,
    gender: user.gender,
    is_active: user.is_active,
    avatar_url: user.avatar_url,
    created_at: user.created_at.toISOString(),
  };
}
export function mapToUserEntity(dto: CreateUserRequest): User {
  const user = new User();
  user.account = dto.account;
  user.password = dto.password; // bcrypt xử lý trước khi gọi hàm
  user.full_name = dto.full_name;
  user.job_title = dto.job_title;
  user.gender = dto.gender;
  user.user_type = dto.user_type;
  user.birthday = dto.birthday ? new Date(dto.birthday) : null;
  user.email = dto.email;
  user.phone = dto.phone;
  user.business_id = dto.business_id;
  user.role = { id: dto.role_id } as any;
  user.avatar_url = dto.avatar_url || null;
  return user;
}

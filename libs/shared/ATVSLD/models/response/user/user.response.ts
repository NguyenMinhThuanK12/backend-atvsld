export class UserResponse {
  id: string;
  username: string;
  password: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  roleId: string | null;
  businessId: string | null;
  userType: string;
  gender: string;
  is_active: boolean;
  avatar?: string;
  address?: string | null;
  province?: string | null;
  district?: string | null;
  ward?: string | null;
  birthday?: Date | null;
}

export class UserResponse {
  id: string;
  account: string;
  full_name: string;
  email: string;
  phone: string;
  job_title: string;
  role: { id: string; name: string };
  user_type: string;
  gender: string;
  is_active: boolean;
  avatar_url?: string;
  created_at: string;
}

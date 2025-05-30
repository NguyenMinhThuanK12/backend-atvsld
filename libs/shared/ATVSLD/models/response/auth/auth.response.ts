export interface AuthResponse {
  userAuthenticated: {
    id: string;
    full_name: string;
    permissions: string[];
  };
  access_token: string;
  refresh_token: string;
}

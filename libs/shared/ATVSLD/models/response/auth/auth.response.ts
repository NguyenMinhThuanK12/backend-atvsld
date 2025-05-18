import { UserAuthenticatedResponse } from "../user/userAuthenticated";

export interface AuthResponse {
  userAuthenticated: UserAuthenticatedResponse;
  access_token: string;
  refresh_token: string;
}
  
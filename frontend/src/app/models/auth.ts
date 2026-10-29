export interface AuthUser {
  id: number;
  name: string;
  team_id: number | null;
  job_role_id: number | null;
  is_admin: boolean;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

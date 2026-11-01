export interface TeamMember {
  id: number;
  name: string;
  job_role_name: string | null;
  is_self: boolean;
  is_teammate: boolean;
  status: 'not_started' | 'draft' | 'submitted';
}

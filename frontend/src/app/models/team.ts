export interface TeamMember {
  id: number;
  name: string;
  job_role_name: string | null;
  status: 'not_started' | 'draft' | 'submitted';
}

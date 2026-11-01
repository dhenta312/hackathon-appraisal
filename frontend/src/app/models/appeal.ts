export interface Appeal {
  id: number;
  user_id: number;
  period: string;
  reason: string;
  status: string;
  user?: { id: number; name: string };
}

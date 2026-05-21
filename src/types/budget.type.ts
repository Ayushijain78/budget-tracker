export interface Budget {
  id: string;
  category: string;
  limit_amount: number;
  user_id?: string;
  created_at?: string;
}
export interface Period {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_open: boolean;
}

export interface AnswerChoice {
  id: number;
  question_id: number;
  label: string;
  point_value: number;
  sort_order: number;
}

export interface ComponentItem {
  id: number;
  code: string;
  name: string;
  weight: number;
}

export interface SettingsQuestion {
  id: number;
  text: string;
  component_id: number;
  job_role_id: number | null;
  sort_order: number;
  component?: { id: number; code: string; name: string; weight: number };
  job_role?: { id: number; name: string } | null;
  choices: AnswerChoice[];
}

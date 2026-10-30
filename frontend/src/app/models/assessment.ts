export interface AssessmentChoice {
  id: number;
  label: string;
  point_value: number;
}

export interface AssessmentQuestion {
  id: number;
  text: string;
  sort_order: number;
  choices: AssessmentChoice[];
}

export interface AssessmentComponent {
  id: number;
  code: string;
  name: string;
  weight: number;
  questions: AssessmentQuestion[];
}

export interface DraftScore {
  question_id: number;
  value: number;
}

export interface DraftReason {
  component_id: number;
  text: string;
}

export interface AssessmentDraft {
  scores: DraftScore[];
  reasons: DraftReason[];
}

export interface AssessmentTemplate {
  assessed: {
    id: number;
    name: string;
    job_role_name: string | null;
  };
  components: AssessmentComponent[];
  draft: AssessmentDraft | null;
}

export interface SaveAssessmentPayload {
  action: 'draft' | 'submit';
  scores: DraftScore[];
  reasons: DraftReason[];
}

export interface SaveAssessmentResponse {
  id: number;
  status: string;
}

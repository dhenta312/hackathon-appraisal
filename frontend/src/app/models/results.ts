export interface AssessorReason {
  question_id: number;
  question_text: string;
  text: string;
}

export interface AssessorScore {
  label: string;
  score: number | null;
  reasons: AssessorReason[];
}

export interface ResultComponent {
  code: string;
  name: string;
  weight: number;
  score: number | null;
  per_assessor: AssessorScore[];
}

export interface ResultPayload {
  total: number | null;
  components: ResultComponent[];
  attendance: {
    points: number;
    max: number;
  };
}

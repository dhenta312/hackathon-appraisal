export interface AssessorScore {
  label: string;
  score: number | null;
  reason: string;
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

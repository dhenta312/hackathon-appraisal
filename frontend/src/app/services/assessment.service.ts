import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../api-url';
import {
  AssessmentTemplate,
  SaveAssessmentPayload,
  SaveAssessmentResponse,
} from '../models/assessment';

@Injectable({ providedIn: 'root' })
export class AssessmentService {
  private readonly http = inject(HttpClient);

  load(assessedId: number): Observable<AssessmentTemplate> {
    return this.http.get<AssessmentTemplate>(`${API_URL}/assessments/${assessedId}`);
  }

  save(assessedId: number, payload: SaveAssessmentPayload): Observable<SaveAssessmentResponse> {
    return this.http.post<SaveAssessmentResponse>(`${API_URL}/assessments/${assessedId}`, payload);
  }
}

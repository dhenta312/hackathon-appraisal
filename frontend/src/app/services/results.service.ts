import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../api-url';
import { ResultPayload } from '../models/results';

@Injectable({ providedIn: 'root' })
export class ResultsService {
  private readonly http = inject(HttpClient);

  get(userId: number): Observable<ResultPayload> {
    return this.http.get<ResultPayload>(`${API_URL}/results/${userId}`);
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../api-url';
import { Appeal } from '../models/appeal';

@Injectable({ providedIn: 'root' })
export class AppealService {
  private readonly http = inject(HttpClient);

  submit(reason: string): Observable<{ appeal: Appeal }> {
    return this.http.post<{ appeal: Appeal }>(`${API_URL}/appeals`, { reason });
  }
}

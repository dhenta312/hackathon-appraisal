import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { API_URL } from '../api-url';
import { TeamMember } from '../models/team';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly http = inject(HttpClient);

  list(): Observable<TeamMember[]> {
    return this.http
      .get<{ members: TeamMember[] }>(`${API_URL}/team`)
      .pipe(map((response) => response.members));
  }
}

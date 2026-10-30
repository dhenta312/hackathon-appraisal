import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../api-url';
import { AnswerChoice, Period, ComponentItem, SettingsQuestion } from '../models/settings';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly http = inject(HttpClient);

  getPeriods(): Observable<{ periods: Period[] }> {
    return this.http.get<{ periods: Period[] }>(`${API_URL}/settings/periods`);
  }

  createPeriod(data: { name: string; start_date: string; end_date: string }): Observable<{ period: Period }> {
    return this.http.post<{ period: Period }>(`${API_URL}/settings/periods`, data);
  }

  togglePeriod(id: number): Observable<{ period: Period }> {
    return this.http.post<{ period: Period }>(`${API_URL}/settings/periods/${id}/toggle`, {});
  }

  getQuestions(): Observable<{
    questions: SettingsQuestion[];
    components: ComponentItem[];
    roles: { id: number; name: string }[];
  }> {
    return this.http.get<any>(`${API_URL}/settings/questions`);
  }

  createQuestion(data: {
    text: string;
    component_id: number;
    job_role_id: number | null;
  }): Observable<{ question: SettingsQuestion }> {
    return this.http.post<{ question: SettingsQuestion }>(`${API_URL}/settings/questions`, data);
  }

  updateQuestion(
    id: number,
    data: { text: string; component_id: number; job_role_id: number | null },
  ): Observable<{ question: SettingsQuestion }> {
    return this.http.put<{ question: SettingsQuestion }>(`${API_URL}/settings/questions/${id}`, data);
  }

  deleteQuestion(id: number): Observable<unknown> {
    return this.http.delete(`${API_URL}/settings/questions/${id}`);
  }

  createChoice(questionId: number, data: { label: string; point_value: number }): Observable<{ choice: AnswerChoice }> {
    return this.http.post<{ choice: AnswerChoice }>(`${API_URL}/settings/questions/${questionId}/choices`, data);
  }

  deleteChoice(choiceId: number): Observable<unknown> {
    return this.http.delete(`${API_URL}/settings/choices/${choiceId}`);
  }

  getComponents(): Observable<{ components: ComponentItem[] }> {
    return this.http.get<{ components: ComponentItem[] }>(`${API_URL}/settings/components`);
  }

  updateComponent(id: number, data: { name: string; weight: number }): Observable<{ component: ComponentItem }> {
    return this.http.put<{ component: ComponentItem }>(`${API_URL}/settings/components/${id}`, data);
  }
}

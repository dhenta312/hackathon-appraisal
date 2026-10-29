import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

import { API_URL } from '../api-url';
import { AuthUser, LoginResponse } from '../models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly tokenKey = 'appraisal_token';
  private readonly userKey = 'appraisal_user';

  private tokenValue: string | null = null;

  readonly currentUser = signal<AuthUser | null>(null);

  constructor() {
    const savedToken = localStorage.getItem(this.tokenKey);
    const savedUser = localStorage.getItem(this.userKey);

    if (savedToken && savedUser) {
      this.tokenValue = savedToken;
      this.currentUser.set(JSON.parse(savedUser) as AuthUser);
    }
  }

  get accessToken(): string | null {
    return this.tokenValue;
  }

  login(email: string, password: string): Observable<AuthUser> {
    return this.http
      .post<LoginResponse>(`${API_URL}/login`, { email, password })
      .pipe(
        tap((response) => {
          this.tokenValue = response.token;
          this.currentUser.set(response.user);
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.userKey, JSON.stringify(response.user));
        }),
        map((response) => response.user),
      );
  }

  logout(): void {
    this.tokenValue = null;
    this.currentUser.set(null);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}

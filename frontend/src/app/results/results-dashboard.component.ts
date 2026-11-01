import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ResultPayload } from '../models/results';
import { ResultsService } from '../services/results.service';
import { AppealService } from '../services/appeal.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-results-dashboard',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './results-dashboard.component.html',
  styleUrl: './results-dashboard.component.css',
})
export class ResultsDashboardComponent implements OnInit {
  private readonly resultsService = inject(ResultsService);
  private readonly appealService = inject(AppealService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  readonly result = signal<ResultPayload | null>(null);
  readonly loading = signal(true);
  error: string | null = null;

  appealReason = '';
  readonly appealSent = signal(false);
  appealError: string | null = null;

  get isSelf(): boolean {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    return this.auth.currentUser()?.id === userId;
  }

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));

    this.resultsService.get(userId).subscribe({
      next: (result) => {
        this.result.set(result);
        this.loading.set(false);
      },
      error: () => {
        this.error = 'Gagal memuat hasil';
        this.loading.set(false);
      },
    });
  }

  submitAppeal(): void {
    if (!this.appealReason.trim()) {
      return;
    }

    this.appealError = null;
    this.appealService.submit(this.appealReason).subscribe({
      next: () => {
        this.appealSent.set(true);
        this.appealReason = '';
      },
      error: () => {
        this.appealError = 'Gagal mengirim banding. Silakan coba lagi.';
      },
    });
  }
}

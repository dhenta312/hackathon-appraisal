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

  readonly gradeBands = [
    { label: 'Istimewa (A)', range: '90–100', classes: 'bg-green-50 text-green-800' },
    { label: 'Sangat Baik (B)', range: '80–89', classes: 'bg-brand-50 text-brand-600' },
    { label: 'Baik (C)', range: '70–79', classes: 'bg-[#ecfeff] text-cyan-800' },
    { label: 'Cukup (D)', range: '60–69', classes: 'bg-[#fef3c7] text-[#92400e]' },
    { label: 'Perlu Pengembangan (E)', range: '<60', classes: 'bg-red-100 text-red-800' },
  ];

  gradeFor(score: number | null): { label: string; classes: string } | null {
    if (score === null) return null;
    if (score >= 90) return { label: 'Istimewa (A)', classes: 'bg-green-50 text-green-800' };
    if (score >= 80) return { label: 'Sangat Baik (B)', classes: 'bg-brand-50 text-brand-600' };
    if (score >= 70) return { label: 'Baik (C)', classes: 'bg-[#ecfeff] text-cyan-800' };
    if (score >= 60) return { label: 'Cukup (D)', classes: 'bg-[#fef3c7] text-[#92400e]' };
    return { label: 'Perlu Pengembangan (E)', classes: 'bg-red-100 text-red-800' };
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

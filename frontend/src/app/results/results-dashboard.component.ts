import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ResultPayload } from '../models/results';
import { ResultsService } from '../services/results.service';

@Component({
  selector: 'app-results-dashboard',
  standalone: true,
  templateUrl: './results-dashboard.component.html',
  styleUrl: './results-dashboard.component.css',
})
export class ResultsDashboardComponent implements OnInit {
  private readonly resultsService = inject(ResultsService);
  private readonly route = inject(ActivatedRoute);

  readonly result = signal<ResultPayload | null>(null);
  readonly loading = signal(true);
  error: string | null = null;

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
}

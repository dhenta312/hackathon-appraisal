import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AssessmentComponent, AssessmentTemplate, SaveAssessmentPayload } from '../models/assessment';
import { AssessmentService } from '../services/assessment.service';

@Component({
  selector: 'app-assessment-form',
  standalone: true,
  templateUrl: './assessment-form.component.html',
  styleUrl: './assessment-form.component.css',
})
export class AssessmentFormComponent implements OnInit {
  private readonly assessmentService = inject(AssessmentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly assessmentTemplate = signal<AssessmentTemplate | null>(null);
  readonly scores = signal<Record<number, number>>({});
  readonly reasons = signal<Record<number, string>>({});
  readonly loading = signal(true);
  readonly saving = signal(false);
  error: string | null = null;

  readonly scaleOptions = [
    { value: 1, label: 'Sangat kurang' },
    { value: 2, label: 'Kurang' },
    { value: 3, label: 'Cukup' },
    { value: 4, label: 'Baik' },
    { value: 5, label: 'Sangat baik' },
  ];

  readonly totalQuestions = computed(() =>
    (this.assessmentTemplate()?.components ?? []).reduce(
      (total, component) => total + component.questions.length,
      0,
    ),
  );

  readonly answeredCount = computed(() => Object.keys(this.scores()).length);

  get progressPercent(): number {
    const total = this.totalQuestions();
    return total ? Math.round((this.answeredCount() / total) * 100) : 0;
  }

  componentComplete(component: AssessmentComponent): boolean {
    return component.questions.every((question) => this.scores()[question.id] !== undefined);
  }

  ngOnInit(): void {
    const assessedId = Number(this.route.snapshot.paramMap.get('id'));

    this.assessmentService.load(assessedId).subscribe({
      next: (template) => {
        this.assessmentTemplate.set(template);
        this.prefillDraft(template);
        this.loading.set(false);
      },
      error: () => {
        this.error = 'Gagal memuat template penilaian';
        this.loading.set(false);
      },
    });
  }

  setScore(questionId: number, value: number): void {
    this.scores.update((current) => ({ ...current, [questionId]: value }));
  }

  setReason(componentId: number, event: Event): void {
    const text = (event.target as HTMLTextAreaElement).value;
    this.reasons.update((current) => ({ ...current, [componentId]: text }));
  }

  save(action: 'draft' | 'submit'): void {
    const template = this.assessmentTemplate();

    if (!template) {
      return;
    }

    this.saving.set(true);
    this.error = null;

    const payload: SaveAssessmentPayload = {
      action,
      scores: Object.entries(this.scores()).map(([questionId, value]) => ({
        question_id: Number(questionId),
        value,
      })),
      reasons: Object.entries(this.reasons()).map(([componentId, text]) => ({
        component_id: Number(componentId),
        text,
      })),
    };

    this.assessmentService.save(template.assessed.id, payload).subscribe({
      next: () => this.router.navigate(['/team']),
      error: () => {
        this.error = 'Gagal menyimpan penilaian';
        this.saving.set(false);
      },
    });
  }

  private prefillDraft(template: AssessmentTemplate): void {
    if (!template.draft) {
      return;
    }

    const scores: Record<number, number> = {};
    for (const score of template.draft.scores) {
      scores[score.question_id] = score.value;
    }

    const reasons: Record<number, string> = {};
    for (const reason of template.draft.reasons) {
      reasons[reason.component_id] = reason.text;
    }

    this.scores.set(scores);
    this.reasons.set(reasons);
  }
}

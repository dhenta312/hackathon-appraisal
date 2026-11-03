import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AssessmentComponent, AssessmentTemplate, SaveAssessmentPayload } from '../models/assessment';
import { AssessmentService } from '../services/assessment.service';
import { StepperButtonSetComponent, StepperStepType } from '../stepper-button-set/stepper-button-set.component';

@Component({
  selector: 'app-assessment-form',
  standalone: true,
  imports: [FormsModule, StepperButtonSetComponent],
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
  readonly showWarningDialog = signal(false);
  readonly currentStep = signal(0);
  error: string | null = null;

  relationship: string | null = null;

  readonly relationshipOptions = [
    { value: 'self', label: 'Diri sendiri' },
    { value: 'atasan', label: 'Atasan langsung' },
    { value: 'rekan', label: 'Rekan sejawat' },
    { value: 'bawahan', label: 'Bawahan' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  readonly totalQuestions = computed(() =>
    (this.assessmentTemplate()?.components ?? []).reduce(
      (total, component) => total + component.questions.length,
      0,
    ),
  );

  readonly answeredCount = computed(() => Object.keys(this.scores()).length);

  readonly components = computed(() => this.assessmentTemplate()?.components ?? []);

  readonly currentComponent = computed(() => this.components()[this.currentStep()] ?? null);

  readonly stepCount = computed(() => this.components().length);

  readonly stepperType = computed<StepperStepType>(() => {
    const total = this.stepCount();
    const current = this.currentStep();
    if (total <= 1 || current === total - 1) {
      return 'lastStep';
    }
    return current === 0 ? 'firstStep' : 'middleStep';
  });

  readonly warnings = computed(() => {
    const warnings: string[] = [];

    const values = Object.values(this.scores());

    if (values.length >= 2 && new Set(values).size === 1) {
      warnings.push('Skor yang Anda berikan seragam (semua sama).');
    }

    if (values.length > 0 && values.every((v) => v === 5)) {
      warnings.push('Semua aspek diberi nilai maksimal — kemungkinan diisi asal (rata kanan).');
    }

    const reasons = Object.values(this.reasons()).filter((t) => t.trim().length > 0);
    const seen = new Set<string>();
    let copied = false;
    for (const reason of reasons) {
      const key = reason.trim().toLowerCase();
      if (seen.has(key)) {
        copied = true;
        break;
      }
      seen.add(key);
    }
    if (copied) {
      warnings.push('Beberapa contoh perilaku terindikasi sama (copas).');
    }

    return warnings;
  });

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

  setReason(questionId: number, event: Event): void {
    const text = (event.target as HTMLTextAreaElement).value;
    this.reasons.update((current) => ({ ...current, [questionId]: text }));
  }

  reasonFor(questionId: number): string {
    return this.reasons()[questionId] ?? '';
  }

  save(action: 'draft' | 'submit'): void {
    if (action === 'submit' && this.warnings().length > 0) {
      this.showWarningDialog.set(true);
      return;
    }

    this.doSave(action);
  }

  confirmSubmit(): void {
    this.showWarningDialog.set(false);
    this.doSave('submit');
  }

  cancelSubmit(): void {
    this.showWarningDialog.set(false);
  }

  goToStep(step: number): void {
    if (step >= 0 && step < this.stepCount()) {
      this.currentStep.set(step);
    }
  }

  nextStep(): void {
    if (this.currentStep() < this.stepCount() - 1) {
      this.currentStep.update((value) => value + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 0) {
      this.currentStep.update((value) => value - 1);
    }
  }

  cancel(): void {
    this.router.navigate(['/team']);
  }

  onDraft(): void {
    this.save('draft');
  }

  onSave(): void {
    this.save('submit');
  }

  private doSave(action: 'draft' | 'submit'): void {
    const template = this.assessmentTemplate();

    if (!template) {
      return;
    }

    this.saving.set(true);
    this.error = null;

    const payload: SaveAssessmentPayload = {
      action,
      relationship: this.relationship,
      scores: Object.entries(this.scores()).map(([questionId, value]) => ({
        question_id: Number(questionId),
        value,
      })),
      reasons: Object.entries(this.reasons()).map(([questionId, text]) => ({
        question_id: Number(questionId),
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

    this.relationship = template.draft.relationship;

    const scores: Record<number, number> = {};
    for (const score of template.draft.scores) {
      scores[score.question_id] = score.value;
    }

    const reasons: Record<number, string> = {};
    for (const reason of template.draft.reasons) {
      reasons[reason.question_id] = reason.text;
    }

    this.scores.set(scores);
    this.reasons.set(reasons);
  }
}

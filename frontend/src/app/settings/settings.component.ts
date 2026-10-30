import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentItem, Period, SettingsQuestion } from '../models/settings';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  private readonly settingsService = inject(SettingsService);

  readonly activeTab = signal<'periode' | 'pertanyaan' | 'skor'>('periode');

  // Periode
  readonly periods = signal<Period[]>([]);
  newPeriod = { name: '', start_date: '', end_date: '' };

  // Pertanyaan
  readonly questions = signal<SettingsQuestion[]>([]);
  readonly components = signal<ComponentItem[]>([]);
  readonly roles = signal<{ id: number; name: string }[]>([]);
  newQuestion = { text: '', component_id: 0, job_role_id: null as number | null };
  readonly editingQuestionId = signal<number | null>(null);
  editQuestion = { text: '', component_id: 0, job_role_id: null as number | null };
  readonly managingChoicesId = signal<number | null>(null);
  newChoice = { label: '', point_value: 5 };

  // Skor
  readonly scoreComponents = signal<ComponentItem[]>([]);

  ngOnInit(): void {
    this.loadPeriods();
    this.loadQuestions();
    this.loadComponents();
  }

  loadPeriods(): void {
    this.settingsService.getPeriods().subscribe((res) => this.periods.set(res.periods));
  }

  loadQuestions(): void {
    this.settingsService.getQuestions().subscribe((res) => {
      this.questions.set(res.questions);
      this.components.set(res.components);
      this.roles.set(res.roles);
    });
  }

  loadComponents(): void {
    this.settingsService.getComponents().subscribe((res) => this.scoreComponents.set(res.components));
  }

  componentName(id: number): string {
    return this.components().find((c) => c.id === id)?.name ?? '-';
  }

  roleName(id: number | null): string {
    if (id === null) return 'Semua role';
    return this.roles().find((r) => r.id === id)?.name ?? '-';
  }

  dateOnly(iso: string): string {
    return iso?.slice(0, 10) ?? '-';
  }

  // ----------------------- Periode -----------------------
  addPeriod(): void {
    if (!this.newPeriod.name || !this.newPeriod.start_date || !this.newPeriod.end_date) return;
    this.settingsService.createPeriod(this.newPeriod).subscribe(() => {
      this.newPeriod = { name: '', start_date: '', end_date: '' };
      this.loadPeriods();
    });
  }

  togglePeriod(id: number): void {
    this.settingsService.togglePeriod(id).subscribe(() => this.loadPeriods());
  }

  // ----------------------- Pertanyaan -----------------------
  addQuestion(): void {
    if (!this.newQuestion.text || !this.newQuestion.component_id) return;
    this.settingsService.createQuestion(this.newQuestion).subscribe(() => {
      this.newQuestion = { text: '', component_id: 0, job_role_id: null };
      this.loadQuestions();
    });
  }

  startEdit(q: SettingsQuestion): void {
    this.editingQuestionId.set(q.id);
    this.editQuestion = { text: q.text, component_id: q.component_id, job_role_id: q.job_role_id };
  }

  saveEdit(q: SettingsQuestion): void {
    this.settingsService.updateQuestion(q.id, this.editQuestion).subscribe(() => {
      this.editingQuestionId.set(null);
      this.loadQuestions();
    });
  }

  deleteQuestion(id: number): void {
    this.settingsService.deleteQuestion(id).subscribe(() => this.loadQuestions());
  }

  // ----------------------- Pilihan jawaban -----------------------
  toggleChoices(id: number): void {
    this.managingChoicesId.set(this.managingChoicesId() === id ? null : id);
  }

  addChoice(questionId: number): void {
    if (!this.newChoice.label) return;
    this.settingsService
      .createChoice(questionId, { label: this.newChoice.label, point_value: this.newChoice.point_value })
      .subscribe(() => {
        this.newChoice = { label: '', point_value: 5 };
        this.loadQuestions();
      });
  }

  deleteChoice(choiceId: number): void {
    this.settingsService.deleteChoice(choiceId).subscribe(() => this.loadQuestions());
  }

  // ----------------------- Skor -----------------------
  saveWeight(component: ComponentItem): void {
    this.settingsService
      .updateComponent(component.id, { name: component.name, weight: component.weight })
      .subscribe(() => this.loadComponents());
  }
}

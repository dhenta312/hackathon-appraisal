import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { TeamMember } from '../models/team';
import { AuthService } from '../services/auth.service';
import { TeamService } from '../services/team.service';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.css',
})
export class TeamListComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly teamService = inject(TeamService);
  private readonly router = inject(Router);

  readonly members = signal<TeamMember[]>([]);
  readonly loading = signal(true);
  error: string | null = null;

  ngOnInit(): void {
    this.teamService.list().subscribe({
      next: (members) => {
        this.members.set(members);
        this.loading.set(false);
      },
      error: () => {
        this.error = 'Gagal memuat tim';
        this.loading.set(false);
      },
    });
  }

  get isAdmin(): boolean {
    return this.auth.currentUser()?.is_admin ?? false;
  }

  get myId(): number | null {
    return this.auth.currentUser()?.id ?? null;
  }

  get doneCount(): number {
    return this.members().filter((member) => member.status === 'submitted').length;
  }

  get totalCount(): number {
    return this.members().length;
  }

  statusLabel(status: TeamMember['status']): string {
    switch (status) {
      case 'submitted':
        return 'Selesai';
      case 'draft':
        return 'Draf';
      default:
        return 'Belum';
    }
  }

  badgeClass(status: TeamMember['status']): string {
    switch (status) {
      case 'submitted':
        return 'bg-green-50 text-green-800';
      case 'draft':
        return 'bg-[#fef3c7] text-[#92400e]';
      default:
        return 'bg-background-tertiary text-text-tertiary';
    }
  }

  openAssessment(memberId: number): void {
    this.router.navigate(['/assess', memberId]);
  }

  viewResults(memberId: number): void {
    this.router.navigate(['/results', memberId]);
  }
}

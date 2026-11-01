import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  get userName(): string {
    return this.auth.currentUser()?.name ?? '';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  get isAdmin(): boolean {
    return this.auth.currentUser()?.is_admin ?? false;
  }

  get pageLabel(): string {
    const url = this.router.url;
    if (url.startsWith('/team')) return 'Penilaian';
    if (url.startsWith('/assess')) return 'Form Penilaian';
    if (url.startsWith('/results')) return 'Hasil Penilaian';
    if (url.startsWith('/settings')) return 'Pengaturan';
    return 'Beranda';
  }

  get activeLevel(): 'welcome' | 'team' | 'settings' {
    const url = this.router.url;
    if (url.startsWith('/settings')) {
      return 'settings';
    }
    if (url.startsWith('/team') || url.startsWith('/assess') || url.startsWith('/results')) {
      return 'team';
    }
    return 'welcome';
  }

  readonly expanded = signal(true);

  labelsClasses(): string {
    return (
      'flex flex-col gap-0.5 overflow-hidden transition-all duration-300 rounded-r-xl' +
      (this.expanded() ? ' w-[216px] opacity-100 p-2' : ' w-0 opacity-0 p-0')
    );
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

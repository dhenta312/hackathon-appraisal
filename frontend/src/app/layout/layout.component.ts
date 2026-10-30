import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
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

  get pageLabel(): string {
    const url = this.router.url;
    if (url.startsWith('/team')) return 'Penilaian';
    if (url.startsWith('/assess')) return 'Form Penilaian';
    if (url.startsWith('/results')) return 'Hasil Penilaian';
    return 'Beranda';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

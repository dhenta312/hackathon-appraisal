import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  get userName(): string {
    return this.auth.currentUser()?.name ?? '';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

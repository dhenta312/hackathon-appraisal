import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  error: string | null = null;
  submitting = false;

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    this.error = null;

    const { email, password } = this.form.value;

    this.auth.login(email ?? '', password ?? '').subscribe({
      next: () => this.router.navigate(['/welcome']),
      error: () => {
        this.error = 'Email atau password salah';
        this.submitting = false;
      },
    });
  }
}

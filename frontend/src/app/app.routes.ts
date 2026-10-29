import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { TeamListComponent } from './team/team-list.component';
import { AssessmentFormComponent } from './assessment/assessment-form.component';
import { ResultsDashboardComponent } from './results/results-dashboard.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'team', component: TeamListComponent, canActivate: [authGuard] },
  { path: 'assess/:id', component: AssessmentFormComponent, canActivate: [authGuard] },
  { path: 'results/:id', component: ResultsDashboardComponent, canActivate: [authGuard] },
];

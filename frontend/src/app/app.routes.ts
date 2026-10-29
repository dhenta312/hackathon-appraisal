import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { TeamListComponent } from './team/team-list.component';
import { AssessmentFormComponent } from './assessment/assessment-form.component';
import { ResultsDashboardComponent } from './results/results-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'team', component: TeamListComponent },
  { path: 'assess/:id', component: AssessmentFormComponent },
  { path: 'results/:id', component: ResultsDashboardComponent },
];

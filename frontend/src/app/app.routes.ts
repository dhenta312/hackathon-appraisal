import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { LayoutComponent } from './layout/layout.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { TeamListComponent } from './team/team-list.component';
import { AssessmentFormComponent } from './assessment/assessment-form.component';
import { ResultsDashboardComponent } from './results/results-dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { authGuard } from './auth/auth.guard';
import { adminGuard } from './auth/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'welcome', component: WelcomeComponent },
      { path: 'team', component: TeamListComponent },
      { path: 'assess/:id', component: AssessmentFormComponent },
      { path: 'results/:id', component: ResultsDashboardComponent },
      { path: 'settings', component: SettingsComponent, canActivate: [adminGuard] },
    ],
  },
];

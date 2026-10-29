import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { TeamListComponent } from './team/team-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'team', component: TeamListComponent },
];

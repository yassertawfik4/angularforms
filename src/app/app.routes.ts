import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register';
import { UsersListComponent } from './components/users-list/users-list';

export const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'users', component: UsersListComponent },
];

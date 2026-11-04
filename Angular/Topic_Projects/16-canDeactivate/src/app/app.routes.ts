import { Routes } from '@angular/router';
import { Home } from './home/home';
import { EditProfile } from './edit-profile/edit-profile';
import { canDeactivateGuard } from './can-deactivate-guard';

export const routes: Routes = [
  { path: 'home', component: Home },
  {
    path: 'edit-profile',
    component: EditProfile,
    canDeactivate: [canDeactivateGuard]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

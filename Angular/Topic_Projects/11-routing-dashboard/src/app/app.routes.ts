import { Routes } from '@angular/router';
import { HomeCompo } from './componets/home-compo/home-compo';
import { AboutCompo } from './componets/about-compo/about-compo';
import { ContactCompo } from './componets/contact-compo/contact-compo';
import { Dashboard } from './dashboard/dashboard';
import { Profile } from './dashboard/profile/profile';
import { Companies } from './dashboard/companies/companies';
import { Connections } from './dashboard/connections/connections';

export const routes: Routes = [
  { path: 'home', component: HomeCompo },
  { path: 'about', component: AboutCompo },
  { path: 'contact', component: ContactCompo },

  { path: 'connections', component: Connections },
  { path: 'profile', component: Profile },
  { path: 'companies', component: Companies },

  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      { path: 'profile', component: Profile },
      { path: 'connections', component: Connections },
      { path: 'companies', component: Companies },
    ],
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

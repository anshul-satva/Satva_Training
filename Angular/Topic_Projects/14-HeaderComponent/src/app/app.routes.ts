import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { AboutComponent } from './about-component/about-component';
import { ContactComponent } from './contact-component/contact-component';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'about', component: AboutComponent},
  {path:'contact', component: ContactComponent},

  {path: '**', component: NotFound}
];

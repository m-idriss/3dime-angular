import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Calendar Converter | Photocalia',
  },
  {
    path: 'me',
    component: About,
    title: 'About Me | Photocalia',
  },
  {
    path: '**',
    redirectTo: '',
  },
];

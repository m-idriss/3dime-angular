import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: '3dime - Calendar Converter'
  },
  {
    path: 'me',
    component: About,
    title: '3dime - About Me'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

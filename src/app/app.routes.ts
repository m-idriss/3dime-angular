import { Routes } from '@angular/router';
import { Converter } from './components/converter/converter';

export const routes: Routes = [
  { path: 'converter', component: Converter },
  { path: '', redirectTo: 'converter', pathMatch: 'full' }
];


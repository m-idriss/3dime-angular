import { Routes } from '@angular/router';
import { About } from './pages/about/about';

export const routes: Routes = [
  {
    path: '',
    component: About,
    title: 'Idriss - Portfolio',
    data: {
      seo: {
        title: 'Idriss - Backend Developer Portfolio',
        description: 'Tech enthusiast and developer specializing in Java and modern web technologies. French of Malagasy origin, building elegant solutions that keep things simple.',
        keywords: 'Idriss, Backend developer, Java, Quarkus, Spring Boot, web developer, software engineer, 3dime, portfolio',
        ogImage: 'https://photocalia.com/assets/logo.png',
        ogUrl: 'https://photocalia.com/',
        type: 'profile',
        author: 'Idriss'
      }
    }
  },
  {
    path: '**',
    redirectTo: '',
  },
];

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ProfileCard } from './components/profile-card/profile-card';
import { About } from './components/about/about';
import { TechStack } from './components/tech-stack/tech-stack';
import { GithubActivity } from './components/github-activity/github-activity';
import { Experience } from './components/experience/experience';
import { Education } from './components/education/education';
import { Stuff } from './components/stuff/stuff';
import { Hobbies } from './components/hobbies/hobbies';
import { Contact } from './components/contact/contact';
import { Roadmap } from './components/roadmap/roadmap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ProfileCard,
    About,
    TechStack,
    GithubActivity,
    Experience,
    Education,
    Stuff,
    Hobbies,
    Contact,
    Roadmap
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('3dime-angular');
}

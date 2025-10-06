import { Component, signal } from '@angular/core';

import { ProfileCard } from './components/profile-card/profile-card';
import { RouterOutlet } from '@angular/router';
import { About } from './components/about/about';
import { TechStack } from './components/tech-stack/tech-stack';
import { Experience } from './components/experience/experience';
import { Education } from './components/education/education';
import { Converter } from './components/converter/converter';
import { Stuff } from './components/stuff/stuff';
import { Hobbies } from './components/hobbies/hobbies';
import { Contact } from './components/contact/contact';
import { GithubActivity } from './components/github-activity/github-activity';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ProfileCard,
    About,
    TechStack,
    Experience,
    Education,
    Converter,
    Stuff,
    Hobbies,
    Contact,
    GithubActivity
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('3dime-angular');
}

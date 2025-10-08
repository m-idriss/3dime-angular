import { Component, signal } from '@angular/core';

import { ProfileCard } from './components/profile-card/profile-card';
import { About } from './components/about/about';
import { TechStack } from './components/tech-stack/tech-stack';
import { Experience } from './components/experience/experience';
import { Education } from './components/education/education';
import { Converter } from './components/converter/converter';
import { Stuff } from './components/stuff/stuff';
import { Hobbies } from './components/hobbies/hobbies';
import { Contact } from './components/contact/contact';
import { GithubActivity } from './components/github-activity/github-activity';
import { BackToTop } from './components/back-to-top/back-to-top';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ProfileCard,
    About,
    TechStack,
    Experience,
    Education,
    Converter,
    Stuff,
    Hobbies,
    Contact,
    GithubActivity,
    BackToTop
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('3dime-angular');
}

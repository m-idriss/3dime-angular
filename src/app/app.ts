import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ProfileCard } from './components/profile-card/profile-card';
import { About } from './components/about/about';
import { TechStack } from './components/tech-stack/tech-stack';
import { Experience } from './components/experience/experience';
import { Education } from './components/education/education';
import { Stuff } from './components/stuff/stuff';
import { Hobbies } from './components/hobbies/hobbies';
import { Contact } from './components/contact/contact';
import { GithubActivity } from './components/github-activity/github-activity';
import { SeoService } from './shared/seo';

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
    Stuff,
    Hobbies,
    Contact,
    GithubActivity
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('3dime-angular');

  constructor(private readonly seoService: SeoService) {}

  ngOnInit(): void {
    // Initialize default SEO tags
    this.seoService.updateTags({
      title: '3dime – Java & Angular Developer Portfolio',
      description: 'Personal portfolio showcasing projects, skills, and experience in Java, Angular, Spring Boot, Quarkus, and modern web technologies.',
      keywords: ['Java', 'Angular', 'TypeScript', 'Spring Boot', 'Quarkus', 'Web Development', 'Full-Stack Developer', 'Portfolio'],
      author: '3dime',
      url: 'https://3dime.com',
      type: 'website',
      twitterCard: 'summary_large_image',
      robots: 'index, follow'
    });

    // Inject JSON-LD structured data
    this.seoService.injectJsonLd('assets/seo/person.schema.json', 'person');
    this.seoService.injectJsonLd('assets/seo/website.schema.json', 'website');
  }
}

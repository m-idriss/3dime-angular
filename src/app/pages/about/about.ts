import { Component, ViewChild } from '@angular/core';

import { About as AboutComponent } from '../../components/about/about';
import { BackToTop } from '../../components/back-to-top/back-to-top';
import { Education } from '../../components/education/education';
import { ExpandableCard } from '../../components/expandable-card/expandable-card';
import { Experience } from '../../components/experience/experience';
import { GithubActivity } from '../../components/github-activity/github-activity';
import { Hobbies } from '../../components/hobbies/hobbies';
import { ProfileCard } from '../../components/profile-card/profile-card';
import { Stuff } from '../../components/stuff/stuff';
import { TechStack } from '../../components/tech-stack/tech-stack';
import { LayoutModule } from '@angular/cdk/layout';
import { AppTooltipDirective } from '../../shared/directives';

@Component({
  selector: 'app-about-page',
  imports: [
    AboutComponent,
    BackToTop,
    Education,
    ExpandableCard,
    Experience,
    GithubActivity,
    Hobbies,
    ProfileCard,
    Stuff,
    TechStack,
    LayoutModule,
    AppTooltipDirective,
  ],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  // ViewChild references to all expandable cards
  @ViewChild('techStackCard', { read: ExpandableCard }) techStackCard!: ExpandableCard;
  @ViewChild('experienceCard', { read: ExpandableCard }) experienceCard!: ExpandableCard;
  @ViewChild('educationCard', { read: ExpandableCard }) educationCard!: ExpandableCard;
  @ViewChild('githubCard', { read: ExpandableCard }) githubCard!: ExpandableCard;
  @ViewChild('hobbiesCard', { read: ExpandableCard }) hobbiesCard!: ExpandableCard;
  @ViewChild('stuffCard', { read: ExpandableCard }) stuffCard!: ExpandableCard;

  /**
   * Check if all cards are currently expanded
   */
  allExpanded(): boolean {
    return (
      this.techStackCard?.isExpanded() &&
      this.experienceCard?.isExpanded() &&
      this.educationCard?.isExpanded() &&
      this.githubCard?.isExpanded() &&
      this.hobbiesCard?.isExpanded() &&
      this.stuffCard?.isExpanded()
    );
  }

  /**
   * Toggle all expandable cards between expanded and collapsed states
   */
  toggleAllCards(): void {
    const shouldExpand = !this.allExpanded();
    const cards = [
      this.techStackCard,
      this.experienceCard,
      this.educationCard,
      this.githubCard,
      this.hobbiesCard,
      this.stuffCard,
    ];
    cards.forEach((card) => {
      if (shouldExpand) {
        card?.expand();
      } else {
        card?.collapse();
      }
    });
  }
}

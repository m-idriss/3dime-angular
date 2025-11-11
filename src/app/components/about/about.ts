import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';

import { GithubService, GithubUser } from '../../services/github.service';
import { Card } from '../card/card';

/**
 * Component displaying the user's bio from GitHub profile.
 * Uses OnPush change detection for optimal performance.
 */
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [Card],
  templateUrl: './about.html',
  styleUrls: ['./about.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About implements OnInit {
  private readonly githubService = inject(GithubService);
  private readonly cdr = inject(ChangeDetectorRef);

  bio: string | null = null;

  ngOnInit(): void {
    this.githubService.getProfile().subscribe((user: GithubUser) => {
      this.bio = user.bio || 'Bio information will be displayed here.';
      this.cdr.markForCheck();
    });
  }
}

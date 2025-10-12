import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { ProfileService, GithubUser } from '../../services/profile.service';
import { Card } from '../card/card';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [Card],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact implements OnInit {
  email: string | null = null;

  constructor(
    private readonly profileService: ProfileService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe((user: GithubUser) => {
      this.email = user.email || 'nothing@nothing.com';
      this.cdr.markForCheck();
    });
  }
}

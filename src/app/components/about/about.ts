import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ProfileService, GithubUser } from '../../services/profile.service';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
  styleUrls: ['./about.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class About implements OnInit {
  bio: string | null = null;

  constructor(
    private readonly profileService: ProfileService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe((user: GithubUser) => {
      this.bio = user.bio || 'No bio available.';
      this.cdr.markForCheck();
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ProfileService, GithubUser } from '../../services/profile.service';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact implements OnInit {
  email: string | null = null;

  constructor(private readonly profileService: ProfileService) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe((user: GithubUser) => {
      this.email = user.email || 'nothing@nothing.com';
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export interface SocialLink {
  provider: string;
  url: string;
}

export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name?: string;
  bio?: string;
  location?: string;
  public_repos: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly apiUrl = 'https://api.github.com/users/m-idriss';

  private profile$?: Observable<GithubUser>;
  private socialLinks$?: Observable<SocialLink[]>;

  constructor(private readonly http: HttpClient) {}

  getProfile(): Observable<GithubUser> {
    this.profile$ ??= this.http.get<GithubUser>(this.apiUrl).pipe(
      shareReplay(1)
    );
    return this.profile$;
  }

  getSocialLinks(): Observable<SocialLink[]> {
    this.socialLinks$ ??= this.http.get<SocialLink[]>(`${this.apiUrl}/social_accounts`).pipe(
      shareReplay(1)
    );
    return this.socialLinks$;
  }

}

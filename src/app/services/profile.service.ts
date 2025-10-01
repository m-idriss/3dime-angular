import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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
  email?: string;
}

export interface CommitWeek {
  week: number;
  total: number;
  days: number[];
}

export interface CommitResponse {
  commit_activity: CommitWeek[];
}

export interface CommitData {
  date: number;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly baseUrl = environment.apiUrl;

  private profile$?: Observable<GithubUser>;
  private socialLinks$?: Observable<SocialLink[]>;
  private commits$?: Observable<CommitData[]>;

  constructor(private readonly http: HttpClient) {}

  getProfile(): Observable<GithubUser> {
    this.profile$ ??= this.http
      .get<GithubUser>(`${this.baseUrl}?target=profile`)
      .pipe(shareReplay(1));
    return this.profile$;
  }

  getSocialLinks(): Observable<SocialLink[]> {
    this.socialLinks$ ??= this.http
      .get<SocialLink[]>(`${this.baseUrl}?target=social`)
      .pipe(shareReplay(1));
    return this.socialLinks$;
  }

  getCommitsV2(): Observable<CommitData[]> {
    if (!this.commits$) {
      this.commits$ = this.http
        .get<CommitData[]>(`${this.baseUrl}?target=commit`)
        .pipe(
          map((commits) =>
            commits.map((d) => ({
              date: typeof d.date === "string" ? new Date(d.date).getTime() : d.date,
              value: d.value,
            }))
          ),
          shareReplay(1)
        );
    }
    return this.commits$;
  }

}

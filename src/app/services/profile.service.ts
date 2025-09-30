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
  private readonly baseUrl = environment.apiUrl + '/proxy.php?service=github';

  private profile$?: Observable<GithubUser>;
  private socialLinks$?: Observable<SocialLink[]>;
  private commits$?: Observable<CommitData[]>;

  constructor(private readonly http: HttpClient) {}

  getProfile(): Observable<GithubUser> {
    this.profile$ ??= this.http
      .get<GithubUser>(`${this.baseUrl}`)
      .pipe(shareReplay(1));
    return this.profile$;
  }

  getSocialLinks(): Observable<SocialLink[]> {
    this.socialLinks$ ??= this.http
      .get<SocialLink[]>(`${this.baseUrl}&type=social`)
      .pipe(shareReplay(1));
    return this.socialLinks$;
  }

  getCommits(): Observable<CommitData[]> {
    this.commits$ ??= this.http
      .get<CommitResponse>(`${this.baseUrl}&type=commits_all`)
      .pipe(
        map((res) =>
          res.commit_activity.flatMap((week) =>
            week.days.map((count, i) => ({
              date: (week.week + i * 86400) * 1000,
              value: count,
            }))
          )
        ),
        shareReplay(1)
      );
    return this.commits$;
  }

  getCommitsV2(): Observable<CommitData[]> {
    return this.http
      .get<{ commit_activity: { date: string; value: number }[] }>(
        `${this.baseUrl}&type=contributions`
      )
      .pipe(
        map((res) =>
          res.commit_activity.map((d) => ({
            date: new Date(d.date).getTime(),
            value: d.value,
          }))
        ),
        shareReplay(1)
      );
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay, catchError } from 'rxjs/operators';
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

export interface CommitData {
  date: number;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly endpoints = {
    profile: `${environment.apiUrl}?target=profile`,
    social: `${environment.apiUrl}?target=social`,
    commits: `${environment.apiUrl}?target=commit`
  };

  private profile$?: Observable<GithubUser>;
  private socialLinks$?: Observable<SocialLink[]>;
  private commits$?: Observable<CommitData[]>;

  constructor(private readonly http: HttpClient) {}

  getProfile(): Observable<GithubUser> {
    this.profile$ ??= this.http.get<GithubUser>(this.endpoints.profile).pipe(
      shareReplay(1),
      catchError(() => of({} as GithubUser))
    );
    return this.profile$;
  }

  getSocialLinks(): Observable<SocialLink[]> {
    this.socialLinks$ ??= this.http.get<SocialLink[]>(this.endpoints.social).pipe(
      shareReplay(1),
      catchError(() => of([]))
    );
    return this.socialLinks$;
  }

  getCommits(months: number = 6): Observable<CommitData[]> {
    const url = `${this.endpoints.commits}&months=${months}`;
    return this.http.get<CommitData[]>(url).pipe(
      shareReplay(1),
      catchError(() => of([]))
    );
  }

  refreshCommits(): void {
    this.commits$ = undefined;
  }
}

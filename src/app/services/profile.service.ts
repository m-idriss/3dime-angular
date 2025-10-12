import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

/**
 * Social media link interface
 */
export interface SocialLink {
  provider: string;
  url: string;
}

/**
 * GitHub user profile interface
 */
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

/**
 * GitHub commit activity data
 */
export interface CommitData {
  date: number;
  value: number;
}

/**
 * Service for fetching GitHub profile data and commit activity.
 * Uses caching with shareReplay to prevent duplicate API calls.
 *
 * @example
 * ```typescript
 * constructor(private profileService: ProfileService) {}
 *
 * ngOnInit() {
 *   this.profileService.getProfile().subscribe(user => {
 *     console.log(user.name);
 *   });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly endpoints = {
    profile: `${environment.apiUrl}?target=profile`,
    social: `${environment.apiUrl}?target=social`,
    commits: `${environment.apiUrl}?target=commit`,
  };

  private profile$?: Observable<GithubUser>;
  private socialLinks$?: Observable<SocialLink[]>;
  private commits$?: Observable<CommitData[]>;

  constructor(private readonly http: HttpClient) {}

  /**
   * Get GitHub user profile.
   * Caches the result to prevent duplicate API calls.
   *
   * @returns Observable of GitHub user profile data
   */
  getProfile(): Observable<GithubUser> {
    this.profile$ ??= this.http.get<GithubUser>(this.endpoints.profile).pipe(
      shareReplay(1),
      catchError(() => of({} as GithubUser)),
    );
    return this.profile$;
  }

  /**
   * Get social media links.
   * Caches the result to prevent duplicate API calls.
   *
   * @returns Observable of social media links array
   */
  getSocialLinks(): Observable<SocialLink[]> {
    this.socialLinks$ ??= this.http.get<SocialLink[]>(this.endpoints.social).pipe(
      shareReplay(1),
      catchError(() => of([])),
    );
    return this.socialLinks$;
  }

  /**
   * Get GitHub commit activity data.
   *
   * @param months - Number of months of commit history to fetch (default: 6)
   * @returns Observable of commit activity data
   */
  getCommits(months: number = 6): Observable<CommitData[]> {
    const url = `${this.endpoints.commits}&months=${months}`;
    return this.http.get<CommitData[]>(url).pipe(
      shareReplay(1),
      catchError(() => of([])),
    );
  }

  /**
   * Clear cached commit data to force a refresh on next request.
   */
  refreshCommits(): void {
    this.commits$ = undefined;
  }
}

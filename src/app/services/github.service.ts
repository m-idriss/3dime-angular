import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay, catchError, timeout } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { API_CONFIG } from '../constants/app.constants';

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
 * GitHub release interface
 */
export interface GithubRelease {
  tag_name: string;
  html_url: string;
  name?: string;
  published_at?: string;
}

/**
 * Service for fetching GitHub profile data and commit activity.
 * Uses caching with shareReplay to prevent duplicate API calls.
 *
 * @example
 * ```typescript
 * constructor(private githubService: GithubService) {}
 *
 * ngOnInit() {
 *   this.githubService.getProfile().subscribe(user => {
 *     this.userName = user.name;
 *   });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly http = inject(HttpClient);

  private readonly endpoints = {
    profile: `${environment.apiUrl}?target=profile`,
    social: `${environment.apiUrl}?target=social`,
    commits: `${environment.apiUrl}?target=commit`,
  };

  private profile$?: Observable<GithubUser>;
  private socialLinks$?: Observable<SocialLink[]>;
  private commits$?: Observable<CommitData[]>;

  /**
   * Get GitHub user profile.
   * Caches the result to prevent duplicate API calls.
   * Includes timeout to prevent hanging in restrictive network environments.
   *
   * @returns Observable of GitHub user profile data (returns empty object on timeout/error)
   */
  getProfile(): Observable<GithubUser> {
    this.profile$ ??= this.http.get<GithubUser>(this.endpoints.profile).pipe(
      timeout(API_CONFIG.TIMEOUT_MS),
      catchError((err) => {
        console.warn('Profile API call failed or timed out:', err.message || err);
        return of({} as GithubUser);
      }),
      shareReplay(1),
    );
    return this.profile$;
  }

  /**
   * Get social media links.
   * Caches the result to prevent duplicate API calls.
   * Includes timeout to prevent hanging in restrictive network environments.
   *
   * @returns Observable of social media links array (returns empty array on timeout/error)
   */
  getSocialLinks(): Observable<SocialLink[]> {
    this.socialLinks$ ??= this.http.get<SocialLink[]>(this.endpoints.social).pipe(
      timeout(API_CONFIG.TIMEOUT_MS),
      catchError((err) => {
        console.warn('Social links API call failed or timed out:', err.message || err);
        return of([]);
      }),
      shareReplay(1),
    );
    return this.socialLinks$;
  }

  /**
   * Get GitHub commit activity data.
   * Caches the result to prevent duplicate API calls.
   * Includes timeout to prevent hanging in restrictive network environments.
   *
   * @param months - Number of months of commit history to fetch (default: 6)
   * @returns Observable of commit activity data (returns empty array on timeout/error)
   */
  getCommits(months = 6): Observable<CommitData[]> {
    const url = `${this.endpoints.commits}&months=${months}`;
    this.commits$ ??= this.http.get<CommitData[]>(url).pipe(
      timeout(API_CONFIG.TIMEOUT_MS),
      catchError((err) => {
        console.warn('Commits API call failed or timed out:', err.message || err);
        return of([]);
      }),
      shareReplay(1),
    );
    return this.commits$;
  }

  /**
   * Clear cached commit data to force a refresh on next request.
   */
  refreshCommits(): void {
    this.commits$ = undefined;
  }

  /**
   * Get latest release from GitHub repository.
   * Fetches via backend API proxy to avoid CORS issues.
   * Includes timeout to prevent hanging in restrictive network environments.
   *
   * @returns Observable of GitHub release data (returns empty object on timeout/error)
   */
  getLatestRelease(): Observable<GithubRelease> {
    const url = 'https://api.github.com/repos/m-idriss/3dime-angular/releases/latest';
    return this.http.get<GithubRelease>(url).pipe(
      timeout(API_CONFIG.TIMEOUT_MS),
      catchError((err) => {
        console.warn('Release API call failed or timed out:', err.message || err);
        return of({} as GithubRelease);
      }),
      shareReplay(1),
    );
  }
}

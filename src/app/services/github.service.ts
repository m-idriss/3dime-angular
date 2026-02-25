import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay, catchError, timeout, tap } from 'rxjs/operators';

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
    profile: `${environment.apiUrl}/github/user`,
    social: `${environment.apiUrl}/github/social`,
    commits: `${environment.apiUrl}/github/commits`,
  };

  private profile$?: Observable<GithubUser>;
  private socialLinks$?: Observable<SocialLink[]>;
  private commits$?: Observable<CommitData[]>;

  private readonly CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

  private getCached<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const { data, timestamp } = JSON.parse(raw) as { data: T; timestamp: number };
      if (Date.now() - timestamp > this.CACHE_TTL_MS) return null;
      return data;
    } catch {
      return null;
    }
  }

  private setCache(key: string, data: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    } catch {
      // localStorage may be unavailable (private browsing, storage full, etc.)
    }
  }

  /**
   * Get GitHub user profile.
   * Caches the result to prevent duplicate API calls.
   * Includes timeout to prevent hanging in restrictive network environments.
   *
   * @returns Observable of GitHub user profile data (returns empty object on timeout/error)
   */
  getProfile(): Observable<GithubUser> {
    if (!this.profile$) {
      const cached = this.getCached<GithubUser>('github_profile');
      const fresh$ = this.http.get<GithubUser>(this.endpoints.profile).pipe(
        timeout(API_CONFIG.TIMEOUT_MS),
        tap((data) => this.setCache('github_profile', data)),
        catchError((err) => {
          console.warn('Profile API call failed or timed out:', err.message || err);
          return of({} as GithubUser);
        }),
        shareReplay(1),
      );
      if (cached) {
        this.profile$ = of(cached).pipe(shareReplay(1));
        fresh$.subscribe({ error: (err) => console.warn('Background profile refresh failed:', err.message || err) });
      } else {
        this.profile$ = fresh$;
      }
    }
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
    if (!this.socialLinks$) {
      const cached = this.getCached<SocialLink[]>('github_social');
      const fresh$ = this.http.get<SocialLink[]>(this.endpoints.social).pipe(
        timeout(API_CONFIG.TIMEOUT_MS),
        tap((data) => this.setCache('github_social', data)),
        catchError((err) => {
          console.warn('Social links API call failed or timed out:', err.message || err);
          return of([]);
        }),
        shareReplay(1),
      );
      if (cached) {
        this.socialLinks$ = of(cached).pipe(shareReplay(1));
        fresh$.subscribe({ error: (err) => console.warn('Background social refresh failed:', err.message || err) });
      } else {
        this.socialLinks$ = fresh$;
      }
    }
    return this.socialLinks$;
  }

  /**
   * Get GitHub commit activity data.
   * Includes timeout to prevent hanging in restrictive network environments.
   *
   * @param months - Number of months of commit history to fetch (default: 6)
   * @returns Observable of commit activity data (returns empty array on timeout/error)
   */
  getCommits(months = 6): Observable<CommitData[]> {
    const url = `${this.endpoints.commits}?months=${months}`;
    return this.http.get<CommitData[]>(url).pipe(
      timeout(API_CONFIG.TIMEOUT_MS),
      catchError((err) => {
        console.warn('Commits API call failed or timed out:', err.message || err);
        return of([]);
      }),
      shareReplay(1),
    );
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

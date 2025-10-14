import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay, timeout } from 'rxjs/operators';

import { LinkItem } from '../models';
import { environment } from '../../environments/environment';

/**
 * Timeout for API calls in milliseconds.
 * Ensures components don't hang indefinitely waiting for API responses.
 * This is critical for screenshot workflows and CI environments where APIs might be blocked.
 */
const API_TIMEOUT_MS = 10000; // 10 seconds

/**
 * Service for fetching data from Notion API.
 * Provides categorized content for various sections of the portfolio.
 * Caches all data with a single API call using shareReplay.
 *
 * @example
 * ```typescript
 * constructor(private notionService: NotionService) {}
 *
 * ngOnInit() {
 *   this.notionService.fetchAll().subscribe(() => {
 *     this.items = this.notionService.getTechStacks();
 *   });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class NotionService {
  private readonly baseUrl = environment.apiUrl;
  private fetchAll$?: Observable<void>;

  stuffs: LinkItem[] = [];
  experiences: LinkItem[] = [];
  educations: LinkItem[] = [];
  hobbies: LinkItem[] = [];
  techStacks: LinkItem[] = [];

  constructor(private readonly http: HttpClient) {}

  /**
   * Fetch all data from Notion API.
   * Makes a single API call and caches the result.
   * Populates all category arrays (stuffs, experiences, educations, hobbies, techStacks).
   * Includes timeout to prevent hanging in restrictive network environments.
   *
   * @returns Observable that completes when data is loaded (empty arrays on timeout/error)
   */
  fetchAll(): Observable<void> {
    if (!this.fetchAll$) {
      this.fetchAll$ = this.http.get<any>(`${this.baseUrl}?target=notion`).pipe(
        timeout(API_TIMEOUT_MS),
        map((res) => {
          this.stuffs = res.stuff ?? [];
          this.experiences = res.experience ?? [];
          this.educations = res.education ?? [];
          this.hobbies = res.hobbies ?? [];
          this.techStacks = res.tech_stack ?? [];
        }),
        catchError((err) => {
          console.warn('Notion API call failed or timed out:', err.message || err);
          // Initialize with empty arrays on error to allow components to render
          this.stuffs = [];
          this.experiences = [];
          this.educations = [];
          this.hobbies = [];
          this.techStacks = [];
          return of();
        }),
        shareReplay(1),
      );
    }
    return this.fetchAll$;
  }

  /**
   * Get recommended products and tools.
   * Call fetchAll() first to populate data.
   *
   * @returns Array of stuff/product items
   */
  getStuffs(): LinkItem[] {
    return this.stuffs;
  }

  /**
   * Get work experience and projects.
   * Call fetchAll() first to populate data.
   *
   * @returns Array of experience items
   */
  getExperiences(): LinkItem[] {
    return this.experiences;
  }

  /**
   * Get education and training information.
   * Call fetchAll() first to populate data.
   *
   * @returns Array of education items
   */
  getEducations(): LinkItem[] {
    return this.educations;
  }

  /**
   * Get hobbies and interests.
   * Call fetchAll() first to populate data.
   *
   * @returns Array of hobby items
   */
  getHobbies(): LinkItem[] {
    return this.hobbies;
  }

  /**
   * Get technology stack and skills.
   * Call fetchAll() first to populate data.
   *
   * @returns Array of tech stack items
   */
  getTechStacks(): LinkItem[] {
    return this.techStacks;
  }
}

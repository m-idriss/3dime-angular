import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from, concat } from 'rxjs';
import { map, catchError, shareReplay, timeout, concatMap, delay } from 'rxjs/operators';

import { LinkItem } from '../models';
import { environment } from '../../environments/environment';

/**
 * Timeout for API calls in milliseconds.
 * Ensures components don't hang indefinitely waiting for API responses.
 * This is critical for screenshot workflows and CI environments where APIs might be blocked.
 */
const API_TIMEOUT_MS = 10000; // 10 seconds

/**
 * Delay between progressive item emissions in milliseconds.
 * This creates a staggered effect where items appear one by one.
 */
const PROGRESSIVE_DELAY_MS = 0; // 100ms between each item

/**
 * Service for fetching data from Notion API.
 * Provides categorized content for various sections of the portfolio.
 * Caches all data with a single API call using shareReplay.
 * Supports progressive loading where items are emitted one by one.
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
    this.fetchAll$ ??= this.http.get<any>(`${this.baseUrl}?target=notion`).pipe(
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

  /**
   * Stream items progressively with a delay between each emission.
   * This creates a visual effect where items appear one by one.
   *
   * @param items Array of items to stream
   * @param delayMs Delay between each item emission (default: PROGRESSIVE_DELAY_MS)
   * @returns Observable that emits items progressively
   */
  private streamItemsProgressively(items: LinkItem[], delayMs = PROGRESSIVE_DELAY_MS): Observable<LinkItem> {
    if (items.length === 0) {
      return of();
    }
    // Emit first item immediately, then rest with delay
    return concat(
      of(items[0]),
      from(items.slice(1)).pipe(
        concatMap(item => of(item).pipe(delay(delayMs)))
      )
    );
  }

  /**
   * Fetch and stream stuff items progressively.
   * Items appear one by one as they are emitted.
   *
   * @returns Observable that emits stuff items progressively
   */
  fetchStuffsProgressively(): Observable<LinkItem> {
    return this.fetchAll().pipe(
      concatMap(() => this.streamItemsProgressively(this.stuffs))
    );
  }

  /**
   * Fetch and stream experience items progressively.
   * Items appear one by one as they are emitted.
   *
   * @returns Observable that emits experience items progressively
   */
  fetchExperiencesProgressively(): Observable<LinkItem> {
    return this.fetchAll().pipe(
      concatMap(() => this.streamItemsProgressively(this.experiences))
    );
  }

  /**
   * Fetch and stream education items progressively.
   * Items appear one by one as they are emitted.
   *
   * @returns Observable that emits education items progressively
   */
  fetchEducationsProgressively(): Observable<LinkItem> {
    return this.fetchAll().pipe(
      concatMap(() => this.streamItemsProgressively(this.educations))
    );
  }

  /**
   * Fetch and stream hobby items progressively.
   * Items appear one by one as they are emitted.
   *
   * @returns Observable that emits hobby items progressively
   */
  fetchHobbiesProgressively(): Observable<LinkItem> {
    return this.fetchAll().pipe(
      concatMap(() => this.streamItemsProgressively(this.hobbies))
    );
  }

  /**
   * Fetch and stream tech stack items progressively.
   * Items appear one by one as they are emitted.
   *
   * @returns Observable that emits tech stack items progressively
   */
  fetchTechStacksProgressively(): Observable<LinkItem> {
    return this.fetchAll().pipe(
      concatMap(() => this.streamItemsProgressively(this.techStacks))
    );
  }
}

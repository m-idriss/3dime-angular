import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LinkItem } from '../models/link-item.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotionService {

  private readonly baseUrl = environment.apiUrl;

  stuffs: LinkItem[] = [];
  experiences: LinkItem[] = [];
  educations: LinkItem[] = [];
  hobbies: LinkItem[] = [];
  techStacks: LinkItem[] = [];

  constructor(private readonly http: HttpClient) {}

  fetchAll(): Observable<void> {
    return this.http.get<any>(`${this.baseUrl}?target=notion`).pipe(
      map(res => {
        this.stuffs = res.stuff ?? [];
        this.experiences = res.experience ?? [];
        this.educations = res.education ?? [];
        this.hobbies = res.hobbies ?? [];
        this.techStacks = res.tech_stack ?? [];
      }),
      catchError(err => {
        console.error('Error fetching data from Notion API', err);
        return of();
      })
    );
  }

  getStuffs(): LinkItem[] {
    return this.stuffs;
  }

  getExperiences(): LinkItem[] {
    return this.experiences;
  }

  getEducations(): LinkItem[] {
    return this.educations;
  }

  getHobbies(): LinkItem[] {
    return this.hobbies;
  }

  getTechStacks(): LinkItem[] {
    return this.techStacks;
  }
}

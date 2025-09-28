import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LinkItem } from '../models/link-item.model';

@Injectable({
  providedIn: 'root'
})
export class NotionService {

  private readonly apiUrl = 'https://www.3dime.com/proxy.php?service=notion&db=all';

  stuffs: LinkItem[] = [];
  experiences: LinkItem[] = [];
  educations: LinkItem[] = [];
  hobbies: LinkItem[] = [];
  techStacks: LinkItem[] = [];

  constructor(private readonly http: HttpClient) {}

  fetchAll(): Observable<void> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        this.stuffs = res.profile.stuff || [];
        this.experiences = res.profile.experience || [];
        this.educations = res.profile.education || [];
        this.hobbies = res.profile.hobbies || [];
        this.techStacks = res.profile.tech_stack || [];
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

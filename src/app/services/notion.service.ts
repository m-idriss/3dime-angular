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

  constructor(private readonly http: HttpClient) {}

  fetchAll(): Observable<void> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        this.stuffs = res.profile.stuff || [];
        this.experiences = res.profile.experience || [];
        this.educations = res.profile.education || [];
        this.hobbies = res.profile.hobbies || [];
      }),
      catchError(err => {
        console.error('Erreur lors de la récupération des données Notion', err);
        return of(); // Ne fait rien si erreur
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
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LinkItem } from '../models/link-item.model';
import hobbiesData from '../data/hobbies.json';
import stuffData from '../data/stuff.json';
import techStackData from '../data/techstack.json';
import experienceData from '../data/experiences.json';
import educationData from '../data/education.json';
import contactData from '../data/contact.json';
import aboutData from '../data/about.json';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() {}

  getHobbies(): Observable<LinkItem[]> {
    return of(hobbiesData);
  }

  getStuffs(): Observable<LinkItem[]> {
    return of(stuffData);
  }

  getTechStacks(): Observable<LinkItem[]> {
    // Firebase: return this.firestore.collection<LinkItem>('techstack').valueChanges();
    return of(techStackData);
  }

  getExperiences(): Observable<any[]> {
    // Firebase: return this.firestore.collection<any>('experience').valueChanges();
    return of(experienceData);
  }

  getEducation(): Observable<any[]> {
    // Firebase: return this.firestore.collection<any>('education').valueChanges();
    return of(educationData);
  }


  getContact(): Observable<any> {
    // Firebase: return this.firestore.collection<any>('contact').valueChanges();
    return of(contactData);
  }

  getAbout(): Observable<{ title: string; content: string }> {
    // Firebase: rreturn this.firestore.doc('about/main').valueChanges();
    return of(aboutData);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  apiUrl = 'https://api.github.com/users/m-idriss';

  gitHubUrl = 'https://github.com/m-idriss';

  constructor(private readonly http: HttpClient) { }

  getSocialLinks():  Observable<{ provider: string; url: string }[]> {
    return this.http.get<{ provider: string; url: string }[]>(`${this.apiUrl}/social_accounts`);
  }

  getProfile(): Observable<{ login: string }> {
    return this.http.get<any>(this.apiUrl);
  }


  getGithubUrl(): string {
    return this.gitHubUrl;
  }

}

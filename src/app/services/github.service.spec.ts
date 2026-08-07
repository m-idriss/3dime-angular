import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { GithubService } from './github.service';
import { environment } from '../../environments/environment';

describe('GithubService', () => {
  let service: GithubService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(GithubService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('refetches commits when the persistent cache contains an empty response', () => {
    localStorage.setItem(
      'github_commits_7',
      JSON.stringify({ data: [], timestamp: Date.now() }),
    );

    const contributions = [{ date: Date.now(), value: 3 }];
    let result = [] as typeof contributions;
    service.getCommits(7).subscribe((data) => (result = data));

    const request = httpTesting.expectOne(`${environment.apiUrl}/github/commits?months=7`);
    request.flush(contributions);

    expect(result).toEqual(contributions);
  });
});

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ConverterService } from './converter';

describe('ConverterService', () => {
  let service: ConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

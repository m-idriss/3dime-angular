import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Converter } from './converter';

describe('Converter', () => {
  let component: Converter;
  let fixture: ComponentFixture<Converter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Converter],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Converter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

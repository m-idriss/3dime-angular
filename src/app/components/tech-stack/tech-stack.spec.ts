import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TechStack } from './tech-stack';

describe('TechStack', () => {
  let component: TechStack;
  let fixture: ComponentFixture<TechStack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechStack],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TechStack);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

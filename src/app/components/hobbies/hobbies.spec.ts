import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Hobbies } from './hobbies';

describe('Hobbies', () => {
  let component: Hobbies;
  let fixture: ComponentFixture<Hobbies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hobbies],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Hobbies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

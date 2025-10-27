import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ProfileCard } from './profile-card';

describe('ProfileCard', () => {
  let component: ProfileCard;
  let fixture: ComponentFixture<ProfileCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileCard],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

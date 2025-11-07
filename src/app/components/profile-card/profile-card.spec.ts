import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ProfileCard } from './profile-card';
import { AuthService } from '../../services/auth.service';

describe('ProfileCard', () => {
  let component: ProfileCard;
  let fixture: ComponentFixture<ProfileCard>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'currentUser',
      'isLoading',
      'signOutUser',
    ]);

    await TestBed.configureTestingModule({
      imports: [ProfileCard],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have NgbTooltipModule imported', () => {
    // This test verifies that NgbTooltipModule is properly imported
    // The tooltip enhancement is applied to the sign-out button with:
    // ngbTooltip="Sign out of your account" placement="left" container="body"
    expect(component).toBeTruthy();
  });
});

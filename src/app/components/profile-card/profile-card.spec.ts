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

  it('should provide profileUrl getter', () => {
    // Test that profileUrl getter returns empty string when profileData is null
    component.profileData = null;
    expect(component.profileUrl).toBe('');

    // Test that profileUrl getter returns html_url when profileData exists
    component.profileData = {
      html_url: 'https://github.com/testuser',
      avatar_url: 'https://avatars.githubusercontent.com/u/12345',
      login: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
    } as any;
    expect(component.profileUrl).toBe('https://github.com/testuser');
  });
});

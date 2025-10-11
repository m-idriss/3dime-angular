import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../../services/auth.service';
import { PLATFORM_ID } from '@angular/core';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        AuthService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show login form when not authenticated', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.login-form')).toBeTruthy();
  });

  it('should show error when attempting to login with empty credentials', () => {
    component['username'] = '';
    component['password'] = '';
    component['onLogin']();
    
    expect(component['errorMessage']()).toBe('Please enter both username and password');
  });

  it('should login successfully with valid credentials', () => {
    component['username'] = 'testuser';
    component['password'] = 'validpass';
    component['onLogin']();
    
    expect(authService.isAuthenticated()).toBe(true);
  });

  it('should show error with invalid credentials', () => {
    component['username'] = 'testuser';
    component['password'] = 'abc';
    component['onLogin']();
    
    expect(component['errorMessage']()).toBe('Invalid credentials. Password must be at least 4 characters.');
  });

  it('should logout successfully', () => {
    // Login first
    authService.login('testuser', 'validpass');
    fixture.detectChanges();
    
    component['onLogout']();
    
    expect(authService.isAuthenticated()).toBe(false);
    expect(component['username']).toBe('');
    expect(component['password']).toBe('');
  });
});

import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { PLATFORM_ID } from '@angular/core';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(AuthService);
    
    // Clear localStorage before each test
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially be not authenticated', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should authenticate with valid credentials', () => {
    const result = service.login('testuser', 'password');
    
    expect(result).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should not authenticate with short password', () => {
    const result = service.login('testuser', 'abc');
    
    expect(result).toBe(false);
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should not authenticate with empty credentials', () => {
    const result = service.login('', '');
    
    expect(result).toBe(false);
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should logout successfully', () => {
    service.login('testuser', 'password');
    expect(service.isAuthenticated()).toBe(true);
    
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should persist authentication state in localStorage', () => {
    service.login('testuser', 'password');
    
    if (typeof localStorage !== 'undefined') {
      expect(localStorage.getItem('isAuthenticated')).toBe('true');
    }
  });

  it('should clear authentication state on logout', () => {
    service.login('testuser', 'password');
    service.logout();
    
    if (typeof localStorage !== 'undefined') {
      expect(localStorage.getItem('isAuthenticated')).toBeNull();
    }
  });
});

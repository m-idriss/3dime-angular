import { TestBed } from '@angular/core/testing';
import { PwaService } from './pwa.service';

describe('PwaService', () => {
  let service: PwaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PwaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have showInstallButton signal', () => {
    expect(service.showInstallButton).toBeDefined();
    expect(service.showInstallButton()).toBe(false);
  });

  it('should have canInstall method', () => {
    expect(service.canInstall).toBeDefined();
    expect(typeof service.canInstall).toBe('function');
  });

  it('should have installApp method', () => {
    expect(service.installApp).toBeDefined();
    expect(typeof service.installApp).toBe('function');
  });
});

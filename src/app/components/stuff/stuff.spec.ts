import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Stuff } from './stuff';

describe('Stuff', () => {
  let component: Stuff;
  let fixture: ComponentFixture<Stuff>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stuff],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Stuff);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

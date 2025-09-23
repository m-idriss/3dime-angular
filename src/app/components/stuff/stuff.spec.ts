import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stuff } from './stuff';

describe('Stuff', () => {
  let component: Stuff;
  let fixture: ComponentFixture<Stuff>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stuff]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Stuff);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

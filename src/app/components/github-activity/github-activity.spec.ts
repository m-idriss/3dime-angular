import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubActivity } from './github-activity';

describe('GithubActivity', () => {
  let component: GithubActivity;
  let fixture: ComponentFixture<GithubActivity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GithubActivity],
    }).compileComponents();

    fixture = TestBed.createComponent(GithubActivity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

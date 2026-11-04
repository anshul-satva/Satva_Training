import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Effects } from './effects';

describe('Effects', () => {
  let component: Effects;
  let fixture: ComponentFixture<Effects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Effects],
    }).compileComponents();

    fixture = TestBed.createComponent(Effects);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

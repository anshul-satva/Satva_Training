import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalDeepDive } from './signal-deep-dive';

describe('SignalDeepDive', () => {
  let component: SignalDeepDive;
  let fixture: ComponentFixture<SignalDeepDive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalDeepDive],
    }).compileComponents();

    fixture = TestBed.createComponent(SignalDeepDive);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

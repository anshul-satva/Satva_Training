import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalInput } from './signal-input';

describe('SignalInput', () => {
  let component: SignalInput;
  let fixture: ComponentFixture<SignalInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalInput],
    }).compileComponents();

    fixture = TestBed.createComponent(SignalInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

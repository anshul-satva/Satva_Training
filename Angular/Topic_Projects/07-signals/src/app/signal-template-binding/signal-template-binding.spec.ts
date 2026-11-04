import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalTemplateBinding } from './signal-template-binding';

describe('SignalTemplateBinding', () => {
  let component: SignalTemplateBinding;
  let fixture: ComponentFixture<SignalTemplateBinding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalTemplateBinding],
    }).compileComponents();

    fixture = TestBed.createComponent(SignalTemplateBinding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

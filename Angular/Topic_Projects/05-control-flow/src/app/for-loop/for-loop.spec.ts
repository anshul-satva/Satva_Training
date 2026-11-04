import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForLoop } from './for-loop';

describe('ForLoop', () => {
  let component: ForLoop;
  let fixture: ComponentFixture<ForLoop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForLoop],
    }).compileComponents();

    fixture = TestBed.createComponent(ForLoop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

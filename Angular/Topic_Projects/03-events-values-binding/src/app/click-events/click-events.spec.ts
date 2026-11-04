import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickEvents } from './click-events';

describe('ClickEvents', () => {
  let component: ClickEvents;
  let fixture: ComponentFixture<ClickEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClickEvents],
    }).compileComponents();

    fixture = TestBed.createComponent(ClickEvents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

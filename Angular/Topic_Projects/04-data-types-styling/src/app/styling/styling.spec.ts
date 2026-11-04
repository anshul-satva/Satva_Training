import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Styling } from './styling';

describe('Styling', () => {
  let component: Styling;
  let fixture: ComponentFixture<Styling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Styling],
    }).compileComponents();

    fixture = TestBed.createComponent(Styling);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

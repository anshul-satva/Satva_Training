import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowWayBinding } from './tow-way-binding';

describe('TowWayBinding', () => {
  let component: TowWayBinding;
  let fixture: ComponentFixture<TowWayBinding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TowWayBinding],
    }).compileComponents();

    fixture = TestBed.createComponent(TowWayBinding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

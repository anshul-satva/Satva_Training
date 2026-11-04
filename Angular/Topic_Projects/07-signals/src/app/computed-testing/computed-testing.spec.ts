import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputedTesting } from './computed-testing';

describe('ComputedTesting', () => {
  let component: ComputedTesting;
  let fixture: ComponentFixture<ComputedTesting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComputedTesting],
    }).compileComponents();

    fixture = TestBed.createComponent(ComputedTesting);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

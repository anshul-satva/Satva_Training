import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTypes } from './data-types';

describe('DataTypes', () => {
  let component: DataTypes;
  let fixture: ComponentFixture<DataTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTypes],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTypes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

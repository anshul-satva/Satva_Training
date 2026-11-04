import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSetValue } from './get-set-value';

describe('GetSetValue', () => {
  let component: GetSetValue;
  let fixture: ComponentFixture<GetSetValue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetSetValue],
    }).compileComponents();

    fixture = TestBed.createComponent(GetSetValue);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cmp } from './cmp';

describe('Cmp', () => {
  let component: Cmp;
  let fixture: ComponentFixture<Cmp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cmp],
    }).compileComponents();

    fixture = TestBed.createComponent(Cmp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

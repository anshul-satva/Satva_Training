import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartCounter } from './cart-counter';

describe('CartCounter', () => {
  let component: CartCounter;
  let fixture: ComponentFixture<CartCounter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartCounter],
    }).compileComponents();

    fixture = TestBed.createComponent(CartCounter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

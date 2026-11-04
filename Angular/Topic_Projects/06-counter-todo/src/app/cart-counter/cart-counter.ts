import { Component, signal, effect, computed } from '@angular/core';

@Component({
  selector: 'app-cart-counter',
  imports: [],
  templateUrl: './cart-counter.html',
  styleUrl: './cart-counter.css',
})
export class CartCounter {
  constructor() {
    effect(() => {
      console.log(
        `Product: ${this.product()}, Price: ${this.price()}, Quantity: ${this.counter()}, Total: ${this.total()}`,
      );
    });
  }

  product = signal<string>('');
  price = signal<number>(0);
  counter = signal<number>(0);
  total = computed(() => this.counter() * this.price());

  setProduct(value: string) {
    this.product.set(value);
  }

  setPrice(value: string) {
    this.price.set(Number(value));
  }

  increment() {
    this.counter.update((cnt) => cnt + 1);
  }
  decrement() {
    this.counter.update((cnt) => cnt - 1);
  }
}

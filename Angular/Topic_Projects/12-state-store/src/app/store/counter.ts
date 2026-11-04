import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CounterStore {
  count = signal(0);

  increment() {
    this.count.update((cnt) => cnt + 1);
  }

  decrement() {
    if (this.count() > 0) {
      // this.count.set(0);
      this.count.update((cnt) => cnt - 1);
    }
  }

  reset() {
    this.count.set(0);
  }
}

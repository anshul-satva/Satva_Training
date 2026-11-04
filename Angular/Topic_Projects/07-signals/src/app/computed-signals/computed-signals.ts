import { Component, computed, signal, effect } from '@angular/core';

@Component({
  selector: 'app-computed-signals',
  imports: [],
  templateUrl: './computed-signals.html',
  styleUrl: './computed-signals.css',
})
export class ComputedSignals {
  count = signal<number>(0);
  plus = signal<number>(2);
  getPlus2() {
    return this.count() + 2;
  }
  // doubleCount = computed<number>(() => this.count() * 2);
  double_Count() {
    this.count.update((cnt) => cnt * 2);
  }
  // trippleCount = computed<number>(() => this.count() * 3);
  // tripple_Count = computed<number>(() => this.count() * 3);
  tripple_Count() {
    this.count.update((cnt) => cnt * 3);
  }

  increment() {
    this.count.set(this.count() + 1);
  }

  firstName = signal<string>('');
  lastName = signal<string>('');
  fullName = signal<string>('');
  FInput(val: string) {
    this.firstName.set(val);
  }
  LInput(val: string) {
    this.lastName.set(val);
  }
  getFullName() {
    this.fullName.set(this.firstName() + ' ' + this.lastName());
  }

  numbers = signal<number[]>([2, 5, 6, 8, 44, 33, 22, 11]);
  total = computed<number>(() => this.numbers().reduce((acc, num) => acc + num, 0));

  price = signal<number[]>([200, 250, 230, 60, 40, 85, 950, 100, 350]);
  cart_total = computed<number>(() => this.price().reduce((acc, num) => acc + num, 0));
}

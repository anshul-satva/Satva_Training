import { Component, effect, signal } from '@angular/core';

@Component({
  selector: 'app-computed-testing',
  imports: [],
  templateUrl: './computed-testing.html',
  styleUrl: './computed-testing.css',
})
export class ComputedTesting {
  count = signal<number>(0);

  // derived values (manual, not computed)
  doubleVal = signal<number>(0);
  tripleVal = signal<number>(0);

  // constructor() {
  //   effect(() => {
  //     const c = this.count();
  //     this.doubleVal.set(c * 2);
  //     this.tripleVal.set(c * 3);
  //   });
  // }

  // actions
  increment() {
    this.count.set(this.count() + 1);
  }
  getDouble() {
    return this.count() * 2;
  }

  getTriple() {
    return this.count() * 3;
  }
  // double_Count() {
  //   this.count.update((cnt) => cnt * 2);
  // }

  // tripple_Count() {
  //   this.count.update((cnt) => cnt * 3);
}

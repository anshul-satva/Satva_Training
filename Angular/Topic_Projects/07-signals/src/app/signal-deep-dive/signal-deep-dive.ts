import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';

@Component({
  selector: 'app-signal-deep-dive',
  imports: [CommonModule],
  templateUrl: './signal-deep-dive.html',
  styleUrl: './signal-deep-dive.css',
})
export class SignalDeepDive {
  count = signal(0);
  price = signal(40);

  constructor() {
    effect(() => {
      console.log(`Count is updated: ${this.count()}`);
      console.log(`Count is updated: ${this.price()}`);
    });
  }

  updateCount() {
    this.count.update((c) => c + 1);
  }

  updatePrice() {
    this.price.update((p) => p + 1);
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-counter-app',
  imports: [],
  templateUrl: './counter-app.html',
  styleUrl: './counter-app.css',
})
export class CounterApp {
  count = 0;
  handle(value: string) {
    if (value === 'increment') {
      this.count++;
    } else if (value === 'decrement') {
      this.count--;
    } else {
      this.count = 0;
    }
  }
}

import { GetSetValue } from './../get-set-value/get-set-value';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-signals',
  imports: [],
  templateUrl: './signals.html',
  styleUrl: './signals.css',
})
export class Signals {
  without_signal = 'Virat Kohli';
  with_signal = signal('Anshul');
  with_signal_toggle() {
    this.with_signal.update((name) => (name === 'Anshul' ? 'Virat Kohli' : 'Anshul'));
  }
}

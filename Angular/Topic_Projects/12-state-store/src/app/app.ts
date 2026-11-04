import { Component } from '@angular/core';
import { UserStore } from './store/user-store';
import { CounterStore } from './store/counter';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(public UserStore: UserStore) {}
  // constructor(public CounterStore: CounterStore) {}
}

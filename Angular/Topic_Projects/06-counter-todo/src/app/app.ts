import { Component } from '@angular/core';
import { CounterApp } from './counter-app/counter-app';
import { CartCounter } from './cart-counter/cart-counter';
import { Todo } from './todo/todo';

@Component({
  selector: 'app-root',
  imports: [CounterApp, CartCounter, Todo],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}

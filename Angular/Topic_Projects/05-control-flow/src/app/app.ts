import { Component } from '@angular/core';
import { IfElse } from './if-else/if-else';
import { ForLoop } from './for-loop/for-loop';

@Component({
  selector: 'app-root',
  imports: [IfElse, ForLoop],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
}


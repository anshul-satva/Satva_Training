import { Component, signal } from '@angular/core';
import { Child } from './child/child';

@Component({
  selector: 'app-signal-input',
  imports: [Child],
  templateUrl: './signal-input.html',
  styleUrl: './signal-input.css',
})
export class SignalInput {
  // username: string = 'Anshul (passed from Parent)';
  // message = 'Message in Parent';
  // updateMessage() {
  //   this.message = ;
  // }
}

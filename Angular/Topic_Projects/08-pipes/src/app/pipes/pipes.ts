import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-pipes',
  imports: [CommonModule],
  templateUrl: './pipes.html',
  styleUrl: './pipes.css',
})
export class Pipes {
  date = new Date();
  money = signal(2500);
  Revenue = signal(108000);
  lname = signal('anshul');
  uname = signal('ANSHUL');

  user = {
    name: 'Anshul',
    age: 20,
  };
}

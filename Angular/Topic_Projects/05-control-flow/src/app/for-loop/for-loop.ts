import { Component } from '@angular/core';

@Component({
  selector: 'app-for-loop',
  imports: [],
  templateUrl: './for-loop.html',
  styleUrl: './for-loop.css',
})
export class ForLoop {
  Friends = ['Virat', 'Divy', 'Dhruv', 'Denish', 'Gourav'];
  items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
  delete(ind: number) {
    this.items.splice(ind, 1);
  }
  numbers = [22, 43, 54, 65, 76, 44, 33, 22, 11];
  // numbers : any = '';
}

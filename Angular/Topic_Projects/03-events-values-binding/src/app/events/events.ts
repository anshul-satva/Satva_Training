import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-events',
  imports: [],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events {
  count = 0;
  // count_num = signal(0);
  increment = () => this.count++;
  Decrement = () => this.count--;
  showEvent(event: any) {
    console.log(event);
  }
  username = '';
  showName(userName: string){
    this.username = userName;
  }
}

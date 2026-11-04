import { Component } from '@angular/core';

@Component({
  selector: 'app-if-else',
  imports: [],
  templateUrl: './if-else.html',
  styleUrl: './if-else.css',
})
export class IfElse {
  isLoggedIn = true;
  showBox = true;
  toggleBox() {
    this.showBox = !this.showBox;
  }
  btn: string = '';
}

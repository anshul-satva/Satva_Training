import { Component } from '@angular/core';
import { Card } from './card/card/card';
import { Button } from './common-component/button/button';

@Component({
  selector: 'app-root',
  imports: [Card, Button],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  message = '';
  onSave(msg: string) {
    this.message = msg;
  }
  clicked() {
    alert('Button Clicked');
  }
}

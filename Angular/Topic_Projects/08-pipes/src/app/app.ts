import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Pipes } from './pipes/pipes';
import { PipeShortcut } from './pipe/pipe-shortcut-pipe';
import { ConvertPipe } from './pipe/convert-pipe';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe, Pipes, PipeShortcut, ConvertPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  fullname = 'Anshul Panchal';
  usd = 1;
  usdToInr = 94.43;
  fillName(value: string) {
    this.fullname = value;
  }
  convertAmt(value: string) {
    this.usd = Number(value);
  }
}

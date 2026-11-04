import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-types',
  imports: [FormsModule],
  templateUrl: './data-types.html',
  styleUrl: './data-types.css',
})
export class DataTypes {
  name: string = 'John Doe';
  result: number | null = null;

  sum(firstNum: string, secondNum: string) {
    this.result = parseFloat(firstNum) + parseFloat(secondNum);
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-styling',
  imports: [],
  templateUrl: './styling.html',
  styleUrl: './styling.css',
})
export class Styling {
  isSelected = true;
  hasError = false;
  isPrimary = true;
  isDisabled = false;
}

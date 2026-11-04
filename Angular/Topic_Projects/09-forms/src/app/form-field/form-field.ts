import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-form-field',
  imports: [],
  templateUrl: './form-field.html',
  styleUrl: './form-field.css',
})
export class FormField {
  label = input<string>();
  value = input<string>('test@gmail.com');
  type = input<string>('text');
  valuechange = output<string>();

  onInput(value: string) {
    console.log('Child Value:', value);
    this.valuechange.emit(value);
  }
}

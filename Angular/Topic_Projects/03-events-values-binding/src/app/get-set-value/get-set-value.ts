import { Component } from '@angular/core';

@Component({
  selector: 'app-get-set-value',
  imports: [],
  templateUrl: './get-set-value.html',
  styleUrl: './get-set-value.css',
})
export class GetSetValue {
  name: string = '';
  city: string = '';
  email: string = '';
  updateName(val: string) {
    this.name = val;
  }
  getEmail(val: string) {
    this.email = val;
  }
}

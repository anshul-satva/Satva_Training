import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  // name = signal('');
  // age = signal(0);
  // submitForm() {
  //   console.log(`form is submitted: ${this.name()} || ${this.age()}`);
  // }

  userSignal = signal({ name: '', email: '' });
  form: any;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: [''],
      name: [''],
    });

    this.form.valueChanges.subscribe((value: any) => {
      this.userSignal.set(value);
    });
  }

  submitForm() {
    console.log(`Name: ${this.userSignal().name} || Email: ${this.userSignal().email} `);
  }
}

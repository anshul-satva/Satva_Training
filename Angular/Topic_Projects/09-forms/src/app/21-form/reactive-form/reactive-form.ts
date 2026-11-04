import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-reactive-form',
  imports: [ReactiveFormsModule], // ← only import needed
  templateUrl: './reactive-form.html',
  styleUrl: './reactive-form.css',
})
export class ReactiveForm {
  // ① Build the form — one FormControl per field
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    age: new FormControl('', [Validators.required, Validators.min(18)]),
    dream: new FormControl('', [Validators.required]),
  });

  // ② Shortcuts — one getter per field (makes HTML cleaner)
  get name() {
    return this.form.get('name');
  }
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }
  get age() {
    return this.form.get('age');
  }
  get dream() {
    return this.form.get('dream');
  }

  // ③ Submit
  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      console.log(this.form.value);
    } else {
      console.log('Form is invalid');
    }
    this.form.reset();
  }
}

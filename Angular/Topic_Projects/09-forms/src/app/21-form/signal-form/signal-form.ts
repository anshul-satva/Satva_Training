import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-signal-form',
  imports: [],
  templateUrl: './signal-form.html',
  styleUrl: './signal-form.css',
})
export class SignalForm {
  email = signal<string>('');
  password = signal<string>('');

  isFormValid = computed(() => {
    return this.email().includes('@') && this.password().toString().length >= 8;
  });

  onSubmit() {
    if (!this.isFormValid()) {
      console.log('Form is invalid. Please check your email and password.');
      return;
    }

    console.log({
      Email: this.email(),
      Password: this.password(),
    });

    this.email.set('');
    this.password.set('');
  }
}

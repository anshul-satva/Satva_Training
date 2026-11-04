import { Component } from '@angular/core';
import { Form } from './form/form';
import { FormField } from './form-field/form-field';
import { UserForm } from './user-form/user-form';
import { SignalForm } from './21-form/signal-form/signal-form';
import { ReactiveForm } from './21-form/reactive-form/reactive-form';

@Component({
  selector: 'app-root',
  imports: [Form, FormField, UserForm, SignalForm, ReactiveForm],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  email = '';
  onEmailChange(value: string) {
    this.email = value;
  }
}

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';

interface LoginData {
  email: string;
  password: string;
}
@Component({
  selector: 'app-user-form',
  imports: [FormField],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserForm {
  loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    // perform login logic here
    const credentials = this.loginModel();
    // console.log(`These are your credentials: ${credentials}`);
    console.log('Logging in with:', credentials);
  }
}

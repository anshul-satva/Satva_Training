import { Component } from '@angular/core';
import { Login } from './login/login';
import { Signin } from './signin/signin';

@Component({
  selector: 'app-root',
  imports: [Signin, Login],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}

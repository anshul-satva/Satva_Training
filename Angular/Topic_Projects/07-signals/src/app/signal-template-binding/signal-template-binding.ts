import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-signal-template-binding',
  imports: [],
  templateUrl: './signal-template-binding.html',
  styleUrl: './signal-template-binding.css',
})
export class SignalTemplateBinding {
  isLogedin = signal(false);
  role = signal<'admin' | 'user'>('user');
  toggle_login() {
    this.isLogedin.set(!this.isLogedin());
    if(this.isLogedin() === true){
      
    }
  }

  features = signal<string[]>(['Dashboard', 'Profile', 'Settings']);

  makeAdmin() {
    this.role.set('admin');
    this.features.set(['Dashboard', 'Profile', 'Settings', 'Admin Panel', 'User Management']);
  }
  makeUser() {
    this.role.set('user');
    this.features.set(['Dashboard', 'Profile', 'Settings']);
  }
}

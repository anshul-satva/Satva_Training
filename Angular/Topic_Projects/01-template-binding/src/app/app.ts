import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  name = 'Angular Tutorial';
  isAdmin = true;
  getAdmin() {
    return 'Anshul';
  }
  getUser = () => ({ name: 'John Doe', email: 'john@gmail.com' });
  getNothing = () => ({ message: 'Nothing to return' });
}

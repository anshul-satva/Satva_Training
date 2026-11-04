import { Component } from '@angular/core';

@Component({
  selector: 'app-signin',
  imports: [],
  // templateUrl: "./signin.html",
  // styleUrl: "./signin.css",
  template: `<h1>Signin works!</h1>
    <p>Hii</p>`,
  styles: `
    h1 {
      color: blue;
    }
    p {
      color: brown;
    }
  `,
})
export class Signin {
  title = 'Angular Signin Component';
}

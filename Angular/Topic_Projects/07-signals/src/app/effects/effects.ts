import { Component, effect, signal } from '@angular/core';

@Component({
  selector: 'app-effects',
  imports: [],
  templateUrl: './effects.html',
  styleUrl: './effects.css',
})
export class Effects {
  // cnt = signal(0);
  // constructor() {
  //   effect(() => {
  //     console.log(`Count is Changed: ${this.cnt()}`);
  //   });
  // }
  // increment() {
  //   this.cnt.update((cnt) => cnt + 1);
  // }
  // isDarkMode = signal(true);
  // constructor() {
  //   effect(() => {
  //     if (this.isDarkMode()) {
  //       document.body.style.backgroundColor = 'black';
  //       document.body.style.color = 'white';
  //     } else {
  //       document.body.style.backgroundColor = 'white';
  //       document.body.style.color = 'black';
  //     }
  //   });
  // }

  // toggle() {
  //   this.isDarkMode.update((mode) => !mode);
  // }

  isMessage = signal(true);
  message = signal('');

  constructor() {
    effect(() => {
      setTimeout(() => {
        if (this.isMessage()) {
          this.message.set('');
        }
      }, 1000);
    });
  }
  showMessage() {
    this.message.set('Message will disappear in 2 seconds');
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-click-events',
  imports: [],
  templateUrl: './click-events.html',
  styleUrl: './click-events.css',
})
export class ClickEvents {
  isActive = true;
  toggleActive() {
    this.isActive = !this.isActive;
  }
  focus_input() {
    console.log('Input field focused');
  }
  blur_input() {
    console.log('Input field blurred');
  }
  mouse_over() {
    console.log('Mouse over the element');
  }
  mouse_leave() {
    console.log('Mouse left the element');
  }
  bg_color = 'lightblue';
  change_color() {
    this.bg_color = this.bg_color === 'lightblue' ? 'lightgreen' : 'lightblue';
  }
  width = 100;
  height = 100;
  onInput(event: any) {
    console.log('Key pressed: ', event.target.value);
  }

  // Component
  onSave(event: MouseEvent) {
    console.log(event.clientX, event.clientY); // where the click happened
  }
}

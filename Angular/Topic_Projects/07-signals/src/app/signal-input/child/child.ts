import { Component, input, Output, EventEmitter, signal } from '@angular/core';

@Component({
  selector: 'app-child',
  imports: [],
  templateUrl: './child.html',
  styleUrl: './child.css',
})
export class Child {
  name = input<string>();
  // @Output() notify = new EventEmitter<string>();

  // sendToParent() {
  //   this.notify.emit('Notification for Parent(EventEmitter)');
  // }
  messsage = signal('This is a message from parent');
  sendToParent() {
    this.messsage.set('This is a message from child');
  }

}

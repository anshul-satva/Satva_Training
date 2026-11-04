import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tow-way-binding',
  imports: [FormsModule],
  templateUrl: './tow-way-binding.html',
  styleUrl: './tow-way-binding.css',
})
export class TowWayBinding {
  // name = signal('Anshul');
  user = signal<{ name: string; age: number }>({
    name: 'Anshul',
    age: 23,
  });

  updateName(value: string) {
    this.user.update((user) => ({ ...user, name: value }));
  }

  updateAge(value: string) {
    this.user.update((user) => ({ ...user, age: Number(value) }));
  }
  username  = "Anshul";
}

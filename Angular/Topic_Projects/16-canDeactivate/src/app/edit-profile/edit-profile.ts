import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CanComponentDeactivate } from '../can-deactivate-guard';

@Component({
  selector: 'app-edit-profile',
  imports: [FormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfile implements CanComponentDeactivate {
  name = 'Alex Morgan';
  email = 'alex@example.com';
  savedName = this.name;
  savedEmail = this.email;

  get hasUnsavedChanges(): boolean {
    return this.name !== this.savedName || this.email !== this.savedEmail;
  }

  save(): void {
    this.savedName = this.name;
    this.savedEmail = this.email;
  }

  canDeactivate(): boolean {
    if (!this.hasUnsavedChanges) {
      return true;
    }

    return confirm('You have unsaved changes. Do you want to leave this page?');
  }
}


import { Component } from '@angular/core';
import { DataTypes } from './data-types/data-types';
import { Styling } from './styling/styling';

@Component({
  selector: 'app-root',
  imports: [DataTypes, Styling],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}

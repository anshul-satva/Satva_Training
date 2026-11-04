import { Component } from '@angular/core';
import { Events } from './events/events';
import { ClickEvents } from './click-events/click-events';
import { GetSetValue } from './get-set-value/get-set-value';
import { TowWayBinding } from './tow-way-binding/tow-way-binding';

@Component({
  selector: 'app-root',
  imports: [Events, ClickEvents, GetSetValue, TowWayBinding],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}

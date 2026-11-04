import { Component } from '@angular/core';
import { Signals } from './signals/signals';
import { ComputedSignals } from './computed-signals/computed-signals';
import { Effects } from './effects/effects';
import { SignalDeepDive } from './signal-deep-dive/signal-deep-dive';
import { SignalTemplateBinding } from './signal-template-binding/signal-template-binding';
import { SignalInput } from './signal-input/signal-input';
import { ComputedTesting } from './computed-testing/computed-testing';

@Component({
  selector: 'app-root',
  imports: [
    Signals,
    ComputedSignals,
    Effects,
    SignalDeepDive,
    SignalTemplateBinding,
    SignalInput,
    ComputedTesting,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}

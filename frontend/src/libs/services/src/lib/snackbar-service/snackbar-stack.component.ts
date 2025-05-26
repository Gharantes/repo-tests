import { Component, ViewEncapsulation } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Snackbar2Service } from './snackbar2.service';

@Component({
  selector: 'lib-stacked-snackbars',
  standalone: true,
  template: `
    <div id="snackbars-container">
      @for (message of snackbarService.getMessageList(); track message) {
        <div class="message-box" [ngClass]="message.closing ? 'closing' : ''">
          <div class="message">
            {{ message.message }}
            @if (!message.timed) {
              <mat-progress-spinner [mode]="'indeterminate'" [diameter]="16"></mat-progress-spinner>
            }
          </div>
          @if (message.timed) {
            <div class="progress-bar" [ngClass]="message.type"></div>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './style.scss',
  imports: [MatProgressSpinner, NgClass],
  providers: [],
})
export class SnackbarStackComponent {
  constructor(public readonly snackbarService: Snackbar2Service) {}
}
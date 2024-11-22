import { Component, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonFormFieldComponent } from '@synergia-frontend/ui';
import { MatButton } from '@angular/material/button';
import { EventsFacadeService } from './events-facade.service';
import { MatCard } from '@angular/material/card';
import { EventDto } from '@synergia-frontend/api';
import { MatDialog } from '@angular/material/dialog';
import { EventCardDialogComponent } from '../dialog/event-card-dialog.component';
import { take, tap } from 'rxjs';
import { NavigationService } from '@synergia-frontend/services';

@Component({
  selector: 'lib-events-route',
  standalone: true,
  providers: [EventsFacadeService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CommonFormFieldComponent,
    MatButton,
    MatCard,
  ],
  template: `
    <div id="events-route-top-contaienr">
      <lib-sy-common-form-field
        id="search-field"
        [prefix]="true"
        [icon]="'search'"
        [label]="'Procure por Eventos...'"
        [control]="searchControl"
      ></lib-sy-common-form-field>

      <button id="create-new-event-btn" mat-stroked-button (click)="navigateToCreateEventsPage()">
        Criar Novo Evento
      </button>
    </div>

    <div id="event-cards-container">
      <mat-card
        *ngFor="let event of facade.events()"
        (click)="openEventCard(event)"
        [appearance]="'outlined'"
        class="event-card"
      >
        <div class="event-picture-container">
          <img class="event-picture" [src]="placeholderImgUrl" alt="" />
        </div>
        <div class="event-details-container">
          <div class="event-title">{{ event.title }}</div>
          <div class="event-description">{{ event.description }}</div>
        </div>
      </mat-card>
    </div>
  `,
  styleUrl: 'events-route.component.scss',
})
export class EventsRouteComponent {
  public readonly placeholderImgUrl =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png';

  public readonly searchControl: FormControl<string | null>;

  constructor(
    public readonly facade: EventsFacadeService,
    private readonly matDialog: MatDialog,
    private readonly destroyRef: DestroyRef,
    private readonly navigationService: NavigationService,
    private readonly fb: FormBuilder
  ) {
    this.searchControl = this.fb.control(null);

    this.facade.initializeNgUpdate(this.destroyRef);
    this.facade.update();
  }

  openEventCard(event: EventDto) {
    const ref = this.matDialog.open(
      EventCardDialogComponent, { data: event }
    );

    ref.afterClosed().pipe(
      tap(reload => {
        if (reload === true) {
          this.facade.update();
        }
      }),
      take(1)
    ).subscribe()
  }

  navigateToCreateEventsPage() {
    this.navigationService.navigateEvents().create().then()
  }
}
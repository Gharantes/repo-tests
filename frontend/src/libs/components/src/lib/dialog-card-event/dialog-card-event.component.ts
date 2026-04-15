import { Component, inject, signal } from '@angular/core';
import {
  EntityGetByIdResourceService,
} from '@synergia-frontend/api';
import { IEventModel } from '@synergia-frontend/interfaces';
import { RoutingService } from '@synergia-frontend/services';
import { map, tap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventDtoToModel } from '@synergia-frontend/mappers';
import { SafeImageComponent } from '../safe-image/safe-image.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-dialog-card-event',
  standalone: true,
  templateUrl: './dialog-card-event.component.html',
  styleUrl: 'dialog-card-event.component.scss',
  imports: [SafeImageComponent, MatButtonModule],
})
export class DialogCardEventComponent {
  public readonly eventModel$: IEventModel = inject(MAT_DIALOG_DATA);
  public readonly event$ = signal<IEventModel>(this.eventModel$);

  constructor(
    private readonly dialog: MatDialogRef<DialogCardEventComponent>,
    private readonly entityService: EntityGetByIdResourceService,
    private readonly routingService: RoutingService
  ) {
    this.lookupEvent();
    this.lookupEventMembers()
  }

  private lookupEvent() {
    const idEvent = this.eventModel$.id;
    this.entityService
      .getEventById(idEvent)
      .pipe(
        map((res) => EventDtoToModel(res)),
        tap((res) => this.event$.set(res))
      )
      .subscribe();
  }

  public editEvent() {
    this.routingService.goToEditEvent(this.eventModel$.id);
    this.dialog.close(null);
  }

  public registerProject() {

  }

  private lookupEventMembers() {

  }

  public fullPage() {
    this.routingService.goToEventDetails(this.eventModel$.id);
    this.dialog.close(null);
  }
}
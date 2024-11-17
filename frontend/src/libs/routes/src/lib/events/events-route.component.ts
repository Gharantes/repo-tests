import { Component, OnDestroy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonFormFieldComponent } from '@synergia-frontend/ui';
import { MatButton, MatIconButton } from '@angular/material/button';
import { EventsFacadeService } from './events-facade.service';
import { MatDivider } from '@angular/material/divider';
import { MatCard } from '@angular/material/card';
import { Subject } from 'rxjs';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'lib-events-route',
  standalone: true,
  providers: [EventsFacadeService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CommonFormFieldComponent,
    MatButton,
    MatDivider,
    MatCard,
    NgOptimizedImage,
    MatIcon,
    MatIconButton,
  ],
  template: `
    <form [formGroup]="form">
      <lib-sy-common-form-field
        [label]="'Nome'"
        [control]="form.controls.name"
      ></lib-sy-common-form-field>

      <lib-sy-common-form-field
        [label]="'Descrição'"
        [control]="form.controls.description"
      ></lib-sy-common-form-field>
    </form>

    <button mat-raised-button [disabled]="invalidForm" (click)="createEvent()">
      Criar
    </button>

    <mat-divider class="divider"></mat-divider>

    <div id="event-cards-container">
      <mat-card
        *ngFor="let event of facade.events()"
        class="event-card"
        [appearance]="'outlined'"
      >
        <div>
          <button mat-icon-button (click)="deleteEvent(event.idEvento)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
        <div class="event-picture-container">
          <img class="event-picture" [src]="placeholderImgUrl" alt="" />
        </div>
        <div class="event-details-container">
          <div class="event-title">{{ event.titulo }}</div>
          <div class="event-description">{{ event.descricao }}</div>
        </div>
      </mat-card>
    </div>
  `,
  styleUrl: 'events-route.component.scss',
})
export class EventsRouteComponent implements OnDestroy {
  public readonly placeholderImgUrl =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png';

  ngUnsubscribe = new Subject<void>();
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public readonly form;

  constructor(
    public readonly facade: EventsFacadeService,
    private readonly fb: FormBuilder
  ) {
    this.form = this.createForm();

    this.facade.initializeNgUpdate(this.ngUnsubscribe);
    this.facade.update();
  }

  public createForm() {
    return this.fb.group({
      name: this.fb.control<string>('', Validators.required),
      description: this.fb.control<string>('', Validators.required),
    });
  }
  get invalidForm() {
    return this.form.invalid;
  }

  createEvent() {
    const form = this.form.value;
    const formValue = {
      name: form.name,
      description: form.description,
    };
    this.facade.createEvent(formValue);
  }

  deleteEvent(idEvento: number) {
    this.facade.deleteEvent(idEvento)
  }
}
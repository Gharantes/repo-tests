import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ICalendarEntryDraft } from '@synergia-frontend/interfaces';
import { parseFromLocalDate, toLocalDate } from '@synergia-frontend/utils';

interface IDialogCalendarEntryData {
  /** Data a editar; sem ela, é uma data nova. */
  editing?: ICalendarEntryDraft;
  /** Dia já escolhido no calendário, para uma data nova. */
  initialDate?: string;
}

/** Marca ou edita uma data do calendário: dia, título e descrição. */
@Component({
  selector: 'lib-dialog-calendar-entry',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule],
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
  template: `
    <form class="container" [formGroup]="form" (ngSubmit)="save()">
      <h2 class="heading">{{ isEdit ? 'Editar data' : 'Nova data' }}</h2>

      <mat-form-field appearance="outline" subscriptSizing="dynamic">
        <mat-label>Dia</mat-label>
        <input matInput formControlName="date" [matDatepicker]="picker" placeholder="dd/mm/aaaa" required>
        <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>

      <mat-form-field appearance="outline" subscriptSizing="dynamic">
        <mat-label>Título</mat-label>
        <input matInput formControlName="title" maxlength="255" required>
      </mat-form-field>

      <mat-form-field appearance="outline" subscriptSizing="dynamic">
        <mat-label>Descrição (opcional)</mat-label>
        <textarea matInput formControlName="description" rows="5"></textarea>
      </mat-form-field>

      <div class="buttons">
        <button mat-button type="button" (click)="close()">Cancelar</button>
        <button mat-flat-button class="save-btn" type="submit" [disabled]="!canSave()">
          <mat-icon>event_available</mat-icon>
          {{ isEdit ? 'Salvar' : 'Marcar' }}
        </button>
      </div>
    </form>
  `,
  styles: `
    .container { display: flex; flex-direction: column; gap: 14px; padding: 18px; box-sizing: border-box; }
    .heading { margin: 0; font-size: 18px; font-weight: 700; color: #121840; }
    textarea { resize: vertical; }
    .buttons { display: flex; justify-content: flex-end; gap: 8px; }
    .save-btn { --mat-button-filled-container-color: #3B52CC; --mat-button-filled-label-text-color: #fff; }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DialogCalendarEntryComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dialogRef = inject<MatDialogRef<DialogCalendarEntryComponent, ICalendarEntryDraft>>(MatDialogRef);
  private readonly data = inject<IDialogCalendarEntryData>(MAT_DIALOG_DATA);

  public readonly isEdit = this.data.editing != null;
  private readonly startDate = this.data.editing?.date ?? this.data.initialDate;

  public readonly form = this.fb.group({
    date: this.fb.control<Date | null>(this.startDate ? parseFromLocalDate(this.startDate) : null, Validators.required),
    title: this.fb.control(this.data.editing?.title ?? ''),
    description: this.fb.control(this.data.editing?.description ?? ''),
  });

  public static open(dialog: MatDialog, data: IDialogCalendarEntryData) {
    return dialog
      .open<DialogCalendarEntryComponent, IDialogCalendarEntryData, ICalendarEntryDraft>(DialogCalendarEntryComponent, {
        width: '480px',
        maxWidth: '100%',
        data,
      })
      .afterClosed();
  }

  public canSave(): boolean {
    const { date, title } = this.form.getRawValue();
    return date != null && !isNaN(date.getTime()) && title.trim().length > 0;
  }

  public close() {
    this.dialogRef.close();
  }

  public save() {
    if (!this.canSave()) return;
    const { date, title, description } = this.form.getRawValue();
    this.dialogRef.close({ date: toLocalDate(date!), title: title.trim(), description: description.trim() });
  }
}

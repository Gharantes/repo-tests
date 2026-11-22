import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConnectorUpsertEvent } from '../connector/connector-upsert-event';
import { EntityCoverFieldComponent } from '../../../shared/entity-fields/entity-cover-field.component';
import { EntityFormFieldsComponent } from '../../../shared/entity-fields/entity-form-fields.component';

/** Criar evento no estilo documento. Editar acontece na própria página do evento. */
@Component({
  selector: 'app-view-upsert-event',
  standalone: true,
  templateUrl: './view-upsert-event.component.html',
  styleUrl: './view-upsert-event.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatButtonModule, MatIconModule, EntityCoverFieldComponent, EntityFormFieldsComponent],
})
export class ViewUpsertEventComponent {
  @Input() public connector!: ConnectorUpsertEvent;

  @Output() public readonly goToParentPageEvent = new EventEmitter<void>();
  @Output() public readonly salvarEvent = new EventEmitter<void>();

  public get descLength(): number {
    return this.connector.form.controls.description.value.length;
  }

  public save() {
    if (this.connector.form.valid) this.salvarEvent.emit();
  }
}

import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConnectorUpsertProject } from '../connector/connector-upsert-project';
import { ProjectCoverFieldComponent } from '../fields/project-cover-field.component';
import { ProjectFormFieldsComponent } from '../fields/project-form-fields.component';

/** Criar projeto no estilo documento. Editar acontece na própria página do projeto. */
@Component({
  selector: 'app-view-upsert-project',
  standalone: true,
  templateUrl: './view-upsert-project.component.html',
  styleUrl: './view-upsert-project.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatButtonModule, MatIconModule, ProjectCoverFieldComponent, ProjectFormFieldsComponent],
})
export class ViewUpsertProjectComponent {
  @Input() public connector!: ConnectorUpsertProject;

  @Output() public readonly goToParentPageEvent = new EventEmitter<void>();
  @Output() public readonly saveEvent = new EventEmitter<void>();

  public get descLength(): number {
    return this.connector.form.controls.description.value.length;
  }

  public save() {
    if (this.connector.form.valid) this.saveEvent.emit();
  }
}

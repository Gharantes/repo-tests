import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IUpsertTenantModel } from '@synergia-frontend/interfaces';

@Component({
  selector: 'app-view-upsert-tenant',
  standalone: true,
  templateUrl: './view-upsert-tenant.component.html',
  styleUrl: './view-upsert-tenant.component.scss',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ]
})
export class ViewUpsertTenantComponent {
  @Output() goToParentPageEvent = new EventEmitter<void>();
  @Output() registrarEntidadeEvent = new EventEmitter<IUpsertTenantModel>();

  private readonly fb = inject(NonNullableFormBuilder);

  public readonly form = this.fb.group({
    title: this.fb.control('', [Validators.required]),
    identifier: this.fb.control('', [Validators.required])
  });

  public isFormValid(){
    const a = this.form.value
    return a.title && a.identifier
  }
  public registrarTenant() {
    const obj = this.mapFormData(this.form.value)
    if (obj) {
      this.registrarEntidadeEvent.emit(obj)
    }
  }
  mapFormData(v: Partial<IUpsertTenantModel>): IUpsertTenantModel | null {
    if (v.title == null || v.identifier == null) {
      return null;
    }
    if (v.title == '' || v.identifier == '') {
      return null;
    }
    return {
      identifier: v.identifier,
      title: v.title
    }
  } 
}

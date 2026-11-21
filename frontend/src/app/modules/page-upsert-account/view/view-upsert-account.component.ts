import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ITagModel } from '@synergia-frontend/interfaces';
import { AddTagBtnComponent } from '@synergia-frontend/components';
import { ConnectorUpsertAccont } from '../connector/connector-upsert-accont';

const PALETTE = ['#3B52CC', '#FF7043', '#16A34A', '#9333EA', '#0891B2', '#DB2777', '#CA8A04', '#4F46E5'];

/** Criar/editar usuário: cartão de perfil com banner e avatar que se monta enquanto digita. */
@Component({
  selector: 'app-view-upsert-account',
  standalone: true,
  templateUrl: './view-upsert-account.component.html',
  styleUrl: './view-upsert-account.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, AddTagBtnComponent],
})
export class ViewUpsertAccountComponent {
  @Input() connector!: ConnectorUpsertAccont;
  @Input() editing = false;

  @Output() readonly goToParentRouteEvent = new EventEmitter<void>();
  @Output() readonly saveEvent = new EventEmitter<void>();

  public showPassword = false;

  protected get c() {
    return this.connector.form.controls;
  }

  public get fullName(): string {
    return `${this.c.firstName.value} ${this.c.lastName.value}`.trim();
  }

  public get initials(): string {
    const f = this.c.firstName.value.trim()[0] ?? '';
    const l = this.c.lastName.value.trim()[0] ?? '';
    return (f + l).toUpperCase() || '?';
  }

  /** Cor estável derivada do login (no cadastro ainda não há ID). */
  public get accent(): string {
    const login = this.c.login.value;
    let h = 0;
    for (let i = 0; i < login.length; i++) h = (h * 31 + login.charCodeAt(i)) | 0;
    return PALETTE[Math.abs(h) % PALETTE.length];
  }

  public tagColor(tag: ITagModel): string {
    return PALETTE[Math.abs(tag.id) % PALETTE.length];
  }

  /** 0 a 4, para o medidor de força da senha. */
  public get passwordScore(): number {
    const p = this.c.password.value;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (p.length >= 12) s++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
    if (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) s++;
    else if (/\d/.test(p) || /[^A-Za-z0-9]/.test(p)) s += 0.5;
    return Math.max(1, Math.min(4, Math.floor(s)));
  }

  public get passwordLabel(): string {
    return ['', 'Fraca', 'Razoável', 'Boa', 'Forte'][this.passwordScore];
  }

  public addTag(tag: ITagModel) {
    const control = this.c.tags;
    if (control.value.some((v) => v.id === tag.id)) return;
    control.setValue([...control.value, tag]);
  }

  public removeTag(tag: ITagModel) {
    const control = this.c.tags;
    control.setValue(control.value.filter((v) => v.id !== tag.id));
  }

  public save() {
    if (this.connector.form.valid) this.saveEvent.emit();
  }
}

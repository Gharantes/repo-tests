import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EntityPermissionResourceService } from '@synergia-frontend/api';
import { IPermissionProfileModel } from '@synergia-frontend/interfaces';
import { SnackbarService } from '@synergia-frontend/services';
import { catchError, EMPTY, Observable, switchMap, tap } from 'rxjs';
import { PermissionGroupsComponent } from '../permission-groups/permission-groups.component';
import { PermissionsPageStore, sameSet } from '../permissions-page.store';

/** `'new'` enquanto o perfil ainda não foi salvo. */
type Selection = number | 'new' | null;

/**
 * Aba Perfis: cria, renomeia, edita e apaga perfis de permissão.
 * Mudar um perfil muda na hora as permissões de todos que o têm.
 */
@Component({
  selector: 'app-permissions-tab-profiles',
  standalone: true,
  templateUrl: './tab-profiles.component.html',
  styleUrl: './tab-profiles.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule, PermissionGroupsComponent],
})
export class TabProfilesComponent {
  public readonly store = inject(PermissionsPageStore);
  private readonly api = inject(EntityPermissionResourceService);
  private readonly snackbar = inject(SnackbarService);

  public readonly selected$ = signal<Selection>(null);
  public readonly titleControl = new FormControl('', { nonNullable: true });
  private readonly title$ = toSignal(this.titleControl.valueChanges, { initialValue: '' });
  private readonly savedTitle$ = signal('');
  private readonly savedPermissions$ = signal<ReadonlySet<number>>(new Set());
  public readonly draftPermissions$ = signal<ReadonlySet<number>>(new Set());
  public readonly saving$ = signal(false);
  /** Num perfil nada é herdado: todas as permissões são editáveis. */
  public readonly noInheritance: ReadonlyMap<number, string> = new Map();

  public readonly current$ = computed(() => {
    const id = this.selected$();
    return typeof id === 'number' ? this.store.profiles$().find((p) => p.id === id) ?? null : null;
  });

  public readonly dirty$ = computed(
    () =>
      this.selected$() === 'new' ||
      this.title$().trim() !== this.savedTitle$() ||
      !sameSet(this.savedPermissions$(), this.draftPermissions$())
  );

  public readonly titleError$ = computed(() => {
    const title = this.title$().trim();
    if (!title) return 'Dê um nome ao perfil.';
    const id = this.selected$();
    const clash = this.store.profiles$().some((p) => p.id !== id && p.title.toLowerCase() === title.toLowerCase());
    return clash ? 'Já existe um perfil com esse nome.' : null;
  });

  public select(profile: IPermissionProfileModel) {
    if (profile.id === this.selected$()) return;
    if (!this.confirmDiscard()) return;
    this.load(profile.id, profile.title, profile.idPermissions);
  }

  public startNew() {
    if (!this.confirmDiscard()) return;
    this.load('new', '', []);
  }

  private load(selection: Selection, title: string, idPermissions: number[]) {
    this.selected$.set(selection);
    this.savedTitle$.set(title);
    this.savedPermissions$.set(new Set(idPermissions));
    this.discard();
  }

  private confirmDiscard(): boolean {
    return this.selected$() == null || !this.dirty$() || confirm('Descartar as alterações não salvas?');
  }

  public toggle(id: number) {
    const next = new Set(this.draftPermissions$());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this.draftPermissions$.set(next);
  }

  public toggleGroup(ids: number[]) {
    const next = new Set(this.draftPermissions$());
    const allOn = ids.every((id) => next.has(id));
    ids.forEach((id) => (allOn ? next.delete(id) : next.add(id)));
    this.draftPermissions$.set(next);
  }

  public discard() {
    this.titleControl.setValue(this.savedTitle$());
    this.draftPermissions$.set(this.savedPermissions$());
  }

  public cancelNew() {
    this.selected$.set(null);
  }

  public save() {
    const selection = this.selected$();
    const idRequester = this.store.myId;
    const idTenant = this.store.idTenant;
    if (selection == null || idRequester == null || idTenant == null || this.titleError$() || !this.dirty$()) return;
    const body = {
      idRequester,
      idTenant,
      title: this.titleControl.value.trim(),
      idPermissions: [...this.draftPermissions$()],
    };
    const request$: Observable<number> =
      selection === 'new'
        ? this.api.createProfile(body)
        : this.api.updateProfile(selection, body).pipe(switchMap(() => [selection]));

    this.saving$.set(true);
    request$
      .pipe(
        switchMap((id) =>
          this.store.loadProfiles().pipe(
            tap(() => this.load(id, body.title, body.idPermissions)),
            // Editar um perfil que eu tenho muda o que esta sessão pode ver.
            switchMap(() => this.store.refreshMyPermissions())
          )
        ),
        catchError((err) => {
          this.snackbar.catchError(err, 'Não foi possível salvar o perfil.');
          this.saving$.set(false);
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.saving$.set(false);
        this.snackbar.showMessage(selection === 'new' ? 'Perfil criado.' : 'Perfil salvo.');
      });
  }

  public remove() {
    const profile = this.current$();
    const idRequester = this.store.myId;
    if (profile == null || idRequester == null) return;
    const who = profile.accountCount === 1 ? '1 usuário perde' : `${profile.accountCount} usuários perdem`;
    const warning = profile.accountCount ? `\n${who} as permissões que vinham dele.` : '';
    if (!confirm(`Excluir o perfil "${profile.title}"?${warning}`)) return;

    this.saving$.set(true);
    this.api
      .deleteProfile(profile.id, idRequester)
      .pipe(
        switchMap(() => this.store.loadProfiles()),
        switchMap(() => this.store.refreshMyPermissions()),
        catchError((err) => {
          this.snackbar.catchError(err, 'Não foi possível excluir o perfil.');
          this.saving$.set(false);
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.saving$.set(false);
        this.selected$.set(null);
        this.snackbar.showMessage('Perfil excluído.');
      });
  }

  public countLabel(p: IPermissionProfileModel): string {
    const perms = `${p.idPermissions.length} ${p.idPermissions.length === 1 ? 'permissão' : 'permissões'}`;
    const users = `${p.accountCount} ${p.accountCount === 1 ? 'usuário' : 'usuários'}`;
    return `${perms} · ${users}`;
  }
}

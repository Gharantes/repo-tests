import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatCalendar, MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalendarParent, ICalendarEntryDraft, ICalendarEntryModel } from '@synergia-frontend/interfaces';
import { CalendarService, RoutingService, SessionService, SnackbarService } from '@synergia-frontend/services';
import { parseFromLocalDate, toLocalDate } from '@synergia-frontend/utils';
import { DialogCalendarEntryComponent } from './dialog-calendar-entry.component';

/**
 * Aba Calendário do projeto/evento: um mês com os dias marcados e, ao lado, a lista das datas.
 * Membros marcam, editam e apagam as datas do próprio projeto/evento. No projeto aparecem também
 * as datas dos eventos em que ele está registrado, só para ver (com o nome do evento).
 */
@Component({
  selector: 'lib-parent-calendar',
  standalone: true,
  imports: [MatDatepickerModule, MatIconModule, MatMenuModule, MatTooltipModule],
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
  template: `
    <div class="layout">
      <div class="month">
        <mat-calendar [selected]="selectedDate()" [dateClass]="dateClass" (selectedChange)="selectDay($event)"></mat-calendar>
      </div>

      <div class="agenda">
        @if (selectedDay(); as day) {
          <div class="filter">
            <span>{{ longDate(day) }}</span>
            <button type="button" class="link" (click)="selectedDay.set(null)">Ver todas</button>
          </div>
        }

        @for (entry of visible(); track entry.id) {
          <article class="entry" [class.past]="isPast(entry)" [class.inherited]="!isOwn(entry)">
            <div class="day" [attr.aria-label]="longDate(entry.date)">
              <strong>{{ dayOf(entry.date) }}</strong>
              <small>{{ monthOf(entry.date) }}</small>
            </div>
            <div class="text">
              <strong class="title">{{ entry.title }}</strong>
              @if (!isOwn(entry)) {
                <button type="button" class="source" matTooltip="Data do evento" (click)="openEvent(entry)">
                  <mat-icon>event</mat-icon>{{ entry.parentTitle }}
                </button>
              }
              @if (entry.description) {
                <p class="description">{{ entry.description }}</p>
              }
              <small class="meta">{{ weekdayOf(entry.date) }} · marcada por {{ entry.authorName }}</small>
            </div>
            @if (canEdit() && isOwn(entry)) {
              <button type="button" class="action" aria-label="Opções da data" [matMenuTriggerFor]="entryMenu">
                <mat-icon>more_horiz</mat-icon>
              </button>
              <mat-menu #entryMenu="matMenu" xPosition="before">
                <button mat-menu-item (click)="edit(entry)"><mat-icon>edit</mat-icon> Editar</button>
                <button mat-menu-item (click)="remove(entry)"><mat-icon>delete</mat-icon> Apagar</button>
              </mat-menu>
            }
          </article>
        } @empty {
          @if (loaded()) {
            <span class="empty">
              {{ selectedDay() ? 'Nada marcado neste dia.' : 'Nenhuma data marcada ainda.' }}
              @if (canEdit()) {
                <button type="button" class="link" (click)="openNew()">Marcar uma data</button>
              }
            </span>
          }
        }
      </div>
    </div>
  `,
  styles: `
    .layout { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; }
    .month { flex: 0 1 296px; min-width: 260px; border: 1px solid #e8e4dc; border-radius: 10px; background: #fff; }
    .agenda { display: flex; flex-direction: column; gap: 10px; flex: 1 1 280px; min-width: 0; }
    .filter { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 13.5px;
      font-weight: 600; color: #1b1f3a; }
    .link { border: 0; background: none; padding: 0; font: inherit; font-size: 13px; color: #3B52CC; cursor: pointer; }
    .link:hover { text-decoration: underline; }
    .entry { display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; border: 1px solid #e8e4dc;
      border-radius: 10px; background: #fff; }
    .entry.inherited { background: #faf9f6; border-style: dashed; }
    .entry.past { opacity: .6; }
    .day { display: flex; flex-direction: column; align-items: center; flex: none; width: 44px; padding: 4px 0;
      border-radius: 8px; background: #eef0fb; color: #3B52CC; line-height: 1.1; }
    .day strong { font-size: 18px; }
    .day small { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }
    .inherited .day { background: #f1efe9; color: #77746c; }
    .text { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
    .title { font-size: 14.5px; color: #121840; overflow-wrap: anywhere; }
    .source { display: inline-flex; align-items: center; gap: 4px; align-self: flex-start; padding: 1px 8px 1px 5px;
      border: 0; border-radius: 999px; background: #ecebe6; color: #55524b; font: inherit; font-size: 12px; cursor: pointer; }
    .source:hover { background: #e2e0d9; }
    .source mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .description { margin: 2px 0 0; font-size: 13.5px; line-height: 1.5; color: #44423c; white-space: pre-wrap;
      overflow-wrap: anywhere; }
    .meta { font-size: 12px; color: #9a978f; }
    .action { display: inline-flex; flex: none; border: 0; background: none; color: #8a877f; cursor: pointer; padding: 4px; border-radius: 6px; }
    .action:hover { background: rgba(0, 0, 0, .06); color: #333; }
    .empty { display: flex; flex-wrap: wrap; gap: 8px; font-size: 0.85rem; color: #888; }

    /* Dias com data marcada: a do próprio projeto/evento em azul, a herdada do evento em cinza. */
    :host ::ng-deep .cal-own .mat-calendar-body-cell-content::after,
    :host ::ng-deep .cal-inherited .mat-calendar-body-cell-content::after {
      content: ''; position: absolute; bottom: 3px; left: 50%; width: 5px; height: 5px; margin-left: -2.5px;
      border-radius: 999px; background: #3B52CC;
    }
    :host ::ng-deep .cal-inherited:not(.cal-own) .mat-calendar-body-cell-content::after { background: #a9a69e; }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ParentCalendarComponent {
  public readonly parentEntity = input.required<CalendarParent>();
  public readonly parentId = input.required<number>();
  /** Membro do projeto/evento. Só membros marcam, editam e apagam. */
  public readonly canEdit = input(false);

  public readonly entries = signal<ICalendarEntryModel[]>([]);
  public readonly loaded = signal(false);
  /** Dia clicado no calendário ("2026-12-05"); filtra a lista. */
  public readonly selectedDay = signal<string | null>(null);
  public readonly selectedDate = computed(() => {
    const day = this.selectedDay();
    return day ? parseFromLocalDate(day) : null;
  });
  public readonly visible = computed(() => {
    const day = this.selectedDay();
    return day ? this.entries().filter((e) => e.date === day) : this.entries();
  });

  private readonly calendar = viewChild(MatCalendar);
  private readonly service = inject(CalendarService);
  private readonly routingService = inject(RoutingService);
  private readonly snackbar = inject(SnackbarService);
  private readonly dialog = inject(MatDialog);
  private readonly idAccount = inject(SessionService).getUserId()!;

  /** Marca no mês os dias que têm data. Lê `entries` na hora em que o calendário desenha. */
  public readonly dateClass: MatCalendarCellClassFunction<Date> = (date, view) => {
    if (view !== 'month') return '';
    const day = toLocalDate(date);
    const onDay = this.entries().filter((e) => e.date === day);
    return {
      'cal-own': onDay.some((e) => this.isOwn(e)),
      'cal-inherited': onDay.some((e) => !this.isOwn(e)),
    };
  };

  constructor() {
    effect(() => {
      const parentEntity = this.parentEntity();
      const parentId = this.parentId();
      this.selectedDay.set(null);
      this.load(parentEntity, parentId);
    });
  }

  /** Datas do próprio projeto/evento; as outras vêm de um evento em que o projeto está. */
  public isOwn(entry: ICalendarEntryModel) {
    return entry.parentEntity === this.parentEntity() && entry.parentId === this.parentId();
  }

  public isPast(entry: ICalendarEntryModel) {
    return entry.date < toLocalDate(new Date());
  }

  public selectDay(date: Date | null) {
    if (date == null) return;
    const day = toLocalDate(date);
    this.selectedDay.set(this.selectedDay() === day ? null : day);
  }

  /** Abre o diálogo de nova data (já no dia escolhido, se houver); o "+" fica no cabeçalho das abas. */
  public openNew() {
    if (!this.canEdit()) return;
    DialogCalendarEntryComponent.open(this.dialog, { initialDate: this.selectedDay() ?? undefined }).subscribe((draft) => {
      if (draft != null) this.create(draft);
    });
  }

  private create(draft: ICalendarEntryDraft) {
    this.service.store(this.parentEntity(), this.parentId(), this.idAccount, draft).subscribe({
      next: () => this.reload(),
      error: (err) => this.snackbar.catchError(err, 'Erro ao marcar a data.'),
    });
  }

  public edit(entry: ICalendarEntryModel) {
    const editing = { date: entry.date, title: entry.title, description: entry.description };
    DialogCalendarEntryComponent.open(this.dialog, { editing }).subscribe((draft) => {
      if (draft == null) return;
      this.service.update(entry.id, this.idAccount, draft).subscribe({
        next: () => this.reload(),
        error: (err) => this.snackbar.catchError(err, 'Erro ao salvar a data.'),
      });
    });
  }

  public remove(entry: ICalendarEntryModel) {
    if (!confirm(`Apagar a data "${entry.title}"? Não tem como desfazer.`)) return;
    this.service.delete(entry.id, this.idAccount).subscribe({
      next: () => this.setEntries(this.entries().filter((e) => e.id !== entry.id)),
      error: (err) => this.snackbar.catchError(err, 'Erro ao apagar a data.'),
    });
  }

  public openEvent(entry: ICalendarEntryModel) {
    this.routingService.goToEventDetails(entry.parentId, 'calendario');
  }

  public dayOf(date: string) {
    return date.slice(8, 10);
  }
  public monthOf(date: string) {
    return parseFromLocalDate(date).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  }
  public weekdayOf(date: string) {
    return parseFromLocalDate(date).toLocaleDateString('pt-BR', { weekday: 'long' });
  }
  public longDate(date: string) {
    return parseFromLocalDate(date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  private reload() {
    this.load(this.parentEntity(), this.parentId());
  }

  private load(parentEntity: CalendarParent, parentId: number) {
    this.service.list(parentEntity, parentId).subscribe({
      next: (res) => {
        // Se trocou de projeto/evento enquanto carregava, descarta a resposta antiga.
        if (parentEntity !== this.parentEntity() || parentId !== this.parentId()) return;
        this.setEntries(res);
        this.loaded.set(true);
      },
      error: (err) => this.snackbar.catchError(err, 'Erro ao carregar o calendário.'),
    });
  }

  /** O mat-calendar não redesenha os dias sozinho quando `dateClass` muda de resultado. */
  private setEntries(entries: ICalendarEntryModel[]) {
    this.entries.set(entries);
    this.calendar()?.updateTodaysDate();
  }
}

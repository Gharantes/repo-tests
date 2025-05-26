import { Component, DestroyRef, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IDoCardGrid } from '@synergia-frontend/interfaces';
import { CardGridEntryInteractionType } from './card-grid-entry-interaction-type';
import { debounceTime, Subject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-card-grid-entry',
  templateUrl: `index.html`,
  styleUrl: 'style.scss',
  imports: [CommonModule],
  standalone: true
})
export class CardGridEntryComponent {
  @Input() public entry!: IDoCardGrid;

  private readonly interactionList = signal<CardGridEntryInteractionType[]>([])
  private readonly interactionSubject = new Subject<CardGridEntryInteractionType[]>();

  @Output()
  public cardInteractionEvent = new EventEmitter<{
    entry: IDoCardGrid,
    interactionType: CardGridEntryInteractionType
  }>
  hasBanner(): boolean {
    return !(this.entry.urlBanner == null) && !(this.entry.urlBanner === '');
  }

  constructor(
    private readonly destroyRef: DestroyRef
  ) {
    this.interactionSubject.pipe(
      debounceTime(200),
      tap(res => {
        const priority: CardGridEntryInteractionType[] = ['BANNER', 'PRIMARY', 'SECONDARY', 'CARD'];

        const found = priority.find(p => res.includes(p));
        if (found) {
          this.cardInteractionEvent.emit({
            entry: this.entry,
            interactionType: found
          });
        }
        this.interactionList.set([])
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
  }

  public interact(interactionType: CardGridEntryInteractionType) {
    const newList = this.interactionList()
    newList.push(interactionType)
    this.interactionList.set(newList);
    this.interactionSubject.next(newList);
  }
}
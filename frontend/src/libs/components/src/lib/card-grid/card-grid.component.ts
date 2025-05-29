import { Component, DestroyRef, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IDoCardGrid } from '@synergia-frontend/interfaces';
import { CardGridEntryComponent } from '../card-grid-entry/card-grid-entry.component';
import { debounceTime, Subject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IDoCardGridEntryInteraction } from '../card-grid-entry/i-do-card-grid-entry-interaction';
import { CardGridEntryInteractionType } from '../card-grid-entry/card-grid-entry-interaction-type';

@Component({
  selector: 'lib-card-grid',
  templateUrl: `index.html`,
  styleUrl: 'style.scss',
  imports: [CommonModule, CardGridEntryComponent],
  standalone: true,
})
export class CardGridComponent {
  @Input() public data$: IDoCardGrid[] = [];
  @Output() cardInteractionEvent = new EventEmitter<IDoCardGridEntryInteraction>();

  private readonly interactionList = signal<IDoCardGridEntryInteraction[]>([])
  private readonly interactionSubject = new Subject<IDoCardGridEntryInteraction[]>();

  constructor(
    private readonly destroyRef: DestroyRef
  ) {
    this.interactionSubject.pipe(
      debounceTime(200),
      tap((interactions: IDoCardGridEntryInteraction[]) => {

        const sortedByPriority: CardGridEntryInteractionType[] = ['BANNER', 'PRIMARY', 'SECONDARY', 'CARD']
        let match: IDoCardGridEntryInteraction | undefined = undefined;

        sortedByPriority.find(type => {
          match = interactions.find(entry => entry.interactionType == type)
          return match != undefined;
        })
        if (match) {
          this.cardInteractionEvent.emit(match)
        }
        this.interactionList.set([])
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
  }
  cardInteraction($event: IDoCardGridEntryInteraction) {
    const newList = this.interactionList()
    newList.push($event)
    this.interactionList.set(newList);
    this.interactionSubject.next(newList);
  }


}
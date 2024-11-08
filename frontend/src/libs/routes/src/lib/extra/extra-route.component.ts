import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtraViewComponent } from '@synergia-frontend/views';
import { ExtraRouteFacadeService } from './extra-route.facade.service';

@Component({
  selector: 'lib-extra-route',
  standalone: true,
  imports: [CommonModule, ExtraViewComponent],
  template: `
    <lib-extra-view
      [counter]="facade.getCount()"
      (resetCountEvent)="facade.resetCount()"
      (addToCountEvent)="addToCount()"
    ></lib-extra-view> 
  `,
  styles: [``],
  providers: [ExtraRouteFacadeService]
})
export class ExtraRouteComponent {
  constructor(
    public readonly facade: ExtraRouteFacadeService
  ) {
  }

  private readonly incrementBy = 1;
  addToCount() {
    this.facade.addToCount(this.incrementBy);
  }
}

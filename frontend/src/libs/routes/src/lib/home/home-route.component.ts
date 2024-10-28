import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtendableTableComponent } from '@synergia-frontend/tables';
import { HomeFacadeService } from './home-facade.service';

@Component({
  selector: 'lib-home',
  standalone: true,
  imports: [CommonModule, ExtendableTableComponent],
  template: `
    <lib-extendable-table></lib-extendable-table>
  `,
  providers: [HomeFacadeService],
  styles: [],
})
export class HomeRouteComponent {
  constructor(
    private readonly facade: HomeFacadeService
  ) {
    console.log('HOME ROUTE');
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeFacadeService } from './home-facade.service';

@Component({
  selector: 'lib-home',
  standalone: true,
  imports: [CommonModule],
  template: ``,
  providers: [HomeFacadeService],
  styles: [],
})
export class HomeRouteComponent {}

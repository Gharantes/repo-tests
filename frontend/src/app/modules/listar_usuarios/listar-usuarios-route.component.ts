import { Component } from "@angular/core";
import { ListarUsuariosViewComponent } from '@synergia-frontend/views';
import { of } from "rxjs";

@Component({
  standalone: true,
  selector: 'app-listar-usuarios-route',
  template: `
    <lib-listar-usuarios-view
      [data$]="data$"
    ></lib-listar-usuarios-view>
  `,
  styleUrl: `./style.scss`,
  imports: [ListarUsuariosViewComponent],
})
export class ListarUsuariosRouteComponent {
  public readonly data$ = of(['teste', 'abc']);
}
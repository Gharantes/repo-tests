import { AfterViewInit, Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginTenantInformationDto, PageLoginResourceService } from '@synergia-frontend/api';
import { IDoLoginTenantInformation } from '@synergia-frontend/interfaces';
import { RoutingService, SnackbarService } from '@synergia-frontend/services';
import { catchError, EMPTY, map, tap } from 'rxjs';

@Component({
  selector: 'app-login-route',
  standalone: true,
  templateUrl: 'index.html',
  styleUrl: 'style.scss',
  providers: [],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRippleModule
  ],
})
export class LoginRouteComponent implements AfterViewInit {
  public readonly listaTenants = signal<IDoLoginTenantInformation[]>([]);
  public readonly tenantSelecionado = signal<IDoLoginTenantInformation | null>(null);
  
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly routingService = inject(RoutingService);
  private readonly pageService = inject(PageLoginResourceService);
  private readonly snackService = inject(SnackbarService);

  public readonly form: FormGroup<{
    idTenant: FormControl<number | null>,
    user: FormControl<string>;
    password: FormControl<string>;
  }> = this.fb.group({
    idTenant: this.fb.control<number | null>(null, [Validators.required]),
    user: this.fb.control<string>('', [Validators.required]),
    password: this.fb.control<string>('', [Validators.required]),
  });

  public attemptLogin() {
    this.pageService.checkLoginInformation({
      idTenant: this.form.controls.idTenant.value as number,
      login: this.form.controls.user.value,
      password: this.form.controls.password.value
    }).pipe(
      catchError(() => {
        this.snackService.addMessage('Nâo foi possível realizar login.')
        return EMPTY;
      }),
      tap(() => {
        this.routingService.goTo(this.routingService.dashboard())
      })
    ).subscribe()
  }

  ngAfterViewInit(): void {
    
    this.pageService.listarTenantsLogin().pipe(
      map(res => this.mapListarTenantsLoginRes(res)),
      tap(res => this.listaTenants.set(res))
    ).subscribe()
  }
  private mapListarTenantsLoginRes(res: LoginTenantInformationDto[]): IDoLoginTenantInformation[] {
    return res.map(v => ({
      ...v
    }))
  }


  public selecionarTenant($event: IDoLoginTenantInformation) {
    this.form.controls.idTenant.setValue($event.id);
    this.tenantSelecionado.set($event);
  }
  public createTenant() {
    this.routingService.goTo(this.routingService.createTenant());
  }
}

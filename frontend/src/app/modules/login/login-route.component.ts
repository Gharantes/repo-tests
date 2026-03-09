import { AfterViewInit, Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  LoginInformationResponseDto,
  LoginTenantInformationDto,
  PageLoginResourceService,
} from '@synergia-frontend/api';
import { IDoLoginTenantInformation } from '@synergia-frontend/interfaces';
import {
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import { catchError, EMPTY, filter, map, Observable, of, tap } from 'rxjs';
import { TenantPickerLoginComponent } from './components/tenant-picker-login/tenant-picker-login.component';

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
    MatRippleModule,
    TenantPickerLoginComponent,
  ],
})
export class LoginRouteComponent implements AfterViewInit {
  public readonly listaTenants = signal<IDoLoginTenantInformation[]>([]);
  public readonly tenantSelecionado = signal<IDoLoginTenantInformation | null>(
    null
  );

  public readonly form: FormGroup<{
    idTenant: FormControl<number | null>;
    user: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly routingService: RoutingService,
    private readonly pageService: PageLoginResourceService,
    private readonly snackService: SnackbarService,
    private readonly sessionService: SessionService
  ) {
    this.form = this.instanceForm();
    this.login(this.useStorage(), false);
  }

  private useStorage(): Observable<LoginInformationResponseDto | null> {
    const login = this.sessionService.retrieveSessionFromLocalStorage();
    if (login == null) {
      return of(null);
    }

    return this.pageService.checkLoginInformation({
      idTenant: login.tenant?.id as number,
      login: login.user?.label ?? '',
      password: '',
      checkLastSeen: true,
    });
  }

  private useForm() {
    const idTenant = this.form.controls.idTenant.value;
    if (idTenant == null) {
      return of(null);
    }

    return this.pageService.checkLoginInformation({
      idTenant: idTenant,
      login: this.form.controls.user.value,
      password: this.form.controls.password.value,
      checkLastSeen: false,
    });
  }

  public attemptLogin() {
    this.login(this.useForm(), true);
  }
  public login(
    obs: Observable<LoginInformationResponseDto | null>,
    showMessage: boolean
  ): void {
    obs
      .pipe(
        catchError(() => {
          if (showMessage) {
            this.snackService.addMessage('Nâo foi possível realizar login.');
          }
          return EMPTY;
        }),
        tap((res) => {
          if (res == null && showMessage) {
            this.snackService.addMessage('Não foi possível realizar login.');
          }
        }),
        filter((res) => res != null),
        tap((res) => {
          this.sessionService.setTenant({
            id: res.idAccount,
            label: res.tenantTitle,
          });
          this.sessionService.setUser({
            id: res.idAccount,
            label: res.login,
          });
          this.sessionService.saveSessionOnLocalStorage();
          this.routingService.goTo(this.routingService.goToDashboard());
        })
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.pageService
      .listarTenantsLogin()
      .pipe(
        map((res) => this.mapListarTenantsLoginRes(res)),
        tap((res) => this.listaTenants.set(res))
      )
      .subscribe();
  }
  private mapListarTenantsLoginRes(
    res: LoginTenantInformationDto[]
  ): IDoLoginTenantInformation[] {
    return res.map((v) => ({ ...v }));
  }

  public setNewTenant($event: IDoLoginTenantInformation) {
    this.form.controls.idTenant.setValue($event.id);
    this.tenantSelecionado.set($event);
  }
  private instanceForm() {
    return this.fb.group({
      idTenant: this.fb.control<number | null>(null, [Validators.required]),
      user: this.fb.control<string>('', [Validators.required]),
      password: this.fb.control<string>('', [Validators.required]),
    });
  }
}

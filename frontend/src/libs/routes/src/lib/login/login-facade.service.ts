import { ElementRef, Injectable, signal } from '@angular/core';
import {
  AccountResourceService,
  TenantLoginPageConfigInfoDto,
  TenantResourceService
} from '@synergia-frontend/api';
import { catchError, EMPTY, tap } from 'rxjs';
import {
  AccountService,
  AuthenticationService,
  NavigationService,
  SnackbarService,
  TenantsService
} from '@synergia-frontend/services';
import { IDoIdentifier } from '@synergia-frontend/utils';

@Injectable()
export class LoginFacadeService {
  public useDarkMode = signal(false);

  constructor(
    /* Services */
    private readonly accountService: AccountService,
    public readonly tenantsService: TenantsService,
    private readonly navigationService: NavigationService,
    private readonly authenticationService: AuthenticationService,
    private readonly snackbarService: SnackbarService,
    /* R Services */
    private readonly tenantRService: TenantResourceService,
    private readonly accountRService: AccountResourceService,
  ) {}

  /** Executed on View Init **/
  public setup(
    container: ElementRef
  ) {
    this.tenantsService.setTenantsFromLocalStorage()
    /** If exists, set default tenant as the last selected one **/
    const tenant = this.tenantsService.setTenantFromLocalStorage();
    /** If Tenant was found, get its login page configurations **/
    if (tenant?.id != null && container != null) {
      this.getLoginPageConfigurationsOfTenantByTenantId(
        tenant.id,
        container
      );
    }
  }
  public getLoginPageConfigurationsOfTenantByTenantId(
    idTenant: number,
    elementRef: ElementRef
  ) {
    this.tenantRService
      .getLoginPageConfigurationsOfTenantByTenantId(idTenant)
      .pipe(
        tap((res: TenantLoginPageConfigInfoDto): void => {
          this.useDarkMode.set(res.darkMode);

          if (res.bgHex) {
            elementRef.nativeElement.style.background = res.bgHex;
          } else {
            elementRef.nativeElement.style.background = 'none';
          }
          if (res.bgUrl) {
            elementRef.nativeElement.style.backgroundImage = `url('${res.bgUrl}')`;
            elementRef.nativeElement.style.backgroundSize = 'cover'; // Adjust to fit
            elementRef.nativeElement.style.backgroundRepeat = 'no-repeat';
            elementRef.nativeElement.style.backgroundPosition = 'center';
          } else {
            elementRef.nativeElement.style.backgroundImage = 'none';
          }
        })
      )
      .subscribe();
  }


  public authenticateUser(
    login: string,
    password: string
  ) {
    const idTenant = this.tenantsService.getTenantId();
    if (idTenant == null) {
      return;
    }
    this.accountRService.authenticateAccount(
      idTenant,
      login,
      password
    ).pipe(
      catchError(() => {
        this.snackbarService.temporaryMessage('Error when authenticating user. User does not exist in tenant, or servers are down.');
        return EMPTY;
      }),
      tap(res => {
        this.accountService.setAccount(res);
        this.authenticationService.updateAuthenticated(true);
        this.navigationService.navigateToHome();
      })
    ).subscribe()
  }

  /** Returns the list of tenants the user has saved in Local Storage
   * The user may pick from this list when deciding where he'd like to log in **/
  getTenants() {
    return this.tenantsService.getTenantList()
  }

  setTenant(tenant: IDoIdentifier) {
    this.tenantsService.setTenant(tenant);
  }

  getTenantId() {
    return this.tenantsService.getTenantId();
  }
}
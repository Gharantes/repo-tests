import { effect, ElementRef, Injectable, signal } from '@angular/core';
import {
  TenantLoginPageConfigInfoDto,
  TenantResourceService,
} from '@synergia-frontend/api';
import { tap } from 'rxjs';

@Injectable()
export class LoginFacadeService {
  public loginPageConfigurationSignal =
    signal<null | TenantLoginPageConfigInfoDto>(null);

  constructor(
    private readonly service: TenantResourceService
  ) {}

  public getLoginPageConfigurationsOfTenantByTenantId(
    idTenant: number,
    elementRef: ElementRef
  ) {
    this.service
      .getLoginPageConfigurationsOfTenantByTenantId(idTenant)
      .pipe(
        tap((res: TenantLoginPageConfigInfoDto): void => {
            this.loginPageConfigurationSignal.set(res)

          if (res.bgHex) {
            elementRef.nativeElement.style.background = res.bgHex;
          } else {
            elementRef.nativeElement.style.background = 'none';
          }
          if (res.bgUrl) {
            elementRef.nativeElement.style.backgroundImage = `url('${res.bgUrl}')`;
            // this.element.nativeElement.style.backgroundImage = `url('${url}')`;
            // this.element.nativeElement.style.backgroundSize = 'cover'; // Adjust to fit
            // this.element.nativeElement.style.backgroundRepeat = 'no-repeat';
            // this.element.nativeElement.style.backgroundPosition = 'center';
          } else {
            elementRef.nativeElement.style.backgroundImage = 'none';
          }
        })
      ).subscribe();
  }
}
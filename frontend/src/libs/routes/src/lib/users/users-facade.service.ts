import { DestroyRef, Injectable } from '@angular/core';
import {
  AccountDto,
  AccountResourceService,
  ImportManagerResourceService
} from '@synergia-frontend/api';
import {
  debounceTime,
  ReplaySubject,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { IDoExtentendableTableColumnInfo } from '@synergia-frontend/tables';
import { TenantsService } from '@synergia-frontend/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class UsersFacadeService {
  private readonly ngUpdate = new Subject<void>();

  public readonly tableInfo: IDoExtentendableTableColumnInfo<AccountDto>[] = [
    {
      def: 'id',
      header: 'ID',
      value: (element) => element.id.toString(),
    },
    {
      def: 'login',
      header: 'Login',
      value: (element) => element.login,
    }
  ];
  private readonly usersSubject = new ReplaySubject<AccountDto[]>();
  public readonly usersData$ = this.usersSubject.asObservable();
  // public readonly users = signal<UsuarioDto[]>([])

  constructor(
    private readonly tenantService: TenantsService,
    private readonly importRService: ImportManagerResourceService,
    private readonly accountRService: AccountResourceService
  ) {}
  update() {
    this.ngUpdate.next();
  }

  initializeNgUpdate(destroyRef: DestroyRef) {
    this.ngUpdate
      .pipe(
        debounceTime(300),
        switchMap(() => this.queryAllAccounts(destroyRef)),
        takeUntilDestroyed(destroyRef)
      )
      .subscribe();
  }

  queryAllAccounts(destroyRef: DestroyRef) {
    const idTenant = this.tenantService.getTenantId() ?? -1;
    return this.accountRService.getAllAccounts(idTenant).pipe(
      tap((res) => this.usersSubject.next(res)),
      take(1),
      takeUntilDestroyed(destroyRef)
    );
  }
  createAccountsInMassFromExcelFile(file: File, destroyRef: DestroyRef) {
    const asBlob = new Blob([file]);
    const idTenant = this.tenantService.getTenantId() ?? -1;
    this.importRService
      .createAccountsInMassFromExcelFile(idTenant, asBlob)
      .pipe(
        tap(() => this.update()),
        take(1),
        takeUntilDestroyed(destroyRef)
      )
      .subscribe();
  }
}
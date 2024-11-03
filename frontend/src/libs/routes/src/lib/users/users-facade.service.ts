import { Injectable, signal } from '@angular/core';
import {
  EventoDto,
  EventoResourceService,
  ProjetoDto,
  ProjetoResourceService, UsuarioDto,
  UsuarioResourceService
} from '@synergia-frontend/api';
import { debounceTime, ReplaySubject, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { IDoExtentendableTableColumnInfo } from '@synergia-frontend/tables';

@Injectable()
export class UsersFacadeService {
  private readonly ngUpdate = new Subject<void>();

  public readonly tableInfo: IDoExtentendableTableColumnInfo<UsuarioDto>[] = [
    {
      def: 'id',
      header: 'ID',
      value: element => element.idUsuario.toString()
    },
    {
      def: 'name',
      header: 'Nome',
      value: element => element.name
    },
    {
      def: 'email',
      header: 'Email',
      value: element => element.email
    },
  ]
  private readonly usersSubject = new ReplaySubject<UsuarioDto[]>()
  public readonly usersData$ = this.usersSubject.asObservable();
  // public readonly users = signal<UsuarioDto[]>([])

  constructor(
    private readonly service: UsuarioResourceService
  ) {
  }


  initializeNgUpdate(ngUnsubscribe: Subject<void>) {
    this.ngUpdate.pipe(
      debounceTime(300),
      switchMap(() => this.queryAllUsers()),
      takeUntil(ngUnsubscribe),
    ).subscribe()
  }
  update() {
    this.ngUpdate.next();
  }
  queryAllUsers() {
    return this.service.getAllUsers().pipe(
      tap(res => this.usersSubject.next(res)),
      take(1)
    )
  }
  createFile(file: File) {
    const asBlob = new Blob([file]);

    this.service.createUsersFromFile(asBlob).pipe(
      tap(() => this.update())
    ).subscribe()
  }
}
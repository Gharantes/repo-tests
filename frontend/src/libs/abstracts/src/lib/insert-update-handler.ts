import { inject, signal } from '@angular/core';
import { catchError, EMPTY, map, Observable, Subject, tap } from 'rxjs';
import { RoutingService, Snackbar2Service } from '@synergia-frontend/services';
import { ActivatedRoute } from '@angular/router';
import { IDoRouteDetails } from '@synergia-frontend/interfaces';

export class InsertUpdateHandler<T, Y, Z> {
  private readonly routingService = inject(RoutingService);
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly snackbarService: Snackbar2Service = inject(Snackbar2Service);

  public readonly primaryKey = signal<number | undefined>(undefined);

  public readonly populateForm = new Subject<T | null>();
  public parentRoute?: IDoRouteDetails;


  public getPrimaryKey() {
    this.routingService
      .getParamFromRoute(this.activatedRoute, 'id')
      .then((res) => {
        const id = res ? Number(res) : null;
        const fn = this.getByIdFn;
        const mapper = this.reverseInsertMapper;

        if (id == null || fn == null || mapper == null) {
          return;
        }
        this.primaryKey.set(id);

        fn(id)
          .pipe(
            map((res) => mapper(res, id)),
            tap((res) => this.populateForm.next(res))
          )
          .subscribe();
      });
  }

  private insertMapper: ((el: T) => Y) | undefined;
  public setInsertMapper(mapper: (el: T) => Y) {
    this.insertMapper = mapper;
  }
  private reverseInsertMapper: ((el: Y, id: number) => T) | undefined;
  public setReverseInsertMapper(mapper: (el: Y, id: number) => T) {
    this.reverseInsertMapper = mapper;
  }
  private updateMapper: ((el: T, id: number) => Z) | undefined;
  public setUpdateMapper(mapper: (el: T, id: number) => Z) {
    this.updateMapper = mapper;
  }

  private registrarEntidadeFn: ((el: Y) => Observable<unknown>) | undefined;
  public setRegistrarEntidadeFn($event: (el: Y) => Observable<unknown>) {
    this.registrarEntidadeFn = $event;
  }
  private atualizarEntidadeFn: ((el: Z) => Observable<unknown>) | undefined;
  public setAtualizarEntidadeFn($event: (el: Z) => Observable<unknown>) {
    this.atualizarEntidadeFn = $event;
  }
  private getByIdFn: ((id: number) => Observable<Y>) | undefined;
  public setGetByIdFn($event: (id: number) => Observable<Y>) {
    this.getByIdFn = $event;
  }

  public save($event: T) {
    if (this.primaryKey() == null) {
      this.registrar($event);
    } else {
      this.atualizar($event);
    }
  }

  private registrar($event: T) {
    if (this.registrarEntidadeFn == null || this.insertMapper == null) {
      return;
    }
    const mapped = this.insertMapper($event);
    this.registrarEntidadeFn(mapped).pipe(
      catchError(err => {
        this.snackbarService.catchError(err, 'Erro ao registrar Entidade')
        return EMPTY
      }),
      tap(() => {
        this.snackbarService.message('Entidade registrada com sucesso');
      })
    ).subscribe();
  }

  private atualizar($event: T) {
    if (this.atualizarEntidadeFn == null || this.updateMapper == null) {
      return;
    }
    const mapped = this.updateMapper($event, this.primaryKey() as number);
    this.atualizarEntidadeFn(mapped).pipe().subscribe();
  }
}
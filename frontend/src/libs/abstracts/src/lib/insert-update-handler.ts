import { inject, signal } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { RoutingService } from '@synergia-frontend/services';
import { ActivatedRoute } from '@angular/router';

export class InsertUpdateHandler<T, Y, Z> {
  public readonly primaryKey = signal<number | undefined>(undefined);

  public readonly populateForm = new Subject<T | null>();

  private readonly routingService = inject(RoutingService);
  private readonly activatedRoute = inject(ActivatedRoute);
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
            map((res) => mapper(res)),
            tap((res) => this.populateForm.next(res))
          )
          .subscribe();
      });
  }

  private insertMapper: ((el: T) => Y) | undefined;
  public setInsertMapper(mapper: (el: T) => Y) {
    this.insertMapper = mapper;
  }
  private reverseInsertMapper: ((el: Y) => T) | undefined;
  public setReverseInsertMapper(mapper: (el: Y) => T) {
    this.reverseInsertMapper = mapper;
  }
  private updateMapper: ((el: T) => Z) | undefined;
  public setUpdateMapper(mapper: (el: T) => Z) {
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
  private getByIdFn: ((el: number) => Observable<Y>) | undefined;
  public setGetByIdFn($event: (el: number) => Observable<Y>) {
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
    this.registrarEntidadeFn(mapped).pipe().subscribe();
  }

  private atualizar($event: T) {
    if (this.atualizarEntidadeFn == null || this.updateMapper == null) {
      return;
    }
    const mapped = this.updateMapper($event);
    this.atualizarEntidadeFn(mapped).pipe().subscribe();
  }
}
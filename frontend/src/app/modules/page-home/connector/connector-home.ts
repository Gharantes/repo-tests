import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

@Injectable()
export class ConnectorHome {
  private readonly fb = inject(NonNullableFormBuilder);

  /** Verificação de existência do tenant em andamento. */
  public readonly checking$ = signal(false);
  /** Identifier digitado que não corresponde a nenhum tenant. */
  public readonly notFound$ = signal<string | null>(null);

  public readonly form = this.fb.group({
    identifier: this.fb.control('', [Validators.required]),
  });

  constructor() {
    // O aviso some assim que o identifier é editado.
    this.form.controls.identifier.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.notFound$.set(null));
  }

  public getIdentifier(): string | null {
    const identifier = this.form.controls.identifier.value.trim();
    return identifier.length > 0 ? identifier : null;
  }
}

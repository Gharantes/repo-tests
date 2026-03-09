import { Component, signal } from '@angular/core';
import { IDoListarEventos, IDoListarTags, IUpsertProject } from '@synergia-frontend/interfaces';
import { RoutingService, SessionService } from '@synergia-frontend/services';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ControlsOf } from '@synergia-frontend/abstracts';
import { take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-registrar-projetos-route',
  standalone: true,
  templateUrl: './route-upsert-project.component.html',
  styleUrl: `./route-upsert-project.component.scss`,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
})
export class RouteUpsertProjectComponent {
  constructor(
    private readonly sessionService: SessionService,
    private readonly routingService: RoutingService
  ) {}
  public goToLastPage() {
    this.routingService.goTo(this.routingService.projects());
  }
  public readonly form = this.fb.group<ControlsOf<IUpsertProject>>({
    title: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required]),
    urlBanner: this.fb.control(null),
    tags: this.fb.control([])
  });

  override mapFormData(
    v: Partial<IUpsertProject>
  ): IUpsertProject | null {
    if (v.title == null || v.description == null) {
      return null;
    }
    return {
      description: v.description,
      title: v.title,
      urlBanner: v.urlBanner ?? null,
      tags: v.tags ?? []
    };
  }
  ngAfterViewInit() {
    this.populateForm.pipe(
      tap(res => {
        if (res != null) {
          this.form.controls.title.setValue(res.title)
          this.form.controls.description.setValue(res.description)
          this.form.controls.urlBanner.setValue(res.urlBanner);
          this.form.controls.tags.setValue(res.tags);
        }
      }),
      take(1),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()

  }
}
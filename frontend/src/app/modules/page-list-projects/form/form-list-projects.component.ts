import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatLabel } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { ConnectorListProjects } from '../connector/connector-list-projects';

@Component({
  selector: 'app-form-list-projects',
  templateUrl: './form-list-projects.component.html',
  styleUrl: './form-list-projects.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormField,
    MatInput,
    FormsModule,
    MatLabel,
    ReactiveFormsModule,
  ],
})
export class FormListProjectsComponent {
  @Input() connector!: ConnectorListProjects;
}
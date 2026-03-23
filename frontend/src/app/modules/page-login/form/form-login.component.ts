import { Component, Input } from '@angular/core';
import { ConnectorLogin } from '../connector/connector-login';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgForOf } from '@angular/common';
import { ITenantModel } from '@synergia-frontend/interfaces';

@Component({
  selector: 'app-form-login',
  standalone: true,
  templateUrl: './form-login.component.html',
  styleUrl: './form-login.component.scss',
  providers: [],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatButtonModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
    NgForOf,
  ],
})
export class FormLoginComponent {
  @Input() public connector!: ConnectorLogin;
  displayTenant: ((value: ITenantModel|string|null) => string) = (res) => {
    if (res == null) {
      return '';
    } else if (typeof res == 'string') {
      return res;
    } else {
      return res.title + ' [' + res.identifier + ']'
    }
  }
}

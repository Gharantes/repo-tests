import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor (
    private readonly snack: MatSnackBar
  ) {}

  public addMessage(msg: string) {
    this.snack.open(msg, undefined, { duration: 3000 });
  }
}
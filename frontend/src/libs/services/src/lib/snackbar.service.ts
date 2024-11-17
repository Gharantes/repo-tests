import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(
    private readonly snackbar: MatSnackBar
  ) {}

  private duration = 3000; // 3 Seconds

  public close() {
    this.snackbar.dismiss();
  }
  public show(msg: string, action: string | undefined = undefined) {
    this.close();
    this.snackbar.open(msg, action, { duration: this.duration })
  }
}
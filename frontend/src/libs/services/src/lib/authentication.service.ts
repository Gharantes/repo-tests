import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly authenticated$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.updateAuthenticated(
      this.checkSessionStorage()
    )
  }
  getAuthenticated() {
    return this.authenticated$.value;
  }
  updateAuthenticated(bool: boolean) {
    if (bool) {
      this.authenticated$.next(true);
      this.updateSessionStorage('true')
    } else {
      this.authenticated$.next(false);
      this.updateSessionStorage('false')
    }
  }
  private updateSessionStorage(bool: string) {
    sessionStorage.setItem('authenticated', bool)
  }
  private checkSessionStorage () {
    return sessionStorage.getItem('authenticated') == 'true'
  }
}
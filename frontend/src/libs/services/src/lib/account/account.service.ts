import { Injectable, signal } from '@angular/core';
import { IDoAccount } from './i-do-account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly account = signal<IDoAccount | null>(null);

  public setAccount (account: IDoAccount) {
    this.account.set(account);
  }
  public getAccount () {
    return this.account();
  }
  public getAccountId() {
    return this.account()?.id
  }
  public getAccountLogin() {
    return this.account()?.login;
  }
}
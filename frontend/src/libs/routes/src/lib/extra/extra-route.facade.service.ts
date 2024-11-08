import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable()
export class ExtraRouteFacadeService {
  private readonly signal: WritableSignal<number> = signal(0);

  public getCount() {
    return this.signal();
  }
  public addToCount(value: number) {
    this.signal.update(og => og + value);
  }
  public resetCount() {
    this.signal.set(0);
  }
}
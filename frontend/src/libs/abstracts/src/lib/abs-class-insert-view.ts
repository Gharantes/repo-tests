import { FormControl, FormGroup } from "@angular/forms";

export abstract class AbsClassInsertView<T> {
    abstract form: FormGroup<ControlsOf<T>>;
    abstract mapFormData(v: Partial<T>): T | null;
    // abstract getFormData(): T | null;
    // abstract registrarEntidade(): void;
    // abstract goToParentPage(): void 

    getFormData(): T | null {
        return this.mapFormData(this.form.value as Partial<T>);
    }
    abstract registrarEntidade(): void
    abstract goToParentPage(): void;
}


export type ControlsOf<T> = {
    [K in keyof T]: FormControl<T[K]>;
  };
  
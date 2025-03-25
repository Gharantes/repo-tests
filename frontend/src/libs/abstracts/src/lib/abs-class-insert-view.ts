import { EventEmitter } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

export abstract class AbsClassInsertView<T> {

    abstract goToParentPageEvent: EventEmitter<void>;
    abstract registrarEntidadeEvent: EventEmitter<T>;

    abstract form: FormGroup<ControlsOf<T>>;
    abstract mapFormData(v: Partial<T>): T | null;
    isFormValid(): boolean {
        return this.form.valid
    }

    registrarEntidade() {
        const f = this.getFormData();
        if (f != null && this.isFormValid()) {
            this.registrarEntidadeEvent.emit(f);
        }
    }
    getFormData(): T | null {
        return this.mapFormData(this.form.value as Partial<T>);
    }
    goToParentPage(): void {
        this.goToParentPageEvent.emit();
    }
}


export type ControlsOf<T> = {
    [K in keyof T]: FormControl<T[K]>;
  };
  
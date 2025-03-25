export abstract class AbsClassInsertRoute<T> {
    abstract registrarEntidade($event: T): void;
}
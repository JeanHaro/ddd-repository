/*
Un Value Object:
- No tiene ID — su identidad ES su valor
- Es inmutable — nunca cambia después de crearse
- Tiene validación en el constructor estático create()
- Dos Value Objects con el mismo valor son iguales
*/


export abstract class ValueObject<T> {
    protected constructor (
        protected readonly value: T
    ) {}

    getValue(): T {
        return this.value;
    }

    equals ( other: ValueObject<T> ): boolean {
        return JSON.stringify(other.getValue()) === JSON.stringify(this.getValue())
    }

    toString(): string {
        return String(this.value);
    }
}
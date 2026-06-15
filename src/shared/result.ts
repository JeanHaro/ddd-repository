// TODO: Esta es una de las piezas más importantes de DDD.
// En lugar de lanzar excepciones para errores de dominio, usamos Result<T, E>

export class Result<T, E = string> {
    private constructor (
        private readonly _isSuccess: boolean,
        private readonly _value?: T,
        private readonly _error?: E
    ) {}

    static ok<T>( value?: T ): Result<T, never> {
        return new Result<T, never>(true, value);
    }

    static fail<E>( error: E ): Result<never, E> {
        return new Result<never, E>(false, undefined, error);
    }

    isSuccess(): boolean {
        return this._isSuccess;
    }

    isFailure(): boolean {
        return !this._isSuccess;
    }

    getValue(): T {
        if ( !this._isSuccess ) {
            throw new Error('No puedes obtener el valor de un Result fallido');
        }

        return this._value as T;
    }

    getError(): E {
        if ( this._isSuccess ) {
            throw new Error('No puedes obtener el error de un Result exitoso');
        }

        return this._error as E;
    }
}
/*
UserId es un Value Object que representa el ID de un user.
- Es un wrapper de string (UUID)
- No puede estar vacío
*/

// Value-Object
import { ValueObject } from "../../shared/value-object";

// Result
import { Result } from "../../shared/result";

export class UserId extends ValueObject<string> {
    private constructor ( value: string ) {
        super(value);
    }

    static create ( value: string ): Result<UserId> {
        if ( value.trim().length === 0 ) {
            return Result.fail('El id no puede estar vacío')
        }

        return Result.ok(new UserId(value));
    }
}
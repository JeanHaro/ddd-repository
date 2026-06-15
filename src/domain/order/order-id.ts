/*
OrderId es un Value Object que representa el ID de un order.
- Es un wrapper de string (UUID)
- No puede estar vacío
*/

// Value-Object
import { ValueObject } from "../../shared/value-object";

// Result
import { Result } from "../../shared/result";

export class OrderId extends ValueObject<string> {
    private constructor ( value: string ) {
        super(value);
    }

    static create ( value: string ): Result<OrderId> {
        if ( value.trim().length === 0 ) {
            return Result.fail('El id no puede estar vacío')
        }

        return Result.ok(new OrderId(value));
    }
}
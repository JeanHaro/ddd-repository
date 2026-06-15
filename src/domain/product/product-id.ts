/*
ProductId es un Value Object que representa el ID de un producto.
- Es un wrapper de string (UUID)
- No puede estar vacío
*/

// Value-Object
import { ValueObject } from "../../shared/value-object";

// Result
import { Result } from "../../shared/result";

export class ProductId extends ValueObject<string> {
    private constructor ( value: string ) {
        super(value);
    }

    static create ( value: string ): Result<ProductId> {
        if ( value.trim().length === 0 ) {
            return Result.fail('El id no puede estar vacío')
        }

        return Result.ok(new ProductId(value));
    }
}
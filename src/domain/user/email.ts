/*
Email es un Value Object que representa un email.
- No puede estar vacío
- Debe contener @
- Se normaliza a minúsculas al crearse
*/

// Shared - Value Object
import { ValueObject } from "../../shared/value-object";
// Shared - Result
import { Result } from "../../shared/result";

export class Email extends ValueObject<string> {
    private constructor ( value: string ) {
        super(value);
    }

    static create ( value: string ): Result<Email> {
        if ( value.trim().length === 0 ) {
            return Result.fail('El email no puede estar vacío');
        }

        if ( !value.includes('@') ) {
            return Result.fail('No es un email válido');
        }

        return Result.ok(new Email(value.toLowerCase().trim()));
    }
}
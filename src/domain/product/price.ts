/*
Price es un Value Object que representa un precio.
- Tiene amount (número) y currency (string)
- No puede ser negativo
- No puede tener currency vacío
*/

// Shared - Value Object
import { ValueObject } from "../../shared/value-object";

// Shared - Result
import { Result } from "../../shared/result";

interface PriceProps {
    amount: number;
    currency: string;
}

export class Price extends ValueObject<PriceProps> {
    private constructor ( props: PriceProps ) {
        super(props);
    }

    static create ( amount: number, currency: string ): Result<Price> {
        if ( amount < 0 ) {
            return Result.fail('No puede ser negativo la cantidad')
        }

        if ( currency.trim().length === 0 ) {
            return Result.fail('No puede estar vacío la divisa');
        }
        
        return Result.ok(new Price({ amount, currency }));
    }

    getAmount(): number {
        return this.value.amount;
    }

    getCurrency(): string {
        return this.value.currency;
    }

    toString(): string {
        return `${this.value.amount} ${this.value.currency}`
    }
}
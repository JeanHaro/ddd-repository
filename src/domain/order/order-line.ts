/*
OrderLine NO es una Entity ni un Value Object independiente.
Es parte del Aggregate Order — solo existe dentro de una Order.

Tiene:
- product: Product
- quantity: number
- unitPrice: Price (precio al momento de agregar — puede cambiar después)

Método:
- getSubtotal(): Price — quantity * unitPrice
*/

// Product
import { Product } from "../product/product";
import { Price } from "../product/price";

// Shared - Result
import { Result } from "../../shared/result";

export class OrderLine {
    private constructor (
        private readonly product: Product,
        private readonly quantity: number,
        private readonly unitPrice: Price
    ) {}

    static create (
        product: Product,
        quantity: number
    ): Result<OrderLine> {
        if ( quantity <= 0 ) {
            return Result.fail('La cantidad debe ser mayor a 0');
        }

        if ( product.getStock() < quantity ) {
            return Result.fail('El producto no tiene stock suficiente');
        }

        return Result.ok(new OrderLine(product, quantity, product.getPrice()));
    }

    // Getters
    getProduct(): Product { 
        return this.product; 
    }

    getQuantity(): number { 
        return this.quantity; 
    }

    getUnitPrice(): Price { 
        return this.unitPrice; 
    }

    // Métodos
    getSubTotal(): Price {
        const result = Price.create(
            this.quantity * this.unitPrice.getAmount(), 
            this.unitPrice.getCurrency()
        );

        return result.getValue();
    }
}
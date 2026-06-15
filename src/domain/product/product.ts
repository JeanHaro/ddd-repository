/*
Product es una Entity con:
- ProductId como ID
- name: string
- price: Price
- stock: number

Métodos de dominio:
- changePrice(price: Price): void
- addStock(quantity: number): Result<void>
- removeStock(quantity: number): Result<void>
    → falla si no hay suficiente stock
*/

// Shared - Entity
import { Entity } from "../../shared/entity";

// Shared - Result
import { Result } from "../../shared/result";

// Domain - Product
import { Price } from "./price";
import { ProductId } from "./product-id";

export class Product extends Entity<ProductId> {
    private constructor (
        id: ProductId,
        private name: string,
        private price: Price,
        private stock: number
    ) {
        super(id);
    }

    static create (
        id: ProductId,
        name: string,
        price: Price,
        stock: number
    ): Result<Product> {
        if ( name.trim().length === 0 ) {
            return Result.fail('El nombre no puede estar vacío');
        }

        if ( stock < 0 ) {
            return Result.fail('El stock no puede ser un valor negativo');
        }

        return Result.ok(new Product(id, name, price, stock))
    }

    // Getters
    getName(): string {
        return this.name;
    }

    getPrice(): Price {
        return this.price;
    }

    getStock(): number {
        return this.stock;
    }

    // Métodos de dominio
    changePrice ( price: Price ): void {
        this.price = price;
    }

    addStock ( quantity: number ): Result<void> {
        this.stock += quantity

        return Result.ok();
    }

    removeStock ( quantity: number ): Result<void> {
        if (this.stock < quantity) {
            return Result.fail('Stock insuficiente');
        }
        
        this.stock -= quantity;
        return Result.ok();
    }
}
/*
Order es el Aggregate Root — controla todo lo que pasa dentro de una orden.

Tiene:
- OrderId como ID
- userId: UserId — quién hizo la orden
- lines: OrderLine[] — las líneas de la orden
- status: 'pending' | 'confirmed' | 'cancelled'

Métodos de dominio:
- addLine(product, quantity): Result<void>
    → crea un OrderLine
    → llama removeStock en el producto
    → lo agrega a lines

- confirm(): Result<void>
    → solo si status es 'pending'
    → cambia status a 'confirmed'

- cancel(): Result<void>
    → solo si status es 'pending'
    → devuelve el stock de cada línea
    → cambia status a 'cancelled'

- getTotal(): Price
    → suma los subtotales de todas las líneas
*/

// Shared- Entity
import { Entity } from "../../shared/entity";

// Shared- Result
import { Result } from "../../shared/result";

// Order
import { OrderId } from "./order-id";
import { OrderLine } from "./order-line";

// User
import { UserId } from "../user/user-id";

// Product
import { Price } from "../product/price";
import { Product } from '../product/product';

type OrderStatus = 'pending' | 'confirmed' | 'cancelled';

export class Order extends Entity<OrderId> {
    private constructor (
        id: OrderId,
        private readonly userId: UserId,
        private lines: OrderLine[],
        private status: OrderStatus
    ) {
        super(id);
    }

    static create ( id: OrderId, userId: UserId ): Result<Order> {
        return Result.ok(new Order(id, userId, [], 'pending'));
    }

    // Getters
    getUserId(): UserId {
        return this.userId;
    }

    getLines(): OrderLine[] {
        return this.lines;
    }

    getStatus(): OrderStatus {
        return this.status;
    }

    // Métodos de dominio
    addLine ( product: Product, quantity: number ): Result<void> {
        // 1. Crea el OrderLine
        const lineResult = OrderLine.create(product, quantity);

        // 2. Si falló, retornamos el error
        if ( lineResult.isFailure() ) {
            return Result.fail(lineResult.getError());
        }

        // 3. Quita el stock del producto
        product.removeStock(quantity);
        
        // 4. Agrega la linea al array
        this.lines.push(lineResult.getValue());

        return Result.ok();
    }

    confirm(): Result<void> {
        if ( this.status !== 'pending' ) {
            return Result.fail('Solo se puede confirmar una orden pendiente');
        }

        this.status = 'confirmed';

        return Result.ok();
    }

    cancel(): Result<void> {
        if ( this.status !== 'pending' ) {
            return Result.fail('Solo se puede cancelar una orden pendiente');
        }

        // Devuelve el stock de cada línea
        for ( const line of this.lines ) {
            line.getProduct().addStock(line.getQuantity());
        }

        this.status = 'cancelled';

        return Result.ok();
    }

    getTotal(): Price {
        const total = this.lines.reduce(
            (sum, line) => sum + line.getSubTotal().getAmount(),
            0
        );

        // Tomamos la currency de la primera línea (o USD por defecto)
        const currency = this.lines[0]?.getUnitPrice().getCurrency() ?? 'USD';
        return Price.create(total, currency).getValue();
    }
}
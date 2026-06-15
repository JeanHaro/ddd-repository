// Domain - Order
import { Order } from './../../domain/order/order';
import { OrderId } from "../../domain/order/order-id";
import { IOrderRepository } from '../../domain/order/order.repository';

// Domain - User
import { UserId } from '../../domain/user/user-id';

export class InMemoryOrderRepository implements IOrderRepository {
    private orders: Map<string, Order> = new Map();

    findById ( id: OrderId ): Order | null {
        return this.orders.get(id.getValue()) ?? null;
    }

    // Obtenemos las ordenes de un usuario
    findByUserId ( userId: UserId ): Order[] {
        return Array.from(this.orders.values()).filter( 
            order => order.getUserId().equals(userId) 
        );
    }

    save ( order: Order ): void {
        this.orders.set(order.getId().getValue(), order);
    }

    delete ( id: OrderId ): void {
        this.orders.delete(id.getValue());
    }
}
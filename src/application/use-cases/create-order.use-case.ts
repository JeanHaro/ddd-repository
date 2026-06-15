/*
CreateOrderUseCase:
- Recibe: orderId, userId
- Crea una Order nueva
- La guarda en el repositorio
- Retorna Result<Order>
*/

// Shared- Result
import { Result } from "../../shared/result";

// Domain - Irder
import { Order } from "../../domain/order/order";
import { OrderId } from "../../domain/order/order-id";
import { IOrderRepository } from "../../domain/order/order.repository";

// Domain - User
import { UserId } from "../../domain/user/user-id";

interface CreateOrderDTO {
    orderId: string;
    userId: string;
}


export class CreateOrderUseCase {
    constructor (
        private readonly orderRepository: IOrderRepository
    ) {}

    execute ( dto: CreateOrderDTO ): Result<Order> {
        // 1. Crea los value objects desde los strings del DTO
        const orderId = OrderId.create(dto.orderId);
        const userId = UserId.create(dto.userId);

        if ( orderId.isFailure() ) {
            return Result.fail(orderId.getError());
        }

        if ( userId.isFailure() ) {
            return Result.fail(userId.getError());
        }

        // 2. Crea la Order
        const order = Order.create(orderId.getValue(), userId.getValue());

        // 3. Guaradmos en el repositorio
        this.orderRepository.save(order.getValue());

        return order;
        
    }
}
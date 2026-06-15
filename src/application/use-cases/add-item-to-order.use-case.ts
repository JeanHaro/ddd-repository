/*
AddItemToOrderUseCase:
- Recibe: orderId, productId, quantity
- Busca la Order en el repositorio
- Busca el Product en el repositorio
- Llama order.addLine(product, quantity)
- Guarda la Order actualizada
- Retorna Result<Order>
*/

// Domain - Order
import { Order } from "../../domain/order/order";
import { OrderId } from "../../domain/order/order-id";
import { IOrderRepository } from "../../domain/order/order.repository";

// Domain - Product
import { ProductId } from "../../domain/product/product-id";
import { IProductRepository } from "../../domain/product/product.repository";

// Shared- Result
import { Result } from "../../shared/result";

interface AddItemToOrderDTO {
    orderId: string;
    productId: string;
    quantity: number;
}

export class AddItemToOrderUseCase {
    constructor (
        private readonly orderRepository: IOrderRepository,
        private readonly productRepository: IProductRepository
    ) {}

    execute ( dto: AddItemToOrderDTO ): Result<Order> {
        // 1. Crea los Value Objects
        const orderId = OrderId.create(dto.orderId);
        const productId = ProductId.create(dto.productId);

        if ( orderId.isFailure() ) {
            return Result.fail(orderId.getError());
        }

        if ( productId.isFailure() ) {
            return Result.fail(productId.getError());
        }

        // 2. Busca la Order
        const order = this.orderRepository.findById(orderId.getValue());
        if ( !order ) {
            return Result.fail('Orden no encontrada');
        }
        
        // 3. Busca el Product
        const product = this.productRepository.findById(productId.getValue());
        if ( !product ) {
            return Result.fail('Producto no encontrado');
        }
        
        // 4. Llamamos a order.addLine
        const addLineResult = order.addLine(product, dto.quantity);
        
        // 5. Si falla Add Line
        if ( addLineResult.isFailure() ) {
            return Result.fail(addLineResult.getError());
        }

        // 6. Guardamos el Order actualizado
        this.orderRepository.save(order);

        // 7. Retornamos el order
        return Result.ok(order);
    }
}
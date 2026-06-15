// Domain - Product
import { ProductId } from "./domain/product/product-id";
import { Price } from "./domain/product/price";
import { Product } from "./domain/product/product";

// Domain - User
import { UserId } from "./domain/user/user-id";

// Domain - Order
import { OrderId } from "./domain/order/order-id";

// Infraestructura
import { InMemoryProductRepository } from './infrastructure/repositories/in-memory-product.repository';
import { InMemoryOrderRepository } from './infrastructure/repositories/in-memory-order.repository';

// Aplicación - Caso de usos
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { AddItemToOrderUseCase } from './application/use-cases/add-item-to-order.use-case';

// 1. Infraestructura
const productRepo = new InMemoryProductRepository();
const orderRepo = new InMemoryOrderRepository();

// 2. Casos de uso
const createOrder = new CreateOrderUseCase(orderRepo);
const addItem = new AddItemToOrderUseCase(orderRepo, productRepo);

// 3. Crea productos de prueba
const laptopId = ProductId.create('prod-1').getValue();
const laptopPrice = Price.create(999.99, 'USD').getValue();
const laptop = Product.create(laptopId, 'Laptop', laptopPrice, 10).getValue();
productRepo.save(laptop);

const mouseId = ProductId.create('prod-2').getValue();
const mousePrice = Price.create(29.99, 'USD').getValue();
const mouse = Product.create(mouseId, 'Mouse', mousePrice, 50).getValue();
productRepo.save(mouse);

// 4. Crea una orden
const orderResult = createOrder.execute({
    orderId: 'order-1',
    userId: 'user-1'
});

if (orderResult.isFailure()) {
    console.error('Error creando orden:', orderResult.getError());
    process.exit(1);
}

console.log('Orden creada:', orderResult.getValue().getId().getValue());

// 5. Agrega items
const addLaptop = addItem.execute({
    orderId: 'order-1',
    productId: 'prod-1',
    quantity: 2
});

if ( addLaptop.isFailure() ) {
    console.error('Error agregando laptop:', addLaptop.getError());
    process.exit(1);
}

console.log('Laptop agregada — stock restante:', laptop.getStock());

const addMouse = addItem.execute({
    orderId: 'order-1',
    productId: 'prod-2',
    quantity: 1
});

console.log('Mouse agregado — stock restante:', mouse.getStock());

// 6. Muestra el total
const order = orderResult.getValue();
console.log('💰 Total:', order.getTotal().toString());
console.log('📦 Líneas:', order.getLines().length);
console.log('🔖 Status:', order.getStatus());

// 7. Confirma la orden
const confirmResult = order.confirm();
console.log('Orden confirmada:', order.getStatus());

// 8. Intenta confirmar de nuevo — debe fallar
const confirmAgain = order.confirm();
console.log('Confirmar de nuevo:', confirmAgain.getError());
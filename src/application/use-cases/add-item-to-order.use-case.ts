/*
AddItemToOrderUseCase:
- Recibe: orderId, productId, quantity
- Busca la Order en el repositorio
- Busca el Product en el repositorio
- Llama order.addLine(product, quantity)
- Guarda la Order actualizada
- Retorna Result<Order>
*/

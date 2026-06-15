// Order
import { Order } from "./order";
import { OrderId } from "./order-id";

// User
import { UserId } from "../user/user-id";

export interface IOrderRepository {
    findById ( id: OrderId ): Order | null;
    findByUserId ( userId: UserId ): Order[];
    save ( order: Order ): void;
    delete ( id: OrderId ): void;
}
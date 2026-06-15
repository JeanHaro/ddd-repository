# ddd-ecommerce

A complete Domain-Driven Design (DDD) implementation in TypeScript, built as a learning project to understand how to apply DDD architecture in real projects.

> This is a learning project — the infrastructure uses in-memory repositories. For production, replace them with Prisma/TypeORM implementations.

```typescript
// Domain is pure — no framework dependencies
const order = Order.create(orderId, userId).getValue();
order.addLine(laptop, 2);
order.confirm();
console.log(order.getTotal().toString()); // '2029.97 USD'
```

---

## 🎯 Purpose

This project demonstrates how to apply DDD correctly in TypeScript:

- **Domain first** — business rules live in the domain, not in controllers or services
- **No framework dependencies** in the domain layer
- **Result<T, E>** for domain errors without exceptions
- **Value Objects** for type safety and immutability
- **Aggregate Roots** to protect business invariants
- **Repository pattern** to decouple domain from infrastructure

---

## 🏗️ Architecture — 4 Layers

```
src/
├── shared/                    ← Base classes used everywhere
│   ├── result.ts              ← Result<T, E> — domain errors without exceptions
│   ├── value-object.ts        ← ValueObject<T> base class
│   └── entity.ts              ← Entity<TId> base class
│
├── domain/                    ← Business rules — pure TypeScript, no dependencies
│   ├── product/
│   │   ├── product-id.ts      ← Value Object
│   │   ├── price.ts           ← Value Object
│   │   ├── product.ts         ← Entity
│   │   └── product.repository.ts ← Interface (contract)
│   ├── user/
│   │   ├── user-id.ts         ← Value Object
│   │   ├── email.ts           ← Value Object
│   │   └── user.ts            ← Entity
│   └── order/
│       ├── order-id.ts        ← Value Object
│       ├── order-line.ts      ← Part of Aggregate
│       ├── order.ts           ← Aggregate Root
│       └── order.repository.ts ← Interface (contract)
│
├── application/               ← Use cases — orchestrate domain, no business logic
│   └── use-cases/
│       ├── create-order.use-case.ts
│       └── add-item-to-order.use-case.ts
│
├── infrastructure/            ← External concerns — repositories, DB, APIs
│   └── repositories/
│       ├── in-memory-product.repository.ts
│       └── in-memory-order.repository.ts
│
└── index.ts                   ← Bootstrap and demo
```

---

## 🧩 Building Blocks

### `Result<T, E>` — No exceptions for domain errors

```typescript
// Instead of throwing:
throw new Error('Stock insuficiente');

// Use Result:
return Result.fail('Stock insuficiente');

// The caller handles it explicitly:
const result = order.addLine(product, qty);
if (result.isFailure()) {
    console.log(result.getError()); // 'Stock insuficiente'
}
```

### Value Objects — Immutable, identity by value

```typescript
// Email validates and normalizes on creation
const emailResult = Email.create('JEAN@GMAIL.COM');
const email = emailResult.getValue();
email.getValue();           // → 'jean@gmail.com' (normalized)

// Two emails with same value are equal
email.equals(Email.create('jean@gmail.com').getValue()); // → true

// Type safety — IDs can't be mixed
findOrder(userId);    // ← TypeScript Error: UserId is not OrderId ✅
```

### Entities — Identity by ID

```typescript
const user = User.create(userId, 'Jean', email).getValue();
user.changeName('Jean Haro'); // → Result<void>
user.changeEmail(newEmail);   // → void (Email already validated)

// Same ID = same entity, even if values differ
user1.equals(user2) // → compares IDs, not values
```

### Aggregate Root — Protects invariants

```typescript
const order = Order.create(orderId, userId).getValue();

// addLine validates stock, creates OrderLine, removes stock atomically
order.addLine(laptop, 2);    // → Result<void>
order.addLine(mouse, 1);     // → Result<void>

order.confirm();              // → Result<void>
order.confirm();              // → Result.fail('Solo se puede confirmar una orden pendiente')

order.cancel();               // → Result.fail('Solo se puede cancelar una orden pendiente')
```

### Repository Pattern — Decouple domain from persistence

```typescript
// Domain defines the contract:
interface IOrderRepository {
    findById(id: OrderId): Order | null;
    findByUserId(userId: UserId): Order[];
    save(order: Order): void;
    delete(id: OrderId): void;
}

// Infrastructure implements it:
class InMemoryOrderRepository implements IOrderRepository { ... }
class PrismaOrderRepository implements IOrderRepository { ... } // production
```

---

## 🚀 Usage

```typescript
// 1. Setup infrastructure
const productRepo = new InMemoryProductRepository();
const orderRepo = new InMemoryOrderRepository();

// 2. Setup use cases with dependency injection
const createOrder = new CreateOrderUseCase(orderRepo);
const addItem = new AddItemToOrderUseCase(orderRepo, productRepo);

// 3. Create products
const price = Price.create(999.99, 'USD').getValue();
const laptop = Product.create(
    ProductId.create('prod-1').getValue(),
    'Laptop', price, 10
).getValue();
productRepo.save(laptop);

// 4. Create an order
const orderResult = createOrder.execute({
    orderId: 'order-1',
    userId: 'user-1'
});

// 5. Add items
addItem.execute({ orderId: 'order-1', productId: 'prod-1', quantity: 2 });

// 6. Confirm
const order = orderResult.getValue();
order.confirm();
console.log(order.getTotal().toString()); // '1999.98 USD'
console.log(order.getStatus());           // 'confirmed'
```

---

## 🏭 Production Setup

In production, replace in-memory repositories with real implementations:

```typescript
// Infrastructure — Prisma implementation
class PrismaOrderRepository implements IOrderRepository {
    async findById(id: OrderId): Promise<Order | null> {
        const data = await prisma.order.findUnique({
            where: { id: id.getValue() },
            include: { lines: true }
        });
        if (!data) return null;
        // Map from DB model to Domain entity
        return Order.reconstitute(data);
    }

    async save(order: Order): Promise<void> {
        await prisma.order.upsert({
            where: { id: order.getId().getValue() },
            // Map from Domain entity to DB model
            create: this.toPersistence(order),
            update: this.toPersistence(order),
        });
    }
}

// Presentation — NestJS Controller
@Controller('/orders')
class OrderController {
    constructor(
        private createOrder: CreateOrderUseCase,
        private addItem: AddItemToOrderUseCase,
    ) {}

    @Post('/')
    create(@Body() dto: CreateOrderDTO) {
        const result = this.createOrder.execute(dto);
        if (result.isFailure()) throw new BadRequestException(result.getError());
        return result.getValue();
    }
}
```

---

## 🗺️ Full Stack Architecture

```
Frontend (Angular/React)
  ↓ HTTP requests
NestJS Controllers      ← Presentation layer
  ↓ calls
Use Cases               ← Application layer
  ↓ uses domain
Entities, Value Objects ← Domain layer (this project)
  ↓ persists via
Prisma/TypeORM          ← Infrastructure layer
  ↓ connects to
PostgreSQL / MySQL
```

The domain code in this project goes directly into production — only the infrastructure layer changes.

---

## 📋 Domain Rules

### Product
- Name cannot be empty
- Stock cannot be negative
- `removeStock()` fails if insufficient stock

### Order
- Starts as `pending` with no lines
- `addLine()` reserves stock atomically
- `confirm()` only from `pending` → `confirmed`
- `cancel()` only from `pending` → `cancelled`, returns stock
- `getTotal()` sums all line subtotals

### OrderLine
- Quantity must be greater than 0
- Product must have sufficient stock
- Captures price at time of adding — price changes don't affect existing lines

### Email
- Cannot be empty
- Must contain `@`
- Normalized to lowercase on creation

---

## 📄 License

MIT
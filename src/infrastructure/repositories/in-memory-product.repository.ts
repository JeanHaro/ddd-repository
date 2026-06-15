// Domain - Product
import { Product } from "../../domain/product/product";
import { ProductId } from "../../domain/product/product-id";
import { IProductRepository } from "../../domain/product/product.repository";

export class InMemoryProductRepository implements IProductRepository {
    private products: Map<string, Product> = new Map();

    findById ( id: ProductId ): Product | null {
        return this.products.get(id.getValue()) ?? null;
    }

    findAll(): Product[] {
        return Array.from(this.products.values());
    }

    save ( product: Product ): void {
        this.products.set(product.getId().getValue(), product);
    }

    delete ( id: ProductId ): void {
        this.products.delete(id.getValue());
    }
}
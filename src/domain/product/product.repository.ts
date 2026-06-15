// Product
import { Product } from "./product";
import { ProductId } from "./product-id";

export interface IProductRepository {
    findById ( id: ProductId ): Product | null;
    findAll (): Product[];
    save ( product: Product ): void;
    delete ( id: ProductId ): void; 
}
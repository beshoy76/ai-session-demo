import { Component, signal, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product.service';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryName: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  private productService = inject(ProductService);

  protected readonly products = toSignal(this.productService.getProducts(), { initialValue: [] as Product[] });

  // Filters State
  protected readonly searchQuery = signal<string>('');
  protected readonly selectedCategory = signal<string>('All');
  protected readonly sortBy = signal<string>('featured');

  // Categories derived from loaded products
  protected readonly categories = computed(() => {
    const list = new Set(this.products().map(p => p.categoryName));
    return ['All', ...Array.from(list)];
  });

  // Filtered & Sorted Products
  protected readonly filteredProducts = computed(() => {
    let result = [...this.products()];

    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.categoryName.toLowerCase().includes(query)
      );
    }

    const category = this.selectedCategory();
    if (category !== 'All') {
      result = result.filter(p => p.categoryName === category);
    }

    const sortOption = this.sortBy();
    if (sortOption === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  });

  // Shopping Cart State
  protected readonly cart = signal<CartItem[]>([]);
  protected readonly isCartOpen = signal<boolean>(false);

  protected readonly cartCount = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  protected readonly cartTotal = computed(() =>
    this.cart().reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  );

  protected readonly selectedProduct = signal<Product | null>(null);

  protected onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  protected selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  protected onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortBy.set(select.value);
  }

  protected addToCart(product: Product, event?: Event): void {
    if (event) event.stopPropagation();

    const currentCart = [...this.cart()];
    const existingIndex = currentCart.findIndex(item => item.product.id === product.id);

    if (existingIndex > -1) {
      currentCart[existingIndex] = {
        ...currentCart[existingIndex],
        quantity: currentCart[existingIndex].quantity + 1
      };
    } else {
      currentCart.push({ product, quantity: 1 });
    }

    this.cart.set(currentCart);
  }

  protected removeFromCart(productId: string): void {
    this.cart.set(this.cart().filter(item => item.product.id !== productId));
  }

  protected updateQuantity(productId: string, delta: number): void {
    const currentCart = [...this.cart()];
    const index = currentCart.findIndex(item => item.product.id === productId);
    if (index > -1) {
      const newQty = currentCart[index].quantity + delta;
      if (newQty <= 0) {
        currentCart.splice(index, 1);
      } else {
        currentCart[index] = { ...currentCart[index], quantity: newQty };
      }
      this.cart.set(currentCart);
    }
  }

  protected clearCart(): void {
    this.cart.set([]);
  }

  protected toggleCart(isOpen: boolean): void {
    this.isCartOpen.set(isOpen);
  }

  protected openProductDetails(product: Product): void {
    this.selectedProduct.set(product);
  }

  protected closeProductDetails(): void {
    this.selectedProduct.set(null);
  }
}

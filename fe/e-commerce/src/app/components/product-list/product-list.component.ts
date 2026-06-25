// (6) ProductListComponent — cart state delegated to CartService; Router navigates to /checkout
import { Component, signal, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

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
  private cartService = inject(CartService);
  private router = inject(Router);

  private productsLoaded = signal(false);

  protected readonly products = toSignal(
    this.productService.getProducts().pipe(tap(() => this.productsLoaded.set(true))),
    { initialValue: [] as Product[] }
  );

  protected readonly isLoading = computed(() => !this.productsLoaded());
  protected readonly activeNav = signal<string>('home');
  protected readonly skeletonItems = [1, 2, 3, 4, 5, 6];

  // Filters
  protected readonly searchQuery = signal<string>('');
  protected readonly selectedCategory = signal<string>('All');
  protected readonly sortBy = signal<string>('featured');

  protected readonly categories = computed(() => {
    const list = new Set(this.products().map(p => p.categoryName));
    return ['All', ...Array.from(list)];
  });

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

    if (this.sortBy() === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (this.sortBy() === 'price-high') result.sort((a, b) => b.price - a.price);

    return result;
  });

  // Cart — signals come from CartService so CheckoutComponent reads the same state
  protected readonly cart = this.cartService.cart;
  protected readonly isCartOpen = this.cartService.isCartOpen;
  protected readonly cartCount = this.cartService.cartCount;
  protected readonly cartTotal = this.cartService.cartTotal;

  protected readonly selectedProduct = signal<Product | null>(null);

  protected setActiveNav(nav: string): void {
    this.activeNav.set(nav);
    if (nav === 'products') {
      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  protected onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected selectCategory(category: string): void {
    this.selectedCategory.set(category);
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  protected onSortChange(event: Event): void {
    this.sortBy.set((event.target as HTMLSelectElement).value);
  }

  protected addToCart(product: Product, event?: Event): void {
    if (event) event.stopPropagation();
    this.cartService.addToCart(product);
  }

  protected removeFromCart(productId: string): void { this.cartService.removeFromCart(productId); }
  protected updateQuantity(productId: string, delta: number): void { this.cartService.updateQuantity(productId, delta); }
  protected clearCart(): void { this.cartService.clearCart(); }
  protected toggleCart(open: boolean): void { this.cartService.toggleCart(open); }

  protected goToCheckout(): void {
    this.cartService.toggleCart(false);
    this.router.navigate(['/checkout']);
  }

  protected openProductDetails(product: Product): void { this.selectedProduct.set(product); }
  protected closeProductDetails(): void { this.selectedProduct.set(null); }
}

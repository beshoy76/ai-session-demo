import { Component, signal, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';
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

  // Cart
  protected readonly cart = signal<CartItem[]>([]);
  protected readonly isCartOpen = signal<boolean>(false);
  protected readonly selectedProduct = signal<Product | null>(null);

  protected readonly cartCount = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  protected readonly cartTotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

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
    const currentCart = [...this.cart()];
    const idx = currentCart.findIndex(i => i.product.id === product.id);
    if (idx > -1) {
      currentCart[idx] = { ...currentCart[idx], quantity: currentCart[idx].quantity + 1 };
    } else {
      currentCart.push({ product, quantity: 1 });
    }
    this.cart.set(currentCart);
  }

  protected removeFromCart(productId: string): void {
    this.cart.set(this.cart().filter(i => i.product.id !== productId));
  }

  protected updateQuantity(productId: string, delta: number): void {
    const currentCart = [...this.cart()];
    const idx = currentCart.findIndex(i => i.product.id === productId);
    if (idx > -1) {
      const newQty = currentCart[idx].quantity + delta;
      if (newQty <= 0) currentCart.splice(idx, 1);
      else currentCart[idx] = { ...currentCart[idx], quantity: newQty };
      this.cart.set(currentCart);
    }
  }

  protected clearCart(): void { this.cart.set([]); }
  protected toggleCart(open: boolean): void { this.isCartOpen.set(open); }
  protected openProductDetails(product: Product): void { this.selectedProduct.set(product); }
  protected closeProductDetails(): void { this.selectedProduct.set(null); }

  // ── Checkout ──────────────────────────────────────────────────────────────
  protected readonly isCheckoutOpen = signal(false);
  protected readonly orderPlaced = signal(false);

  protected readonly checkoutForm = signal({
    email: '', phone: '',
    firstName: '', lastName: '',
    address: '', city: '', state: '', zip: '',
    shippingMethod: 'standard',
    cardNumber: '', cardExpiry: '', cardCvv: '', cardName: ''
  });

  protected readonly shippingCost = computed(() => {
    if (this.checkoutForm().shippingMethod === 'express') return 14.99;
    return this.cartTotal() >= 50 ? 0 : 5.99;
  });

  protected readonly taxAmount = computed(() =>
    Math.round(this.cartTotal() * 0.08 * 100) / 100
  );

  protected readonly orderTotal = computed(() =>
    this.cartTotal() + this.shippingCost() + this.taxAmount()
  );

  protected updateCheckoutField(field: string, value: string): void {
    this.checkoutForm.update(f => ({ ...f, [field]: value }));
  }

  protected openCheckout(): void {
    this.isCartOpen.set(false);
    this.orderPlaced.set(false);
    this.isCheckoutOpen.set(true);
  }

  protected closeCheckout(): void {
    this.isCheckoutOpen.set(false);
    this.orderPlaced.set(false);
  }

  protected placeOrder(): void {
    this.orderPlaced.set(true);
    this.cart.set([]);
  }

  protected readonly orderId = signal(this.newOrderId());

  private newOrderId(): string {
    return 'AURA-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  protected deliveryDate(): string {
    const days = this.checkoutForm().shippingMethod === 'express' ? 2 : 6;
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }
}

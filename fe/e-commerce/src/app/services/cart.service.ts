// Shared cart state — extracted so both ProductListComponent and CheckoutComponent can read it
import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../components/product-list/product-list.component';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly cart = signal<CartItem[]>([]);
  readonly isCartOpen = signal<boolean>(false);

  readonly cartCount = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly cartTotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  addToCart(product: Product): void {
    const current = [...this.cart()];
    const idx = current.findIndex(i => i.product.id === product.id);
    if (idx > -1) {
      current[idx] = { ...current[idx], quantity: current[idx].quantity + 1 };
    } else {
      current.push({ product, quantity: 1 });
    }
    this.cart.set(current);
  }

  removeFromCart(productId: string): void {
    this.cart.set(this.cart().filter(i => i.product.id !== productId));
  }

  updateQuantity(productId: string, delta: number): void {
    const current = [...this.cart()];
    const idx = current.findIndex(i => i.product.id === productId);
    if (idx === -1) return;
    const newQty = current[idx].quantity + delta;
    if (newQty <= 0) current.splice(idx, 1);
    else current[idx] = { ...current[idx], quantity: newQty };
    this.cart.set(current);
  }

  clearCart(): void { this.cart.set([]); }
  toggleCart(open: boolean): void { this.isCartOpen.set(open); }
}

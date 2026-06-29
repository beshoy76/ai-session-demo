import { Component, input, output, signal, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../product-list/product-list.component';
import { OrderService } from '../../services/order.service';

type CheckoutStep = 'info' | 'review' | 'confirmation';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  cart = input.required<CartItem[]>();
  cartTotal = input.required<number>();
  closed = output<void>();
  orderCompleted = output<void>();

  private orderService = inject(OrderService);

  protected step = signal<CheckoutStep>('info');
  protected isSubmitting = signal(false);
  protected orderNumber = signal('');

  protected form = signal({
    customerName: '',
    customerEmail: '',
    phone: '',
    shippingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  protected shipping = computed(() => this.cartTotal() >= 50 ? 0 : 9.99);
  protected orderTotal = computed(() => this.cartTotal() + this.shipping());

  protected updateField(field: keyof ReturnType<typeof this.form>, value: string): void {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  protected goToReview(): void {
    const f = this.form();
    if (!f.customerName || !f.customerEmail || !f.shippingAddress || !f.city || !f.zipCode || !f.country) {
      return;
    }
    this.step.set('review');
  }

  protected placeOrder(): void {
    this.isSubmitting.set(true);
    const f = this.form();

    const payload = {
      ...f,
      items: this.cart().map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(payload).subscribe({
      next: (res) => {
        this.orderNumber.set(res.orderNumber);
        this.step.set('confirmation');
        this.isSubmitting.set(false);
        this.orderCompleted.emit();
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  protected close(): void {
    this.closed.emit();
  }
}

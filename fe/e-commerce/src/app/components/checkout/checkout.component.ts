// (6) CheckoutComponent — reactive form with server-side error mapping and in-flight guard
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  protected readonly cart = this.cartService.cart;
  protected readonly cartTotal = this.cartService.cartTotal;

  protected readonly isSubmitting = signal(false);
  protected readonly successOrderId = signal<string | null>(null);
  protected readonly serverError = signal<string | null>(null);

  protected readonly form = this.fb.group({
    fullName: ['', [Validators.required]],
    address:  ['', [Validators.required]],
    city:     ['', [Validators.required]],
    phone:    ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-(). ]{7,20}$/)]]
  });

  private readonly labels: Record<string, string> = {
    fullName: 'Full name',
    address: 'Address',
    city: 'City',
    phone: 'Phone'
  };

  protected fieldError(key: string): string | null {
    const ctrl = this.form.get(key);
    if (!ctrl || ctrl.valid || !(ctrl.dirty || ctrl.touched)) return null;
    if (ctrl.errors?.['required']) return `${this.labels[key]} is required`;
    if (ctrl.errors?.['pattern']) return `Invalid ${this.labels[key].toLowerCase()} format`;
    if (ctrl.errors?.['server']) return ctrl.errors['server'];
    return null;
  }

  protected goBack(): void {
    this.router.navigate(['/']);
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.cart().length === 0) return;

    this.isSubmitting.set(true);
    this.serverError.set(null);

    const { fullName, address, city, phone } = this.form.value;

    this.orderService.checkout({
      fullName: fullName!,
      address:  address!,
      city:     city!,
      phone:    phone!,
      items: this.cart().map(i => ({ productId: i.product.id, quantity: i.quantity }))
    }).subscribe({
      next: order => {
        this.isSubmitting.set(false);
        this.successOrderId.set(order.id);
        this.cartService.clearCart();
      },
      error: err => {
        this.isSubmitting.set(false);
        if (err.status === 400) {
          const body = err.error;
          if (body?.errors) {
            Object.entries(body.errors as Record<string, string[]>).forEach(([key, msgs]) => {
              const controlKey = key.charAt(0).toLowerCase() + key.slice(1);
              this.form.get(controlKey)?.setErrors({ server: msgs[0] });
            });
          } else {
            this.serverError.set(body?.message ?? 'Validation failed.');
          }
        } else {
          this.serverError.set('An unexpected error occurred. Please try again.');
        }
      }
    });
  }
}

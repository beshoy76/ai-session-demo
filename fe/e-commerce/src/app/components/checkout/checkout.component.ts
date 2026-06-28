// Checkout page — reactive form for shipping/payment, posts to OrderService
import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { OrderService } from '../../services/order.service';
import { CartItem } from '../product-list/product-list.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule, CurrencyPipe,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatRadioModule, MatCardModule, MatProgressSpinnerModule,
    MatIconModule, MatDividerModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private orderService = inject(OrderService);

  protected cartItems: CartItem[] = [];
  protected cartTotal = 0;
  protected isSubmitting = signal(false);
  protected orderId = signal<string | null>(null);
  protected errorMessage = signal<string | null>(null);

  protected form!: FormGroup;

  ngOnInit(): void {
    // Cart is passed via router navigation state from ProductListComponent
    const state = history.state as { cart?: CartItem[]; total?: number };
    this.cartItems = state?.cart ?? [];
    this.cartTotal = state?.total ?? 0;

    if (this.cartItems.length === 0) {
      this.router.navigate(['/']);
      return;
    }

    this.form = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      shippingStreet: ['', Validators.required],
      shippingCity: ['', Validators.required],
      shippingState: ['', Validators.required],
      shippingCountry: ['', Validators.required],
      shippingZipCode: ['', [Validators.required, Validators.pattern(/^\d{4,10}$/)]],
      paymentMethod: ['cod', Validators.required],
      cardHolder: [''],
      cardNumber: [''],
      cardExpiry: [''],
      cardCvv: [''],
    });

    // Add/remove card validators whenever the payment method radio changes
    this.form.get('paymentMethod')!.valueChanges.subscribe((method: string) => {
      const cardValidators: Record<string, Parameters<typeof Validators.compose>[0]> = {
        cardHolder: [Validators.required],
        cardNumber: [Validators.required, Validators.pattern(/^\d{16}$/)],
        cardExpiry: [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)],
        cardCvv: [Validators.required, Validators.pattern(/^\d{3,4}$/)],
      };

      Object.keys(cardValidators).forEach(field => {
        const control = this.form.get(field)!;
        if (method === 'card') {
          control.setValidators(cardValidators[field] as any);
        } else {
          control.clearValidators();
          control.setValue('');
        }
        control.updateValueAndValidity();
      });
    });
  }

  protected get isCard(): boolean {
    return this.form?.get('paymentMethod')?.value === 'card';
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.getRawValue();
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.orderService.checkout({
      customerName: val.customerName,
      customerEmail: val.customerEmail,
      shippingStreet: val.shippingStreet,
      shippingCity: val.shippingCity,
      shippingState: val.shippingState,
      shippingCountry: val.shippingCountry,
      shippingZipCode: val.shippingZipCode,
      items: this.cartItems.map(i => ({ productId: i.product.id, quantity: i.quantity })),
    }).subscribe({
      next: order => {
        this.isSubmitting.set(false);
        this.orderId.set(order.id);
      },
      error: err => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.error ?? 'Something went wrong. Please try again.');
      },
    });
  }

  protected backToShop(): void {
    this.router.navigate(['/']);
  }
}

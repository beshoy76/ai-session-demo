// Service responsible for all order-related HTTP calls
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartItemDto {
  productId: string;
  quantity: number;
}

export interface CheckoutRequest {
  customerName: string;
  customerEmail: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  shippingZipCode: string;
  items: CartItemDto[];
}

export interface OrderResponse {
  id: string;
  status: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5254/api/orders';

  // POST /api/orders/checkout — sends cart + shipping, returns created order
  checkout(request: CheckoutRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}/checkout`, request);
  }
}

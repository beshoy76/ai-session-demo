// (5) Angular OrderService — calls POST api/orders/checkout
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CheckoutRequest {
  fullName: string;
  address: string;
  city: string;
  phone: string;
  items: { productId: string; quantity: number }[];
}

export interface CheckoutResponse {
  id: string;
  fullName: string;
  address: string;
  city: string;
  phone: string;
  status: string;
  total: number;
  createdAt: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5254/api/orders';

  checkout(request: CheckoutRequest): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.apiUrl}/checkout`, request);
  }
}

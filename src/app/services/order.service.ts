import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  cardId: string;
  quantity: number;
  card: {
    name: string;
    image: string;
    price: number;
    beltRank: string;
    achievement: string;
    clubName: string;
  };
}

export interface Order {
  _id?: string;
  user: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${environment.apiUrl}/orders`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true, // Ensures cookies are sent with cross-site requests
  };

  constructor(private http: HttpClient) {}

  // Create a new order
  createOrder(orderData: {
    items: { cardId: string; quantity: number }[],
    shippingAddress: any,
    totalAmount: number,
    paymentDetails: { paymentIntentId: string }
  }): Observable<Order> {
    return this.http
      .post<Order>(`${this.baseUrl}`, orderData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Fetch an order by ID
  getOrderById(orderId: string): Observable<Order> {
    return this.http
      .get<Order>(`${this.baseUrl}/${orderId}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Update an order (e.g., status updates)
  updateOrder(orderId: string, updateData: Partial<Order>): Observable<Order> {
    return this.http
      .patch<Order>(`${this.baseUrl}/${orderId}`, updateData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Delete an order
  deleteOrder(orderId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${orderId}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Generic error handler for HTTP calls
  private handleError(error: any) {
    console.error('Error in OrderService:', error);
    return throwError(() => new Error(error?.error?.message || 'Something went wrong'));
  }
}

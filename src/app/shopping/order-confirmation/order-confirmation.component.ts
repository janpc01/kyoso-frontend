import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService, Order } from '../../services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css'],
})
export class OrderConfirmationComponent implements OnInit {
  orderId: string | null = null;
  order: Order | null = null;
  isLoading = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Retrieve orderId from query parameters
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
      if (this.orderId) {
        this.fetchOrderDetails(this.orderId);
      } else {
        this.errorMessage = 'Order ID not found. Please check your order details.';
        this.isLoading = false;
      }
    });
  }

  fetchOrderDetails(orderId: string): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching order:', error);
        this.errorMessage = 'Failed to load order details. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}

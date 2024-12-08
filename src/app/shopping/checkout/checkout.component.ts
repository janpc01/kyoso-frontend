import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { PaymentService } from '../../services/payment.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { Stripe, StripeElements } from '@stripe/stripe-js';
import { async, firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: CartItem[] = [];
  total: number = 0;

  stripe!: Stripe | null;
  elements!: StripeElements;
  showPaymentElement = false;
  isProcessing = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize form
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      addressLine1: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
    });

    // Fetch cart items and total
    this.cartService.getCart().subscribe((items) => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  async proceedToPayment() {
    if (this.checkoutForm.invalid) return;

    try {
      // Load Stripe
      this.stripe = await this.paymentService.getStripe();
      if (!this.stripe) {
        console.error('Stripe failed to load.');
        return;
      }

      // Generate payment intent
      const response = await firstValueFrom(
        this.paymentService.createPaymentIntent(
          this.total,
          this.checkoutForm.get('email')?.value
        )
      );

      // Set showPaymentElement to true to render the DOM element
      this.showPaymentElement = true;

      // Ensure the DOM is updated before calling mount()
      setTimeout(() => {
        this.elements = this.stripe!.elements({ clientSecret: response.clientSecret });
        const paymentElement = this.elements.create('payment');
        paymentElement.mount('#payment-element');
      });
    } catch (error) {
      console.error('Error initializing payment:', error);
      alert('Failed to initialize payment. Please try again.');
    }
  }


  async submitPayment(event: Event) {
    event.preventDefault();
    if (!this.stripe || !this.elements) return;

    this.isProcessing = true;

    const { error } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: window.location.origin + '/checkout',
        receipt_email: this.checkoutForm.get('email')?.value,
      },
    });

    if (error) {
      alert(error.message);
      this.isProcessing = false;
    } else {
      this.completeOrder();
    }
  }

  private completeOrder() {
    const orderData = {
      items: this.cartItems,
      shipping: this.checkoutForm.value,
      totalAmount: this.total,
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.router.navigate(['/order-confirmation']);
      },
      error: () => alert('Error processing order. Please try again.'),
    });
  }
}

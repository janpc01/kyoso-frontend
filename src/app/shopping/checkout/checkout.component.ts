import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { PaymentService } from '../../services/payment.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { Stripe, StripeElements } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
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
    // Initialize the form with validators
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

      // Generate a payment intent
      const response = await firstValueFrom(
        this.paymentService.createPaymentIntent(
          this.total,
          this.checkoutForm.get('email')?.value
        )
      );

      // Render Stripe payment element
      this.showPaymentElement = true;

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

    try {
      const { error, paymentIntent } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: window.location.origin + '/checkout',
          receipt_email: this.checkoutForm.get('email')?.value,
        },
        redirect: "if_required", // Prevents automatic redirection
      });

      if (error) {
        alert(error.message);
        console.error('Payment error:', error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        await this.completeOrder(paymentIntent.id);
      }
    } catch (err) {
      console.error('Error during payment:', err);
      alert('Payment failed. Please try again.');
    } finally {
      this.isProcessing = false;
    }
  }

  private async completeOrder(paymentIntentId: string) {
    try {
      const orderData = {
        items: this.cartItems.map(item => ({
          cardId: item.cardId,
          quantity: item.quantity
        })),
        shippingAddress: this.checkoutForm.value, // Matches backend's `shippingAddress` key
        totalAmount: this.total,
        paymentDetails: { paymentIntentId }, // Matches backend's `paymentDetails` key
      };
  
      // Send order data to backend and retrieve the orderId
      const order = await firstValueFrom(this.orderService.createOrder(orderData));
  
      // Clear the cart and navigate to order confirmation
      this.cartService.clearCart();
      this.router.navigate(['/order-confirmation'], { queryParams: { orderId: order._id } });
    } catch (error) {
      console.error('Error completing order:', error);
      alert('There was an issue processing your order. Please try again.');
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  cardId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'shopping_cart';
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    this.loadCart();
  }

  // Load cart data from localStorage
  private loadCart(): void {
    const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
    this.cartItems = savedCart ? JSON.parse(savedCart) : [];
    this.cartSubject.next(this.cartItems);
  }

  // Save cart data to localStorage
  private saveCart(): void {
    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(this.cartItems));
    this.cartSubject.next(this.cartItems);
  }

  // Get the entire cart as an observable
  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  // Get the total price of all items in the cart
  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // Add an item to the cart
  addToCart(card: any): void {
    const existingItem = this.cartItems.find((item) => item.cardId === card.cardId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({ ...card, quantity: 1 });
    }
    this.saveCart();
  }

  // Update the quantity of a specific item in the cart
  updateQuantity(cardId: string, quantity: number): void {
    const item = this.cartItems.find((item) => item.cardId === cardId);
    if (item && quantity > 0) {
      item.quantity = quantity;
      this.saveCart();
    }
  }

  // Remove an item from the cart by its ID
  removeFromCart(cardId: string): void {
    this.cartItems = this.cartItems.filter((item) => item.cardId !== cardId);
    this.saveCart();
  }

  // Clear all items from the cart
  clearCart(): void {
    this.cartItems = [];
    this.saveCart();
  }

  // Get the number of unique items in the cart
  getItemCount(): number {
    return this.cartItems.length;
  }

  // Get the total quantity of all items in the cart
  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Check if a specific item exists in the cart
  itemExists(cardId: string): boolean {
    return this.cartItems.some((item) => item.cardId === cardId);
  }

  // Get a specific item from the cart by its ID
  getCartItem(cardId: string): CartItem | undefined {
    return this.cartItems.find((item) => item.cardId === cardId);
  }

  // Replace the entire cart with a new set of items
  setCart(newCartItems: CartItem[]): void {
    this.cartItems = newCartItems;
    this.saveCart();
  }
}

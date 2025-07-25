'use server'

// This file is kept for API compatibility
// Cart is now managed entirely client-side in CartContext.tsx

import { CartItem, ToppingItem } from '@/types'

// These functions are now stubs that don't do anything on the server
// The real implementation is in the CartContext.tsx file

export async function getCartItems(): Promise<CartItem[]> {
  // Client will use localStorage instead
  return []
}

export async function addToCart(_item: CartItem): Promise<void> {
  // Client will handle this
}

export async function removeFromCart(
  _productId: string,
  _toppings?: ToppingItem[]
): Promise<void> {
  // Client will handle this
}

export async function updateQuantity(
  _productId: string,
  _quantity: number,
  _toppings?: ToppingItem[]
): Promise<void> {
  // Client will handle this
}

export async function clearCart(): Promise<void> {
  // Client will handle this
}

export async function getCartTotal(): Promise<number> {
  // Client will calculate this
  return 0
}

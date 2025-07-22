'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { CartItem } from '@/types'

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (
    id: string,
    toppings?: Array<{ name: string; price: number }>
  ) => void
  updateQuantity: (
    id: string,
    quantity: number,
    toppings?: Array<{ name: string; price: number }>
  ) => void
  clearCart: () => void
  cartTotal: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartTotal, setCartTotal] = useState(0)
  const [itemCount, setItemCount] = useState(0)

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))

    // Calculate cart total
    const total = cartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)
    setCartTotal(total)

    // Calculate item count
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    setItemCount(count)
  }, [cartItems])

  // Helper function to check if two arrays of toppings are the same
  const areToppingsSame = (
    toppings1?: Array<{ name: string; price: number }>,
    toppings2?: Array<{ name: string; price: number }>
  ) => {
    if (!toppings1 && !toppings2) return true
    if (!toppings1 || !toppings2) return false
    if (toppings1.length !== toppings2.length) return false

    // Sort both arrays by name to ensure consistent comparison
    const sorted1 = [...toppings1].sort((a, b) => a.name.localeCompare(b.name))
    const sorted2 = [...toppings2].sort((a, b) => a.name.localeCompare(b.name))

    return sorted1.every(
      (topping, index) =>
        topping.name === sorted2[index].name &&
        topping.price === sorted2[index].price
    )
  }

  // Add item to cart
  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart with same toppings
      const existingItemIndex = prevItems.findIndex(
        (cartItem) =>
          cartItem.id === item.id &&
          areToppingsSame(cartItem.toppings, item.toppings)
      )

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity
        return updatedItems
      } else {
        // Item doesn't exist, add new item
        return [...prevItems, item]
      }
    })
  }

  // Remove item from cart
  const removeFromCart = (
    id: string,
    toppings?: Array<{ name: string; price: number }>
  ) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.id === id && areToppingsSame(item.toppings, toppings))
      )
    )
  }

  // Update item quantity
  const updateQuantity = (
    id: string,
    quantity: number,
    toppings?: Array<{ name: string; price: number }>
  ) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === id && areToppingsSame(item.toppings, toppings)) {
          return { ...item, quantity }
        }
        return item
      })
    })
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

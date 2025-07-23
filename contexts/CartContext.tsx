'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { CartItem, ToppingItem } from '@/types'
import { getUserIdClient } from '@/lib/user-utils'

// Import the cart actions but don't use them directly in client components
// We'll use these in useEffect for data fetching
import * as cartActions from '@/lib/cart-actions'

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string, toppings?: ToppingItem[]) => void
  updateQuantity: (
    id: string,
    quantity: number,
    toppings?: ToppingItem[]
  ) => void
  clearCart: () => void
  cartTotal: number
  itemCount: number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartTotal, setCartTotal] = useState(0)
  const [itemCount, setItemCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Get the current request headers to pass to server actions
  const getHeaders = () => {
    return { cookie: document.cookie }
  }

  // Load cart from Supabase on initial load
  useEffect(() => {
    async function fetchCart() {
      try {
        // Call the server action to get cart items with headers
        const items = await cartActions.getCartItems(getHeaders())
        setCartItems(items)
      } catch (error) {
        console.error('Failed to fetch cart:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCart()
  }, [])

  // Calculate cart total and item count whenever cartItems changes
  useEffect(() => {
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
    toppings1?: ToppingItem[],
    toppings2?: ToppingItem[]
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
  const addToCart = async (item: CartItem) => {
    try {
      // Optimistically update local state
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

      // Call server action to update database with headers
      await cartActions.addToCart(item, getHeaders())
    } catch (error) {
      console.error('Failed to add item to cart:', error)
      // In case of error, refresh cart from server
      const items = await cartActions.getCartItems(getHeaders())
      setCartItems(items)
    }
  }

  // Remove item from cart
  const removeFromCart = async (id: string, toppings?: ToppingItem[]) => {
    try {
      // Optimistically update local state
      setCartItems((prevItems) =>
        prevItems.filter(
          (item) =>
            !(item.id === id && areToppingsSame(item.toppings, toppings))
        )
      )

      // Call server action to update database with headers
      await cartActions.removeFromCart(id, toppings as any, getHeaders())
    } catch (error) {
      console.error('Failed to remove item from cart:', error)
      // In case of error, refresh cart from server
      const items = await cartActions.getCartItems(getHeaders())
      setCartItems(items)
    }
  }

  // Update item quantity
  const updateQuantity = async (
    id: string,
    quantity: number,
    toppings?: ToppingItem[]
  ) => {
    try {
      // Optimistically update local state
      setCartItems((prevItems) => {
        if (quantity <= 0) {
          return prevItems.filter(
            (item) =>
              !(item.id === id && areToppingsSame(item.toppings, toppings))
          )
        }

        return prevItems.map((item) => {
          if (item.id === id && areToppingsSame(item.toppings, toppings)) {
            return { ...item, quantity }
          }
          return item
        })
      })

      // Call server action to update database with headers
      await cartActions.updateQuantity(
        id,
        quantity,
        toppings as any,
        getHeaders()
      )
    } catch (error) {
      console.error('Failed to update quantity:', error)
      // In case of error, refresh cart from server
      const items = await cartActions.getCartItems(getHeaders())
      setCartItems(items)
    }
  }

  // Clear cart
  const clearCart = async () => {
    try {
      // Optimistically update local state
      setCartItems([])

      // Call server action to update database with headers
      await cartActions.clearCart(getHeaders())
    } catch (error) {
      console.error('Failed to clear cart:', error)
      // In case of error, refresh cart from server
      const items = await cartActions.getCartItems(getHeaders())
      setCartItems(items)
    }
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
        isLoading,
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

'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { CartItem, ToppingItem } from '@/types'

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

  // Load cart from localStorage on initial load
  useEffect(() => {
    function loadCart() {
      try {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          setCartItems(JSON.parse(savedCart))
        }
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    }
  }, [cartItems, isLoading])

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
  const addToCart = (item: CartItem) => {
    // Check if item already exists in cart with same toppings
    const existingItemIndex = cartItems.findIndex(
      (cartItem) =>
        cartItem.id === item.id &&
        areToppingsSame(cartItem.toppings, item.toppings)
    )

    if (existingItemIndex >= 0) {
      // Item exists, update quantity
      const updatedItems = [...cartItems]
      updatedItems[existingItemIndex].quantity += item.quantity
      setCartItems(updatedItems)
    } else {
      // Item doesn't exist, add new item
      setCartItems([...cartItems, item])
    }
  }

  // Remove item from cart
  const removeFromCart = (id: string, toppings?: ToppingItem[]) => {
    setCartItems(
      cartItems.filter(
        (item) => !(item.id === id && areToppingsSame(item.toppings, toppings))
      )
    )
  }

  // Update item quantity
  const updateQuantity = (
    id: string,
    quantity: number,
    toppings?: ToppingItem[]
  ) => {
    if (quantity <= 0) {
      removeFromCart(id, toppings)
      return
    }

    setCartItems(
      cartItems.map((item) => {
        if (item.id === id && areToppingsSame(item.toppings, toppings)) {
          return { ...item, quantity }
        }
        return item
      })
    )
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

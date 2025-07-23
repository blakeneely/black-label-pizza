'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { Order, OrderStatus, CustomerInfo, CartItem } from '@/types'
import * as orderActions from '@/lib/order-actions'

interface OrderContextType {
  orders: Order[]
  addOrder: (
    items: CartItem[],
    customerInfo: CustomerInfo,
    total: number
  ) => Promise<{ success: boolean; orderId?: string }>
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>
  getOrderById: (orderId: string) => Promise<Order | null>
  isLoading: boolean
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get the current request headers to pass to server actions
  const getHeaders = () => {
    return { cookie: document.cookie }
  }

  // Load orders from Supabase on initial load
  useEffect(() => {
    async function fetchOrders() {
      try {
        const fetchedOrders = await orderActions.getOrders()
        setOrders(fetchedOrders)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Add a new order
  const addOrder = async (
    items: CartItem[],
    customerInfo: CustomerInfo,
    total: number
  ) => {
    try {
      const result = await orderActions.createOrder(
        items,
        customerInfo,
        total,
        getHeaders()
      )

      if (result.success && result.orderId) {
        // Fetch the new order to add to our state
        const newOrder = await orderActions.getOrderById(result.orderId)
        if (newOrder) {
          setOrders((prevOrders) => [newOrder, ...prevOrders])
        }
      }

      return result
    } catch (error) {
      console.error('Failed to add order:', error)
      return { success: false }
    }
  }

  // Update order status
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const success = await orderActions.updateOrderStatus(orderId, status)

      if (success) {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          )
        )
      }

      return success
    } catch (error) {
      console.error('Failed to update order status:', error)
      return false
    }
  }

  // Get order by ID
  const getOrderById = async (orderId: string) => {
    try {
      return await orderActions.getOrderById(orderId)
    } catch (error) {
      console.error('Failed to get order:', error)
      return null
    }
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrderById,
        isLoading,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider')
  }
  return context
}

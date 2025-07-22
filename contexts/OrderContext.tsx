'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { Order, OrderStatus } from '@/types'

interface OrderContextType {
  orders: Order[]
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  getOrderById: (orderId: string) => Order | undefined
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  // Load orders from localStorage on initial load
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders')
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders))
      } catch (error) {
        console.error('Failed to parse orders from localStorage:', error)
      }
    }
  }, [])

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders])

  // Add a new order
  const addOrder = (order: Order) => {
    setOrders((prevOrders) => [...prevOrders, order])
  }

  // Update order status
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    )
  }

  // Get order by ID
  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.id === orderId)
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrderById,
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

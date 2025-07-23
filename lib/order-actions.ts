'use server'

import { supabase } from './supabase'
import {
  Order,
  CustomerInfo,
  CartItem,
  OrderStatus,
  ToppingItem,
} from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { clearCart } from './cart-actions'

// Get user ID from headers or generate a new one
async function getUserId(
  headers?: Headers | Record<string, string>
): Promise<string> {
  const fallbackId = uuidv4()

  // If no headers provided, return a new ID
  if (!headers) {
    return fallbackId
  }

  try {
    // Handle Headers object
    if (headers instanceof Headers) {
      const cookieHeader = headers.get('cookie')
      if (!cookieHeader) {
        return fallbackId
      }

      // Parse cookies
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=')
        acc[key] = value
        return acc
      }, {} as Record<string, string>)

      return cookies['userId'] || fallbackId
    }
    // Handle plain object
    else if (typeof headers === 'object') {
      const cookieHeader = headers.cookie as string
      if (!cookieHeader) {
        return fallbackId
      }

      // Parse cookies
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=')
        acc[key] = value
        return acc
      }, {} as Record<string, string>)

      return cookies['userId'] || fallbackId
    }
  } catch (error) {
    console.error('Error parsing headers:', error)
  }

  return fallbackId
}

// Create a new order
export async function createOrder(
  items: CartItem[],
  customerInfo: CustomerInfo,
  total: number,
  headers?: Headers | Record<string, string>
): Promise<{ success: boolean; orderId?: string }> {
  const userId = await getUserId(headers)

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      customer_info: customerInfo,
      status: 'in_progress',
      total,
    })
    .select()
    .single()

  if (orderError || !order) {
    console.error('Error creating order:', orderError)
    return { success: false }
  }

  // Insert order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    price: item.price,
    quantity: item.quantity,
    size: item.size || null,
    toppings: item.toppings || null,
    removed_toppings: item.removedToppings || null,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    console.error('Error creating order items:', itemsError)
    // In a production app, we would roll back the order here
    return { success: false }
  }

  // Clear the cart
  await clearCart(headers)

  return { success: true, orderId: order.id }
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  // Get order details
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (orderError || !order) {
    console.error('Error fetching order:', orderError)
    return null
  }

  // Get order items
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId)

  if (itemsError) {
    console.error('Error fetching order items:', itemsError)
    return null
  }

  // Format order items
  const items: CartItem[] = orderItems.map((item) => ({
    id: item.product_id,
    name: item.product_name,
    price: item.price,
    quantity: item.quantity,
    size: item.size || undefined,
    toppings: (item.toppings as ToppingItem[]) || [],
    removedToppings: item.removed_toppings || [],
  }))

  // Return formatted order
  return {
    id: order.id,
    items,
    customer: order.customer_info as CustomerInfo,
    status: order.status as OrderStatus,
    total: order.total,
    date: order.created_at,
  }
}

// Get all orders
export async function getOrders(): Promise<Order[]> {
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (ordersError || !orders) {
    console.error('Error fetching orders:', ordersError)
    return []
  }

  // Get all order items
  const { data: allOrderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('*')

  if (itemsError) {
    console.error('Error fetching order items:', itemsError)
    return []
  }

  // Group order items by order_id
  const itemsByOrderId: Record<string, (typeof allOrderItems)[number][]> = {}
  allOrderItems.forEach((item) => {
    if (!itemsByOrderId[item.order_id]) {
      itemsByOrderId[item.order_id] = []
    }
    itemsByOrderId[item.order_id].push(item)
  })

  // Format orders with their items
  return orders.map((order) => {
    const orderItems = itemsByOrderId[order.id] || []

    // Format order items
    const items: CartItem[] = orderItems.map((item) => ({
      id: item.product_id,
      name: item.product_name,
      price: item.price,
      quantity: item.quantity,
      size: item.size || undefined,
      toppings: (item.toppings as ToppingItem[]) || [],
      removedToppings: item.removed_toppings || [],
    }))

    return {
      id: order.id,
      items,
      customer: order.customer_info as CustomerInfo,
      status: order.status as OrderStatus,
      total: order.total,
      date: order.created_at,
    }
  })
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) {
    console.error('Error updating order status:', error)
    return false
  }

  return true
}

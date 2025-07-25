'use server'

import { supabase } from './supabase'
import { Order, CustomerInfo, CartItem, OrderStatus } from '@/types'
import { clearCart } from './cart-actions'

// Create a new order
export async function createOrder(
  items: CartItem[],
  customerInfo: CustomerInfo,
  total: number
): Promise<{ success: boolean; orderId?: string }> {
  // Get phone number from customer info
  const phoneNumber = customerInfo.phone

  // Insert order with items included
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      phone_number: phoneNumber,
      customer_info: customerInfo,
      status: 'in_progress',
      total,
      items: items,
    })
    .select()
    .single()

  if (orderError || !order) {
    console.error('Error creating order:', orderError)
    return { success: false }
  }

  // Clear the cart
  await clearCart()

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

  // Return formatted order
  return {
    id: order.id,
    items: order.items as CartItem[],
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

  // Format orders
  return orders.map((order) => ({
    id: order.id,
    items: order.items as CartItem[],
    customer: order.customer_info as CustomerInfo,
    status: order.status as OrderStatus,
    total: order.total,
    date: order.created_at,
  }))
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

// Delete an order
export async function deleteOrder(orderId: string): Promise<boolean> {
  const { error } = await supabase.from('orders').delete().eq('id', orderId)

  if (error) {
    console.error('Error deleting order:', error)
    return false
  }

  return true
}

// Get orders by phone number
export async function getOrdersByPhoneNumber(
  phoneNumber: string
): Promise<Order[]> {
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('phone_number', phoneNumber)
    .order('created_at', { ascending: false })

  if (ordersError || !orders) {
    console.error('Error fetching orders by phone number:', ordersError)
    return []
  }

  // Format orders
  return orders.map((order) => ({
    id: order.id,
    items: order.items as CartItem[],
    customer: order.customer_info as CustomerInfo,
    status: order.status as OrderStatus,
    total: order.total,
    date: order.created_at,
  }))
}

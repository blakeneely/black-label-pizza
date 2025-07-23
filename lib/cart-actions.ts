'use server'

import { supabase } from './supabase'
import { CartItem } from '@/types'
import { v4 as uuidv4 } from 'uuid'

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

// Get cart items for the current user
export async function getCartItems(
  headers?: Headers | Record<string, string>
): Promise<CartItem[]> {
  const userId = await getUserId(headers)

  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching cart items:', error)
    return []
  }

  return data.map((item) => ({
    id: item.product_id,
    name: item.product_name,
    price: item.price,
    quantity: item.quantity,
    size: item.size || undefined,
    toppings: (item.toppings as any) || [],
    removedToppings: item.removed_toppings || [],
  }))
}

// Add item to cart
export async function addToCart(
  item: CartItem,
  headers?: Headers | Record<string, string>
): Promise<void> {
  const userId = await getUserId(headers)

  // Check if item with same product_id, size, and toppings exists
  const { data: existingItems } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', item.id)
    .eq('size', item.size || null)

  // Find item with matching toppings
  const existingItem = existingItems?.find((cartItem) => {
    // Compare toppings (simplified comparison)
    const cartToppings = JSON.stringify(cartItem.toppings || [])
    const newToppings = JSON.stringify(item.toppings || [])
    return cartToppings === newToppings
  })

  if (existingItem) {
    // Update quantity of existing item
    await supabase
      .from('cart_items')
      .update({
        quantity: existingItem.quantity + item.quantity,
      })
      .eq('id', existingItem.id)
  } else {
    // Insert new item
    await supabase.from('cart_items').insert({
      user_id: userId,
      product_id: item.id,
      product_name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size || null,
      toppings: item.toppings || null,
      removed_toppings: item.removedToppings || null,
    })
  }
}

// Remove item from cart
export async function removeFromCart(
  productId: string,
  toppings?: any[],
  headers?: Headers | Record<string, string>
): Promise<void> {
  const userId = await getUserId(headers)

  // Get all items with matching product_id
  const { data: items } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)

  if (!items || items.length === 0) return

  // If toppings are specified, find the specific item
  if (toppings) {
    const itemToRemove = items.find((item) => {
      const itemToppings = JSON.stringify(item.toppings || [])
      const targetToppings = JSON.stringify(toppings)
      return itemToppings === targetToppings
    })

    if (itemToRemove) {
      await supabase.from('cart_items').delete().eq('id', itemToRemove.id)
    }
  } else {
    // If no toppings specified, remove all items with this product_id
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)
  }
}

// Update item quantity
export async function updateQuantity(
  productId: string,
  quantity: number,
  toppings?: any[],
  headers?: Headers | Record<string, string>
): Promise<void> {
  const userId = await getUserId(headers)

  // Get all items with matching product_id
  const { data: items } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)

  if (!items || items.length === 0) return

  // If toppings are specified, find the specific item
  if (toppings) {
    const itemToUpdate = items.find((item) => {
      const itemToppings = JSON.stringify(item.toppings || [])
      const targetToppings = JSON.stringify(toppings)
      return itemToppings === targetToppings
    })

    if (itemToUpdate) {
      if (quantity <= 0) {
        await supabase.from('cart_items').delete().eq('id', itemToUpdate.id)
      } else {
        await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', itemToUpdate.id)
      }
    }
  } else {
    // If no toppings specified, update all items with this product_id
    if (quantity <= 0) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)
    } else {
      await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', userId)
        .eq('product_id', productId)
    }
  }
}

// Clear cart
export async function clearCart(
  headers?: Headers | Record<string, string>
): Promise<void> {
  const userId = await getUserId(headers)

  await supabase.from('cart_items').delete().eq('user_id', userId)
}

// Calculate cart total
export async function getCartTotal(
  headers?: Headers | Record<string, string>
): Promise<number> {
  const items = await getCartItems(headers)

  return items.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
}

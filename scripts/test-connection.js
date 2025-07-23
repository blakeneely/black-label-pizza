// Script to test the Supabase connection
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

    // Test if we can access the cart_items table
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('*')
      .limit(1)

    if (cartError) {
      console.error('Cart items table test failed:', cartError)
    } else {
      console.log('Successfully connected to cart_items table!')
    }

    // Test if we can access the orders table
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1)

    if (ordersError) {
      console.error('Orders table test failed:', ordersError)
    } else {
      console.log('Successfully connected to orders table!')
    }

    // Test if we can access the order_items table
    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select('*')
      .limit(1)

    if (orderItemsError) {
      console.error('Order items table test failed:', orderItemsError)
    } else {
      console.log('Successfully connected to order_items table!')
    }
  } catch (error) {
    console.error('Error testing connection:', error)
  }
}

testConnection()

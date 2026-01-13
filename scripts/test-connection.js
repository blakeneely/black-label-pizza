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

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set in .env.local')
      return
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in .env.local')
      return
    }

    // Test if we can access the orders table (simplified schema)
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1)

    if (ordersError) {
      console.error('❌ Orders table test failed:', ordersError.message)
      if (ordersError.message.includes('relation "public.orders" does not exist')) {
        console.error('   → The orders table does not exist. Please run the SQL migration in the Supabase SQL Editor.')
      }
    } else {
      console.log('✅ Successfully connected to orders table!')
      console.log(`   Found ${orders?.length || 0} order(s)`)
    }
  } catch (error) {
    console.error('❌ Error testing connection:', error)
  }
}

testConnection()

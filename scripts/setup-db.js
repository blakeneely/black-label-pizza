// Script to set up the database using the Supabase REST API
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')

// Create Supabase client with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupDatabase() {
  try {
    console.log('Reading migration file...')
    const migrationPath = path.join(
      __dirname,
      '../supabase/migrations/20240101000000_initial_schema.sql'
    )
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    // Create tables directly using SQL queries
    console.log('Creating tables...')

    // Enable UUID extension
    await executeSQL('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

    // Create cart_items table
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        user_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INTEGER NOT NULL,
        size TEXT,
        toppings JSONB,
        removed_toppings TEXT[]
      );
    `)

    // Create orders table
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        user_id TEXT NOT NULL,
        customer_info JSONB NOT NULL,
        status TEXT NOT NULL DEFAULT 'in_progress',
        total DECIMAL(10, 2) NOT NULL
      );
    `)

    // Create order_items table
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INTEGER NOT NULL,
        size TEXT,
        toppings JSONB,
        removed_toppings TEXT[]
      );
    `)

    // Create indexes
    await executeSQL(
      'CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);'
    )
    await executeSQL(
      'CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);'
    )
    await executeSQL(
      'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);'
    )
    await executeSQL(
      'CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);'
    )

    console.log('Database setup completed successfully!')
  } catch (error) {
    console.error('Error setting up database:', error)
    process.exit(1)
  }
}

async function executeSQL(sql) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql })

    if (error) {
      // If the function doesn't exist, create it first
      if (error.message.includes('function "exec_sql" does not exist')) {
        await createExecSQLFunction()
        // Try again
        return executeSQL(sql)
      }

      console.error('SQL execution failed:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error executing SQL:', error)
    throw error
  }
}

async function createExecSQLFunction() {
  try {
    console.log('Creating exec_sql function...')

    // Create the function using a direct POST request
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          sql: `
          CREATE OR REPLACE FUNCTION exec_sql(sql text)
          RETURNS void
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          BEGIN
            EXECUTE sql;
          END;
          $$;
        `,
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Failed to create exec_sql function:', errorData)
      throw new Error('Failed to create exec_sql function')
    }

    console.log('exec_sql function created successfully!')
  } catch (error) {
    console.error('Error creating exec_sql function:', error)
    throw error
  }
}

setupDatabase()

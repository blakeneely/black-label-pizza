# Supabase Setup Instructions

Follow these steps to set up your database tables in Supabase:

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Select your project "supabase-violet-kite"
3. Go to the "SQL Editor" section in the left sidebar
4. Create a new SQL query by clicking "New Query"
5. Copy and paste the following SQL into the editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create cart_items table
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

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id TEXT NOT NULL,
  customer_info JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  total DECIMAL(10, 2) NOT NULL
);

-- Create order_items table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
```

6. Click "Run" to execute the SQL and create the tables
7. Verify that the tables were created by checking the "Table Editor" section

## Row-Level Security (RLS) Policies

After creating the tables, you should set up Row-Level Security policies to control access to your data. Here's how:

1. Go to the "Authentication" section in the left sidebar
2. Click on "Policies"
3. For each table (cart_items, orders, order_items), click "New Policy" and set up the following policies:

### For cart_items table:

- Policy name: "Users can only access their own cart items"
- Policy definition: `auth.uid() = user_id`
- Apply to: SELECT, INSERT, UPDATE, DELETE

### For orders table:

- Policy name: "Users can only access their own orders"
- Policy definition: `auth.uid() = user_id`
- Apply to: SELECT, INSERT, UPDATE, DELETE

### For order_items table:

- Policy name: "Users can access items from their own orders"
- Policy definition: `auth.uid() = (SELECT user_id FROM orders WHERE id = order_id)`
- Apply to: SELECT, INSERT, UPDATE, DELETE

## Testing the Setup

To test if your setup is working correctly:

1. Start your application with `npm run dev`
2. Navigate to the application in your browser
3. Add items to your cart and place an order
4. Check the Supabase dashboard to see if the data is being stored correctly

If you encounter any issues, check the browser console and server logs for error messages.

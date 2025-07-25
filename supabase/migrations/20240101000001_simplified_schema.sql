-- Drop existing tables
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;

-- Create simplified orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  phone_number TEXT NOT NULL,
  customer_info JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  total DECIMAL(10, 2) NOT NULL,
  items JSONB NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_orders_phone_number ON orders(phone_number);
CREATE INDEX idx_orders_status ON orders(status); 
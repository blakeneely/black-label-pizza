# Supabase Setup Instructions for Black Label Pizza

## Quick Setup Guide

### 1. Create a New Supabase Project

1. Go to https://supabase.com and sign in
2. Click **"New Project"** or **"Create Project"**
3. Fill in the details:
   - **Name**: `black-label-pizza` (or any name you prefer)
   - **Database Password**: Create a strong password (save this securely)
   - **Region**: Choose the region closest to you
   - **Pricing Plan**: Free tier is fine for development
4. Click **"Create new project"** and wait 2-3 minutes for it to provision

### 2. Get Your API Keys

1. In your project dashboard, click **Settings** (gear icon) in the left sidebar
2. Click **API** in the settings menu
3. Copy these two values:
   - **Project URL** (found under "Project URL")
   - **anon public key** (found under "Project API keys" → use the "anon" key, NOT the "service_role" key)

### 3. Create the Database Tables

1. In the left sidebar, click **SQL Editor**
2. Click **"New query"** button
3. Copy and paste this SQL code:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
```

4. Click **"Run"** button (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned" message

### 4. Set Up Environment Variables

1. In your project root directory, create or update the `.env.local` file
2. Add these two lines (replace with your actual values from Step 2):

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDk5ODQwMCwiZXhwIjoxOTU2NTc0NDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. Test the Connection

Run this command in your terminal:

```bash
node scripts/test-connection.js
```

You should see:
- "Successfully connected to orders table!"
- If you see any errors, double-check your environment variables in `.env.local`

### 6. Start Your Development Server

```bash
npm run dev
```

Your app should now be connected to the new Supabase database!

## Troubleshooting

### If you see connection errors:

1. **Check your `.env.local` file**:
   - Make sure it's in the root directory (same level as `package.json`)
   - Make sure there are no extra spaces or quotes around the values
   - Make sure the file is named exactly `.env.local` (starts with a dot)

2. **Restart your development server** after updating `.env.local`

3. **Verify your API keys**:
   - Go back to Supabase Dashboard → Settings → API
   - Make sure you're using the **anon** key, not the service_role key
   - Make sure the Project URL doesn't have a trailing slash

4. **Check the table exists**:
   - Go to Supabase Dashboard → Table Editor
   - You should see an `orders` table listed

### If the SQL query fails:

- Make sure you're running it in the SQL Editor (not Table Editor)
- Try running just the CREATE TABLE statement first, then the indexes separately
- Check for any error messages in the SQL Editor output

## Notes

- The app now uses a simplified schema with just one `orders` table (no separate `order_items` table)
- Cart functionality is handled client-side with localStorage (not stored in Supabase)
- Phone numbers are used as the user identifier instead of UUIDs

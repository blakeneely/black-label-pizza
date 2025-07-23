# Supabase Setup for Black Label Pizza

## What We've Done

1. **Database Schema**:

   - Created tables for cart_items, orders, and order_items
   - Set up appropriate relationships between tables
   - Added indexes for better performance

2. **Application Integration**:

   - Updated the CartContext to use Supabase instead of localStorage
   - Updated the OrderContext to use Supabase instead of localStorage
   - Created server actions for cart and order operations

3. **Testing**:
   - Created a test script to verify the connection to Supabase
   - Confirmed that all tables are accessible

## How It Works

The application now uses Supabase as its backend database instead of localStorage. Here's how the data flows:

1. **Cart Management**:

   - When a user adds an item to their cart, it's stored in the cart_items table in Supabase
   - Each cart item is associated with a user_id (generated from a cookie)
   - The CartContext provides methods to add, remove, update, and clear cart items

2. **Order Processing**:

   - When a user places an order, a new record is created in the orders table
   - Order items are stored in the order_items table, linked to the order
   - The OrderContext provides methods to create orders and update their status

3. **Store Dashboard**:
   - The store dashboard fetches orders from Supabase
   - Store employees can update order status (in_progress or completed)

## Next Steps

1. **Row-Level Security**:

   - For a production application, you should set up Row-Level Security (RLS) policies
   - This ensures that users can only access their own data
   - See the instructions in `supabase/setup-instructions.md`

2. **Authentication**:

   - For a real application, you should implement proper authentication
   - Supabase provides easy-to-use authentication services
   - This would replace the current cookie-based user identification

3. **Error Handling**:

   - Implement more robust error handling for database operations
   - Add retry mechanisms for failed operations
   - Provide better feedback to users when operations fail

4. **Offline Support**:

   - Consider adding offline support with local caching
   - Sync local changes when the connection is restored

5. **Performance Optimization**:
   - Implement pagination for large datasets
   - Add caching for frequently accessed data
   - Optimize database queries

## Troubleshooting

If you encounter issues with the Supabase integration:

1. **Check Connection**:

   - Run `node scripts/test-connection.js` to verify the connection to Supabase
   - Make sure your environment variables are correctly set in `.env.local`

2. **Check Console Logs**:

   - Look for error messages in the browser console
   - Check the server logs for any backend errors

3. **Verify Database Tables**:

   - Check the Supabase dashboard to make sure the tables exist
   - Verify that the table structures match the expected schema

4. **Test API Endpoints**:
   - Use the Supabase dashboard to test API endpoints directly
   - This can help isolate whether issues are with the database or the application

## Resources

- [Supabase Documentation](https://supabase.io/docs)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [React Context API](https://reactjs.org/docs/context.html)

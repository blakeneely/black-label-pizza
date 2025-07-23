// Script to create a stored procedure for executing SQL
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Create Supabase client with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createProcedure() {
  try {
    console.log('Creating pg_execute_sql procedure...')

    // SQL to create the stored procedure
    const sql = `
      CREATE OR REPLACE FUNCTION pg_execute_sql(sql text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$;
    `

    // Execute the SQL directly using the REST API
    const { error } = await supabase
      .from('_rpc')
      .select('*', { head: true })
      .rpc('pg_execute_sql', { sql })

    if (error) {
      // If the function doesn't exist yet, create it
      const { error: createError } = await supabase.rest.rpc('pg_execute_sql', {
        sql,
      })

      if (createError) {
        console.error('Failed to create procedure:', createError)
        process.exit(1)
      }
    }

    console.log('Procedure created successfully!')
  } catch (error) {
    console.error('Error creating procedure:', error)
    process.exit(1)
  }
}

createProcedure()

// Script to run database migrations
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Create Supabase client with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function runMigration() {
  try {
    console.log('Reading migration file...')
    const migrationPath = path.join(
      __dirname,
      '../supabase/migrations/20240101000000_initial_schema.sql'
    )
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    console.log('Running migration...')
    const { error } = await supabase.rpc('pg_execute_sql', {
      sql: migrationSQL,
    })

    if (error) {
      console.error('Migration failed:', error)
      process.exit(1)
    }

    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Error running migration:', error)
    process.exit(1)
  }
}

runMigration()

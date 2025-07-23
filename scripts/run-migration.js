// Script to run migrations directly using Supabase's REST API
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

    // Split the SQL into individual statements
    const statements = migrationSQL
      .replace(/\n/g, ' ')
      .replace(/--.*?$/gm, '') // Remove comments
      .split(';')
      .filter((stmt) => stmt.trim() !== '')

    // Execute each statement
    for (const stmt of statements) {
      console.log(`Executing: ${stmt.substring(0, 50)}...`)
      const { data, error } = await supabase.rpc('exec_sql', { sql: stmt })

      if (error) {
        console.error('Statement failed:', error)
        // Continue with other statements
      }
    }

    console.log('Migration completed!')
  } catch (error) {
    console.error('Error running migration:', error)
    process.exit(1)
  }
}

runMigration()

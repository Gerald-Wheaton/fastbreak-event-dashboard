import { db } from '@/db'
import { sql } from 'drizzle-orm'

async function addColorColumn() {
	try {
		console.log('Adding color column to sports table...')

		// Add the color column if it doesn't exist
		await db.execute(sql`
      ALTER TABLE sports
      ADD COLUMN IF NOT EXISTS color text;
    `)

		console.log('✅ Color column added successfully!')
	} catch (error) {
		console.error('❌ Error adding color column:', error)
		throw error
	}
}

addColorColumn()
	.then(() => {
		console.log('Migration complete')
		process.exit(0)
	})
	.catch((error) => {
		console.error('Migration failed:', error)
		process.exit(1)
	})

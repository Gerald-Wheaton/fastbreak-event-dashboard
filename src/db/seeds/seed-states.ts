// Load environment variables first
import { config } from 'dotenv'
config({ path: '.env.local' })

import { db } from '../index'
import { states } from '../schema'
import { US_STATES } from './states-data'

async function seedStates() {
	try {
		console.log('🌱 Seeding states table...')

		// Check if states already exist
		const existingStates = await db.select().from(states)

		if (existingStates.length > 0) {
			console.log(
				`⚠️  States table already has ${existingStates.length} entries. Skipping seed.`
			)
			console.log('💡 To re-seed, first run: DELETE FROM states;')
			process.exit(0)
		}

		// Insert all states
		const result = await db.insert(states).values(US_STATES).returning()

		console.log(`✅ Successfully seeded ${result.length} states!`)

		// Display first few states as confirmation
		console.log('\n📋 Sample of seeded states:')
		result.slice(0, 5).forEach((state) => {
			console.log(`   ${state.abbreviation} - ${state.name}`)
		})
		console.log(`   ... and ${result.length - 5} more\n`)

		process.exit(0)
	} catch (error) {
		console.error('❌ Error seeding states:', error)
		process.exit(1)
	}
}

// Run the seed function
seedStates()

import { db } from '@/db'
import { venues } from '@/db/schema'
import { sql } from 'drizzle-orm'

const venuesData = [
	{
		name: 'LA Sports Complex',
		city: 'Los Angeles',
		stateAbbr: 'CA',
		zipCode: '90015',
		address1: '1250 S Figueroa St',
		phone: '(213) 555-7890',
	},
	{
		name: 'Phoenix Sports Arena',
		city: 'Phoenix',
		stateAbbr: 'AZ',
		zipCode: '85004',
		address1: '201 E Jefferson St',
		phone: '(602) 555-4321',
	},
	{
		name: 'Austin Tennis Center',
		city: 'Austin',
		stateAbbr: 'TX',
		zipCode: '78701',
		address1: '2800 Congress Ave',
		phone: '(512) 555-6789',
	},
	{
		name: 'Miami Beach Volleyball Courts',
		city: 'Miami',
		stateAbbr: 'FL',
		zipCode: '33139',
		address1: '1001 Ocean Dr',
		phone: '(305) 555-2468',
	},
]

async function seedVenues() {
	try {
		console.log('Seeding venues...')

		for (const venue of venuesData) {
			// Check if venue already exists
			const existing = await db
				.select()
				.from(venues)
				.where(sql`name = ${venue.name}`)
				.limit(1)

			if (existing.length > 0) {
				console.log(`  ⊘ ${venue.name} already exists, skipping...`)
				continue
			}

			await db.insert(venues).values(venue)
			console.log(`  ✓ ${venue.name} (${venue.city}, ${venue.stateAbbr})`)
		}

		console.log(`✅ Successfully seeded ${venuesData.length} venues!`)
	} catch (error) {
		console.error('❌ Error seeding venues:', error)
		throw error
	}
}

seedVenues()
	.then(() => {
		console.log('Seeding complete')
		process.exit(0)
	})
	.catch((error) => {
		console.error('Seeding failed:', error)
		process.exit(1)
	})

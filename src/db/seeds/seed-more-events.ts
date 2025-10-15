import { db } from '@/db'
import { events, venues } from '@/db/schema'
import { sql } from 'drizzle-orm'

// Helper to create dates relative to today
const today = new Date()
const getDate = (daysOffset: number, hour = 18, minute = 0) => {
	const date = new Date(today)
	date.setDate(date.getDate() + daysOffset)
	date.setHours(hour, minute, 0, 0)
	return date
}

async function seedMoreEvents() {
	try {
		console.log('Seeding additional events...')

		// Fetch all venues
		const allVenues = await db.select().from(venues)
		const venueMap = new Map(allVenues.map((v) => [v.name, v.id]))

		const userId = null // Set to null for now

		const eventsData = [
			// COMPLETED EVENTS (5 total - already ended)
			{
				name: 'Basketball Tournament Finals',
				sportId: 'basketball',
				startsAt: getDate(-21, 17, 0), // 3 weeks ago, 5 PM
				description:
					'Championship finals! Bring your basketball shoes (non-marking soles only), water bottle, and team jersey. Indoor court with AC. Free throw competition before tip-off. Medals for winners.',
				venueId: venueMap.get('Phoenix Sports Arena')!,
				ownerId: userId,
			},
			{
				name: 'Softball League Game',
				sportId: 'softball',
				startsAt: getDate(-18, 13, 0), // 18 days ago, 1 PM
				description:
					'Regular season game. Bring glove, bat, helmet, and cleats. Catcher gear provided by team. The field has dugouts with benches and a backstop. Sunscreen recommended - minimal shade available.',
				venueId: venueMap.get('Houston Sports Park')!,
				ownerId: userId,
			},
			{
				name: 'Field Hockey Practice',
				sportId: 'field-hockey',
				startsAt: getDate(-12, 16, 30), // 12 days ago, 4:30 PM
				description:
					'Team practice session. Bring your stick, shin guards, mouthguard, and water. Turf field - wear turf shoes or cleats. First aid kit on site. Practice will focus on penalty corners and defensive formations.',
				venueId: venueMap.get('Dallas Athletic Complex')!,
				ownerId: userId,
			},
			{
				name: 'Ice Hockey Scrimmage',
				sportId: 'hockey',
				startsAt: getDate(-8, 20, 0), // 8 days ago, 8 PM
				description:
					'Late night ice time! Full gear required - skates, helmet, pads, gloves, stick. Locker rooms available 30 minutes before. The rink maintains ice at 60°F. Bring extra tape and a backup stick.',
				venueId: venueMap.get('LA Sports Complex')!,
				ownerId: userId,
			},
			{
				name: 'Lacrosse Match',
				sportId: 'lacrosse',
				startsAt: getDate(-4, 11, 0), // 4 days ago, 11 AM
				description:
					'Weekend lacrosse game. Bring your stick, helmet, gloves, and protective gear. Mouthguard mandatory. The field is regulation size with proper goals. Water stations available on both sidelines.',
				venueId: venueMap.get('Austin Tennis Center')!,
				ownerId: userId,
			},

			// THIS WEEK (3 total)
			{
				name: 'Basketball Pickup Game',
				sportId: 'basketball',
				startsAt: getDate(1, 19, 0), // Tomorrow, 7 PM
				description:
					'Casual pickup game - all skill levels welcome! Just bring your basketball shoes and water. Indoor court with good lighting. Games to 21, winner stays on. Locker rooms available.',
				venueId: venueMap.get('San Antonio Stadium')!,
				ownerId: userId,
			},
			{
				name: 'Softball Double Header',
				sportId: 'softball',
				startsAt: getDate(2, 10, 0), // 2 days from now, 10 AM
				description:
					'Two games back-to-back! Bring plenty of water, sunscreen, and snacks. All equipment needed - glove, cleats, bat, helmet. Games are 7 innings each. Shade tents will be set up between the fields.',
				venueId: venueMap.get('Miami Beach Volleyball Courts')!,
				ownerId: userId,
			},
			{
				name: 'Field Hockey Tournament',
				sportId: 'field-hockey',
				startsAt: getDate(4, 8, 0), // 4 days from now, 8 AM
				description:
					'All-day tournament! Multiple games scheduled. Bring your complete kit - stick, shin guards, mouthguard, cleats, and backup equipment. Food trucks on site. Tournament format: pool play then finals.',
				venueId: venueMap.get('Phoenix Sports Arena')!,
				ownerId: userId,
			},
		]

		// Insert events
		let insertedCount = 0
		for (const event of eventsData) {
			// Check if event already exists by name
			const existing = await db
				.select()
				.from(events)
				.where(sql`name = ${event.name}`)
				.limit(1)

			if (existing.length > 0) {
				console.log(`  ⊘ ${event.name} already exists, skipping...`)
				continue
			}

			await db.insert(events).values(event)
			insertedCount++
			const eventDate = event.startsAt.toLocaleDateString()
			console.log(`  ✓ ${event.name} (${event.sportId}, ${eventDate})`)
		}

		console.log(`✅ Successfully seeded ${insertedCount} additional events!`)
	} catch (error) {
		console.error('❌ Error seeding events:', error)
		throw error
	}
}

seedMoreEvents()
	.then(() => {
		console.log('Seeding complete')
		process.exit(0)
	})
	.catch((error) => {
		console.error('Seeding failed:', error)
		process.exit(1)
	})

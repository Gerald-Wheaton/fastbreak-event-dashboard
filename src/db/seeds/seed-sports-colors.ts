import { db } from '@/db'
import { sports } from '@/db/schema'
import { eq } from 'drizzle-orm'

// Generate a random hex color
function generateRandomHexColor(): string {
	const randomColor = Math.floor(Math.random() * 16777215).toString(16)
	return `#${randomColor.padStart(6, '0').toUpperCase()}`
}

// Generate unique colors for all sports
function generateUniqueColors(count: number): string[] {
	const colors = new Set<string>()

	while (colors.size < count) {
		colors.add(generateRandomHexColor())
	}

	return Array.from(colors)
}

async function seedSportsColors() {
	try {
		console.log('Fetching existing sports...')

		// Get all sports
		const allSports = await db.select().from(sports)

		if (allSports.length === 0) {
			console.log('No sports found to update')
			return
		}

		console.log(`Found ${allSports.length} sports`)

		// Generate unique colors
		const uniqueColors = generateUniqueColors(allSports.length)

		console.log('Updating sports with random colors...')

		// Update each sport with a unique color
		for (let i = 0; i < allSports.length; i++) {
			const sport = allSports[i]
			const color = uniqueColors[i]

			await db.update(sports).set({ color }).where(eq(sports.id, sport.id))

			console.log(`  ✓ ${sport.name}: ${color}`)
		}

		console.log(
			`✅ Successfully updated ${allSports.length} sports with random colors!`
		)
	} catch (error) {
		console.error('❌ Error seeding sports colors:', error)
		throw error
	}
}

seedSportsColors()
	.then(() => {
		console.log('Seeding complete')
		process.exit(0)
	})
	.catch((error) => {
		console.error('Seeding failed:', error)
		process.exit(1)
	})

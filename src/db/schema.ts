import {
	pgTable,
	text,
	uuid,
	timestamp,
	varchar,
	doublePrecision,
	boolean,
	primaryKey,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { authUsers } from '@/lib/supabase'

// ---------- STATES ----------
export const states = pgTable('states', {
	abbreviation: text('abbreviation').primaryKey(), // e.g. "AZ"
	name: text('name').notNull(), // e.g. "Arizona"
})

// ---------- SPORTS ----------
export const sports = pgTable('sports', {
	id: text('id').primaryKey(), // kebab-case ID, e.g. "water-polo"
	name: text('name').notNull(), // display name
	color: text('color'), // hex color value, e.g. "#FF5733"
})

// ---------- USERS ----------
export const users = pgTable('users', {
	id: uuid('id')
		.primaryKey()
		.references(() => authUsers.id, { onDelete: 'cascade' }),
	displayName: text('display_name'),
	avatarUrl: text('avatar_url'),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
})

// Note: `authUsers` comes from Supabase's `auth.users` table.
// If you’re not pulling that into Drizzle, just remove the `.references(...)` above.

// ---------- VENUES ----------
export const venues = pgTable('venues', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	city: text('city').notNull(),
	stateAbbr: text('state_abbr')
		.notNull()
		.references(() => states.abbreviation, { onUpdate: 'cascade' }),
	zipCode: varchar('zip_code', { length: 10 }),
	address1: text('address_1'),
	phone: text('phone'),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
})

// ---------- EVENTS ----------
export const events = pgTable('events', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	sportId: text('sport_id')
		.notNull()
		.references(() => sports.id, { onUpdate: 'cascade' }),
	startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
	description: text('description'),
	venueId: uuid('venue_id')
		.notNull()
		.references(() => venues.id, { onDelete: 'restrict' }),
	ownerId: uuid('owner_id').references(() => users.id, {
		onDelete: 'set null',
	}),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
})

// ---------- RELATIONS ----------
export const eventsRelations = relations(events, ({ one }) => ({
	sport: one(sports, { fields: [events.sportId], references: [sports.id] }),
	venue: one(venues, { fields: [events.venueId], references: [venues.id] }),
	owner: one(users, { fields: [events.ownerId], references: [users.id] }),
}))

export const venuesRelations = relations(venues, ({ one, many }) => ({
	state: one(states, {
		fields: [venues.stateAbbr],
		references: [states.abbreviation],
	}),
	events: many(events),
}))

export const sportsRelations = relations(sports, ({ many }) => ({
	events: many(events),
}))

export const statesRelations = relations(states, ({ many }) => ({
	venues: many(venues),
}))

export const usersRelations = relations(users, ({ many }) => ({
	events: many(events),
}))

"use server";

import { db } from "@/db";
import { events, venues, sports } from "@/db/schema";
import { eq, like, and, desc } from "drizzle-orm";

export async function getEvents({
  search,
  sport,
}: {
  search?: string;
  sport?: string;
}) {
  try {
    let query = db
      .select({
        id: events.id,
        name: events.name,
        description: events.description,
        startsAt: events.startsAt,
        createdAt: events.createdAt,
        sport: {
          id: sports.id,
          name: sports.name,
        },
        venue: {
          id: venues.id,
          name: venues.name,
          city: venues.city,
          stateAbbr: venues.stateAbbr,
        },
      })
      .from(events)
      .leftJoin(sports, eq(events.sportId, sports.id))
      .leftJoin(venues, eq(events.venueId, venues.id))
      .orderBy(desc(events.startsAt));

    // Apply filters
    const filters = [];

    if (search) {
      filters.push(like(events.name, `%${search}%`));
    }

    if (sport) {
      filters.push(eq(events.sportId, sport));
    }

    if (filters.length > 0) {
      query = query.where(and(...filters)) as typeof query;
    }

    const result = await query;

    return result;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

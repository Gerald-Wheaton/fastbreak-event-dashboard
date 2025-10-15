"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { events, sports, venues } from "@/db/schema";
import { eventInsertSchema, type EventInsert } from "@/db/validations";

export async function getSports() {
  try {
    return await db.select().from(sports);
  } catch (error) {
    console.error("Error fetching sports:", error);
    return [];
  }
}

export async function getVenues() {
  try {
    return await db.select().from(venues);
  } catch (error) {
    console.error("Error fetching venues:", error);
    return [];
  }
}

export async function createEvent(data: EventInsert) {
  try {
    // Validate data
    const validatedData = eventInsertSchema.parse(data);

    // Insert event
    const [newEvent] = await db
      .insert(events)
      .values(validatedData)
      .returning();

    revalidatePath("/");
    redirect("/");
  } catch (error) {
    console.error("Error creating event:", error);

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Failed to create event" };
  }
}

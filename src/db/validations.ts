import { z } from "zod";

// ---------- REUSABLE VALIDATORS ----------

const timestamps = {
  createdAt: z.date(),
  updatedAt: z.date(),
};

const uuidField = z.string().uuid("Invalid ID format");

const stateAbbreviationField = z
  .string()
  .length(2, "State abbreviation must be 2 characters")
  .toUpperCase();

// ---------- STATES ----------

export const stateInsertSchema = z.object({
  abbreviation: stateAbbreviationField,
  name: z.string().min(1, "State name is required"),
});

export const stateUpdateSchema = stateInsertSchema.partial();
export const stateSchema = stateInsertSchema; // No auto-generated fields

// ---------- SPORTS ----------

export const sportInsertSchema = z.object({
  id: z
    .string()
    .min(1, "Sport ID is required")
    .regex(/^[a-z0-9-]+$/, "Sport ID must be lowercase kebab-case"),
  name: z.string().min(1, "Sport name is required"),
  color: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Color must be a valid hex code (e.g., #FF5733)"
    )
    .optional(),
});

export const sportUpdateSchema = sportInsertSchema.partial();
export const sportSchema = sportInsertSchema; // No auto-generated fields

// ---------- USERS ----------

export const userInsertSchema = z.object({
  id: uuidField,
  displayName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url("Invalid avatar URL").optional(),
});

export const userUpdateSchema = userInsertSchema.omit({ id: true }).partial();
export const userSchema = userInsertSchema.extend(timestamps);

// ---------- VENUES ----------

export const venueInsertSchema = z.object({
  name: z.string().min(1, "Venue name is required").max(200),
  city: z.string().min(1, "City is required").max(100),
  stateAbbr: stateAbbreviationField,
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format")
    .optional(),
  address1: z.string().max(200).optional(),
  phone: z
    .string()
    .regex(/^[\d\s\-\(\)\+\.]+$/, "Invalid phone number format")
    .optional(),
});

export const venueUpdateSchema = venueInsertSchema.partial();
export const venueSchema = venueInsertSchema
  .extend({ id: uuidField })
  .extend(timestamps);

// ---------- EVENTS ----------

export const eventInsertSchema = z.object({
  name: z.string().min(1, "Event name is required").max(200),
  sportId: z.string().min(1, "Sport is required"),
  startsAt: z.coerce.date(),
  description: z.string().max(2000).optional(),
  venueId: uuidField,
  ownerId: uuidField.optional(),
});

export const eventUpdateSchema = eventInsertSchema.partial();
export const eventSchema = eventInsertSchema
  .extend({ id: uuidField })
  .extend(timestamps);

// ---------- CUSTOM VALIDATORS ----------

// Event with future date validation
export const eventInsertSchemaWithFutureValidation = eventInsertSchema.refine(
  (data) => data.startsAt > new Date(),
  {
    message: "Event start time must be in the future",
    path: ["startsAt"],
  }
);

// ---------- TYPE EXPORTS ----------

export type State = z.infer<typeof stateSchema>;
export type StateInsert = z.infer<typeof stateInsertSchema>;
export type StateUpdate = z.infer<typeof stateUpdateSchema>;

export type Sport = z.infer<typeof sportSchema>;
export type SportInsert = z.infer<typeof sportInsertSchema>;
export type SportUpdate = z.infer<typeof sportUpdateSchema>;

export type User = z.infer<typeof userSchema>;
export type UserInsert = z.infer<typeof userInsertSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;

export type Venue = z.infer<typeof venueSchema>;
export type VenueInsert = z.infer<typeof venueInsertSchema>;
export type VenueUpdate = z.infer<typeof venueUpdateSchema>;

export type Event = z.infer<typeof eventSchema>;
export type EventInsert = z.infer<typeof eventInsertSchema>;
export type EventUpdate = z.infer<typeof eventUpdateSchema>;

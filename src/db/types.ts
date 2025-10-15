import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { events, venues, sports, states, users } from "@/db/schema";

export type Event = InferSelectModel<typeof events>;
export type NewEvent = InferInsertModel<typeof events>;

export type Venue = InferSelectModel<typeof venues>;
export type NewVenue = InferInsertModel<typeof venues>;

export type Sport = InferSelectModel<typeof sports>;
export type State = InferSelectModel<typeof states>;
export type User = InferSelectModel<typeof users>;

export type VenueWithState = Venue & {
  state: State;
};

export type EventWithRelations = Event & {
  sport: Sport;
  venue: VenueWithState;
  owner?: User | null;
};

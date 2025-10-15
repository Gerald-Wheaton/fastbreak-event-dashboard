import { Sport, Venue } from "@/db/types";
import { mockSports, mockVenues } from "@/lib/mock-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function VenueSelector({
  venueId,
  setVenueId,
}: {
  venueId: string;
  setVenueId: (venueId: string) => void;
}) {
  return (
    <Select value={venueId} onValueChange={setVenueId} required>
      <SelectTrigger id="venue">
        <SelectValue placeholder="Select a venue" />
      </SelectTrigger>
      <SelectContent>
        {mockVenues.map((venue: Venue) => (
          <SelectItem key={venue.id} value={venue.id}>
            {venue.name} - {venue.city}, {venue.stateAbbr}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function SportSelector({
  sportId,
  setSportId,
}: {
  sportId: string;
  setSportId: (sportId: string) => void;
}) {
  return (
    <Select value={sportId} onValueChange={setSportId} required>
      <SelectTrigger id="edit-sport-type">
        <SelectValue placeholder="Select a sport" />
      </SelectTrigger>
      <SelectContent>
        {mockSports.map((sport) => (
          <SelectItem key={sport.id} value={sport.id}>
            {sport.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

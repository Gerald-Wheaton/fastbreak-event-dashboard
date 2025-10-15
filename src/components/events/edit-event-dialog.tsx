"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/events/date-time-picker";
import type { EventWithRelations } from "@/db/types";
import { VenueSelector, SportSelector } from "@/components/selectors";

interface EditEventDialogProps {
  event: EventWithRelations;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (eventId: string, data: Partial<EventWithRelations>) => void;
}

export function EditEventDialog({
  event,
  open,
  onOpenChange,
  onSave,
}: EditEventDialogProps) {
  const [name, setName] = useState(event.name);
  const [sportId, setSportId] = useState(event.sportId);
  const [startsAt, setStartsAt] = useState<Date | undefined>(
    new Date(event.startsAt)
  );
  const [venueId, setVenueId] = useState(event.venueId);
  const [description, setDescription] = useState(event.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(event.id, {
      name,
      sportId,
      startsAt,
      venueId,
      description,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Event Name</Label>
            <Input
              id="edit-name"
              placeholder="Summer Basketball Tournament"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-sport-type">Sport Type</Label>
            <SportSelector sportId={sportId} setSportId={setSportId} />
          </div>

          <DateTimePicker
            label="Event Date & Time"
            value={startsAt}
            onChange={setStartsAt}
            id="edit-starts-at"
          />

          <div className="space-y-2">
            <Label htmlFor="edit-venue">Venue</Label>
            <VenueSelector venueId={venueId} setVenueId={setVenueId} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="Provide details about the event..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

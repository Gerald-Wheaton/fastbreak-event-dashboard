"use client";

import { EventCard } from "@/components/events/event-card";
import { SearchFilter } from "@/components/dashboard/search-filter";
import { EmptyState } from "@/components/dashboard/empty-state";

import { groupEventsByDate } from "@/lib/date-utils";
import { useState } from "react";
import { isToday, isThisMonth } from "date-fns";
import type { EventWithRelations } from "@/db/types";
import { useEventsStore } from "@/lib/events-store";
export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sportFilters, setSportFilters] = useState<string[]>([]);
  const [timePeriod, setTimePeriod] = useState<"all" | "today" | "month">(
    "all"
  );
  const { events, deleteEvent, updateEvent, isLoaded } = useEventsStore();

  const filteredEvents = events.filter((event: EventWithRelations) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSport =
      sportFilters.length === 0 || sportFilters.includes(event.sportId);

    let matchesTimePeriod = true;
    if (timePeriod === "today") {
      matchesTimePeriod = isToday(new Date(event.startsAt));
    } else if (timePeriod === "month") {
      matchesTimePeriod = isThisMonth(new Date(event.startsAt));
    }

    return matchesSearch && matchesSport && matchesTimePeriod;
  });

  const groupedEvents = groupEventsByDate(filteredEvents);
  const hasEvents = filteredEvents.length > 0;

  const getVisibleGroups = (): string[] => {
    if (timePeriod === "today") {
      return ["Today"];
    }
    if (timePeriod === "month") {
      return ["Today", "This Week", "Upcoming"];
    }
    return ["Today", "This Week", "Upcoming", "Past Events"];
  };

  const visibleGroups = getVisibleGroups();

  const handleDuplicate = (event: EventWithRelations) => {
    // TODO: Implement duplicate event
    const duplicatedEvent = {
      ...event,
      id: `event-${Date.now()}`,
      name: `${event.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // TODO: Implement duplicate event in the events store
    console.log("[v0] Duplicating event:", duplicatedEvent);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,hsl(var(--muted)/0.3),hsl(var(--background)))]">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-balance">Event Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and organize your sports events
          </p>
        </div>

        <div className="mb-6">
          <SearchFilter
            onSearchChange={setSearchTerm}
            onSportFilterChange={setSportFilters}
            onTimePeriodChange={setTimePeriod}
          />
        </div>

        {hasEvents ? (
          <div className="space-y-8">
            {visibleGroups.map((group) => {
              const groupEvents = groupedEvents[group] || [];
              if (groupEvents.length === 0) return null;

              return (
                <div key={group} className="space-y-4">
                  <h2 className="text-2xl font-semibold">{group}</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {groupEvents.map((event: EventWithRelations) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onDelete={deleteEvent}
                        onEdit={updateEvent}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}

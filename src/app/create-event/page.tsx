"use client";

import { EventForm } from "@/components/events/event-form";
import { useRouter } from "next/navigation";
import { useEventsStore } from "@/lib/events-store";

export default function CreateEvent() {
  const router = useRouter();
  const { addEvent } = useEventsStore();

  const handleSubmit = (data: any) => {
    addEvent(data);
    router.push("/");
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-balance">Create Event</h1>
          <p className="text-muted-foreground">
            Add a new sports event to your calendar
          </p>
        </div>

        <EventForm onSubmit={handleSubmit} submitLabel="Create Event" />
      </main>
    </div>
  );
}

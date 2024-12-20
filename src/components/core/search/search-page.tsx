"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HomeEventCard } from "@/components/core";
import { IEvent } from "@/types/events";

export default function SearchResults({ allEvents }: { allEvents: IEvent[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(allEvents);
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
      filterEvents(query);
    }
  }, [query]);

  const filterEvents = (query: string) => {
    const filtered = allEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.venue.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      filterEvents(searchTerm);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Search Results for: "{query}"
      </h1>

      <form
        onSubmit={handleSearch}
        className="mx-auto mb-8 max-w-2xl relative flex"
      >
        <Input
          type="search"
          placeholder="Search for events"
          className="pr-20 bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-400 focus:ring-2 focus:ring-emerald-500 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit" className="absolute right-0 top-0 h-full">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event, idx) => (
          <HomeEventCard event={event} key={idx} />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-300 mt-8">
          No events found matching your search.
        </p>
      )}
    </div>
  );
}

import { HomeEventCard, SearchBar } from "@/components/core";
import { fetchEvents } from "@/lib/db-operation";

export const dynamic = "force-dynamic";

export default async function LitverseEvents() {
  const events = await fetchEvents();

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-4xl font-bold md:text-6xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
            Discover Exciting Events
            <br />
            Near You
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-600 dark:text-zinc-300">
            Find and join amazing events in your area or host your own.
            <br />
            Connect with like-minded individuals and create unforgettable
            experiences.
          </p>

          {/* Search Bar */}
          <SearchBar />
        </div>
      </section>

      {/* Event Grid Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Event Items */}
            {events.map((event, index) => (
              <HomeEventCard event={event} key={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

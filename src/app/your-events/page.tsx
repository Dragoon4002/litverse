"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { contract } from "@/lib/client-thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { readContract } from "thirdweb";
import { useRouter } from "next/navigation";
import axios from "axios";
import { IEvent } from "@/types/events";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import Link from "next/link";

interface Events {
  upcoming: IEvent[];
  past: IEvent[];
}

type EventTabs = keyof Events;

export default function YourEventsPage() {
  const [activeTab, setActiveTab] = useState<EventTabs>("upcoming");
  const [events, setEvents] = useState<Events>({ upcoming: [], past: [] });
  const activeAccount = useActiveAccount();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      if (!activeAccount) return router.push("/");

      const ids = await readContract({
        contract,
        method: "function getUserEvents(address user) view returns (string[])",
        params: [activeAccount?.address],
      });

      console.log("client log of ids", ids);

      const { data } = await axios.post("/api/events", {
        ids,
      });

      if (data.success) {
        setEvents({ upcoming: data.upcomingEvents, past: data.pastEvents });
      } else {
        toast({ title: "No events found", variant: "destructive" });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeAccount) {
      fetchEvents();
    }
  }, [activeAccount]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
          Bookings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          See your upcoming and past events all in one place
        </p>

        {loading ? (
          <div className="w-full">
            <p className="text-2xl text-emerald-400 font-bold">
              Loading your Events...
            </p>
          </div>
        ) : (
          <>
            {events["past"].length > 0 || events["upcoming"].length > 0 ? (
              <>
                <Tabs defaultValue="upcoming" className="mb-8 p-2">
                  <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 dark:bg-zinc-800 rounded-lg">
                    {["upcoming", "past"].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:text-emerald-500 rounded-md"
                        onClick={() => setActiveTab(tab as EventTabs)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                <div className="space-y-4">
                  {events[activeTab].map((event: IEvent) => (
                    <Link key={event._id} href={`/events/${event._id}`}>
                      <div className="bg-emerald-100 dark:bg-zinc-800 mb-4 cursor-pointer rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:bg-emerald-300 dark:hover:bg-zinc-700 group">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-6">
                            {/* Date Column */}
                            <div className="text-center transition-all duration-300 group-hover:scale-110">
                              <div className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-slate-500 dark:group-hover:text-emerald-400">
                                {/* week day */}
                                {event.date && format(event.date, "EEE")}
                              </div>
                              <div className="text-2xl font-semibold text-emerald-500 group-hover:text-slate-600 dark:group-hover:text-emerald-300">
                                {event.date && format(event.date, "d")}
                              </div>
                            </div>

                            {/* Event Details */}
                            <div className="space-y-2">
                              <div className="font-medium text-lg group-hover:text-slate-500 dark:group-hover:text-emerald-400 transition-colors duration-300">
                                {event.title}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <MapPin className="h-4 w-4 text-emerald-500" />
                                <span>{event.venue}</span>
                              </div>
                              <div className="flex items-center gap-2"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-2xl text-emerald-400 font-bold">
                You have no upcoming or past events
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

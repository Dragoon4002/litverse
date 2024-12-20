"use client";

import { HostedEventCard } from "@/components/core";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { contract } from "@/lib/client-thirdweb";
import { IEvent } from "@/types/events";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { readContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";

// Mock data for user's events
const userEvents = [
  {
    id: 1,
    title: "Green Tech Expo 2024",
    description:
      "Explore the latest in sustainable technology and eco-friendly innovations.",
    date: new Date("2024-05-15"),
    ticketsSold: 150,
    totalTickets: 200,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    title: "Frog Conservation Workshop",
    description:
      "Learn about local frog species and how to protect their habitats.",
    date: new Date("2024-06-05"),
    ticketsSold: 45,
    totalTickets: 50,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 3,
    title: "Sustainable Living Fair",
    description:
      "Discover tips and products for a more environmentally friendly lifestyle.",
    date: new Date("2024-07-20"),
    ticketsSold: 75,
    totalTickets: 100,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 4,
    title: "Eco-Friendly Fashion Show",
    description:
      "Showcasing the latest trends in sustainable and ethical fashion.",
    date: new Date("2024-08-10"),
    ticketsSold: 200,
    totalTickets: 250,
    image: "/placeholder.svg?height=400&width=600",
  },
];

interface Events {
  upcoming: IEvent[];
  past: IEvent[];
}

type EventTabs = keyof Events;

export default function Dashboard() {
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<Events>({ upcoming: [], past: [] });
  const [activeTab, setActiveTab] = useState<EventTabs>("upcoming");

  const activeAccount = useActiveAccount();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      if (activeAccount) {
        const ids = await readContract({
          contract,
          method:
            "function getHostedEvents(address organizer) view returns (string[])",
          params: [activeAccount?.address],
        });

        console.log("client log of ids", ids);

        const { data } = await axios.post("/api/events", {
          ids,
        });

        if (data.success) {
          console.log(data);
          setEvents({ upcoming: data.upcomingEvents, past: data.pastEvents });
        } else {
          toast({ title: "No events found", variant: "destructive" });
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeAccount?.address) {
      fetchEvents();
    }
  }, [activeAccount]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-semibold mb-2 text-center text-emerald-500">
        Your Events
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-12 font-light">
        Manage and monitor your upcoming events
      </p>
      {events["upcoming"].length > 0 || events["past"].length > 0 ? (
        <>
          <div className="w-1/3">
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events[activeTab].map((event) => (
              <HostedEventCard key={event._id} event={event} />
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="text-2xl font-semibold text-emerald-500">
            No events hosted by you
          </p>
        </>
      )}
    </div>
  );
}

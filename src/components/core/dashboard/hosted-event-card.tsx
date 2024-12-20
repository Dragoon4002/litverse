"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Ticket, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import Image from "next/image";
import { IEvent } from "@/types/events";
import { useActiveAccount } from "thirdweb/react";
import { contract } from "@/lib/client-thirdweb";
import { readContract } from "thirdweb";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const HostedEventCard = ({ event }: { event: IEvent }) => {
  const [editingEvent, setEditingEvent] = useState<string>("");
  const [editedDescription, setEditedDescription] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [eventStatus, setEventStatus] = useState<any[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();

  const activeAccount = useActiveAccount();

  const handleUpdateDescription = async (id: string) => {
    try {
      setIsLoading(true);
      const { data } = await axios.post("/api/events/update", {
        id,
        description: editedDescription,
        owner: activeAccount?.address,
      });

      if (data.success) {
        toast({ title: "Success", description: data.message });
        router.refresh();
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error Occurred",
        description: "Failed to update event description",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setEditingEvent("");
      setEditedDescription("");
    }
  };

  const getEventStatus = async () => {
    try {
      if (activeAccount) {
        setIsLoading(true);
        const data = await readContract({
          contract,
          method:
            "function getEventDetails(string eventId) view returns (uint256 totalTickets, uint256 ticketPrice, uint256 remainingTickets, address eventOwner, string eventName, string eventDate, string eventLocation, string imageUrl, bool exists)",
          params: [event._id],
        });
        if (data) {
          console.log(data);
          setEventStatus([...data]);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeAccount?.address) {
      getEventStatus();
    }
  }, [activeAccount]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
      <Link href={`/events/${event._id}`}>
        <div className="relative cursor-pointer h-56 overflow-hidden">
          {" "}
          {/* Add overflow-hidden here */}
          <Image
            src={event.eventImage}
            alt={event.title}
            layout="fill"
            objectFit="cover"
            className="transition-all duration-500 group-hover:scale-105"
          />
          {/* goes up */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent transition-all duration-300" />{" "}
          {/* Ensure this is positioned correctly */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-semibold text-white mb-2">
              {event.title}
            </h2>

            {event.date && (
              <div className="flex items-center text-sm text-gray-300">
                <Calendar className="w-4 h-4 mr-2" />
                {format(event.date, "MMMM d, yyyy")}
              </div>
            )}
          </div>
        </div>
      </Link>
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 font-light">
          {event.description}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
          <div className="flex items-center">
            <Ticket className="w-4 h-4 mr-2" />
            <span className="font-light">
              {event.totalTickets - (Number(eventStatus[2]) || 0)} /{" "}
              {event.totalTickets} sold
            </span>
          </div>

          {eventStatus && (
            <div className="text-emerald-500 font-medium">
              {Math.round(
                ((event.totalTickets - (Number(eventStatus[2]) || 0)) /
                  event.totalTickets) *
                  100
              )}
              % filled
            </div>
          )}
        </div>
        <Sheet
          open={isSheetOpen && editingEvent === event._id}
          onOpenChange={(open) => {
            setIsSheetOpen(open);
            if (!open) setEditingEvent("");
          }}
        >
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full group border-gray-300 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-zinc-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300"
              onClick={() => {
                setEditingEvent(event._id);
                setEditedDescription(event.description);
              }}
            >
              <Edit2 className="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100" />
              <span className="font-light">Update Description</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[50vw] sm:w-[540px] overflow-y-auto flex flex-col">
            <SheetHeader>
              <SheetTitle className="text-2xl font-light text-gray-800 dark:text-gray-200">
                Edit Event Description
              </SheetTitle>
              <SheetDescription className="font-light text-gray-600 dark:text-gray-400">
                Update the description for {event.title}
              </SheetDescription>
            </SheetHeader>
            <div className="flex-grow overflow-y-auto">
              <div className="grid gap-4 py-4">
                <Textarea
                  id="description"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="font-light bg-gray-50 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-zinc-600 min-h-[200px]"
                />
              </div>
            </div>
            <Button
              disabled={isLoading}
              onClick={() => handleUpdateDescription(event._id)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-light mt-4"
            >
              Save Changes
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default HostedEventCard;

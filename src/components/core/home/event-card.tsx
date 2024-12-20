import { format } from "date-fns";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaEthereum } from "react-icons/fa";

const EventCard = ({ event }: any) => {
  return (
    <Link href={`/events/${event._id}`}>
      <div className="cursor-pointer rounded-2xl bg-white dark:bg-zinc-800 p-6 shadow-lg dark:shadow-zinc-800/50 hover:shadow-xl dark:hover:shadow-zinc-700/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 group">
        <div className="aspect-square mb-4 rounded-xl bg-gray-200 dark:bg-zinc-700 overflow-hidden">
          {!event.eventImage && (
            <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-cyan-400 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
          )}
          {event.eventImage && (
            <div className="w-full h-full relative">
              <img
                src={event.eventImage}
                alt="eventImage"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {event.title}
        </h3>

        <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-zinc-400">
          <span className="flex items-center group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            <Calendar className="mr-2 h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            {format(event.date, "MMMM d, yyyy")}
          </span>
          <span className="flex items-center group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            <FaEthereum className="mr-2 h-4 w-4 text-emerald-500 dark:text-emerald-400" />

            {event.ticketPrice}
          </span>
          <span className="flex items-center group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            <MapPin className="mr-2 h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            {event.venue}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;

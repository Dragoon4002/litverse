import Image from "next/image";
import { Calendar, MapPin, ExternalLink, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";

import Link from "next/link";
import { getSingleEvent } from "@/lib/db-operation";
import { TicketStatus } from "@/components/core";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eventData = await getSingleEvent(id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="grid md:grid-cols-[1fr,1.5fr] gap-8">
        {/* Left Column - Image and Registration Info */}
        <div className="space-y-6">
          <div className="aspect-square relative rounded-2xl overflow-hidden">
            <Image
              src={eventData.eventImage}
              alt={eventData.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Hosted By
            </h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{eventData.owner.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Event Host
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{`${eventData.owner.slice(
                  0,
                  6
                )}...${eventData.owner.slice(-4)}`}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Event Details
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Price:</span>
                <span className="font-medium">{eventData.ticketPrice} ETH</span>
              </div>
              {/* <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Available Tickets:
                </span>
                <span className="font-medium">
                  {eventData.availableTickets}
                </span>
              </div> */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Total Tickets:
                </span>
                <span className="font-medium">{eventData.totalTickets}</span>
              </div>
            </div>
          </div>

          <TicketStatus id={id} value={eventData.ticketPrice || 0.01} />
        </div>

        {/* Right Column - Event Details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-indigo-900 dark:text-indigo-100">
            {eventData.title}
          </h1>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Calendar className="w-5 h-5" />
              <div>
                <div className="font-medium">
                  {eventData.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <MapPin className="w-5 h-5 mt-1" />
              <div>
                <div className="font-medium">{eventData.venue}</div>
              </div>
            </div>

            {eventData.website && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Globe className="w-5 h-5" />
                <Link
                  href={`https://${eventData.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {eventData.website}
                </Link>
              </div>
            )}
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{eventData.description}</ReactMarkdown>
          </div>

          <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <div>Created: {eventData.createdAt.toLocaleString()}</div>
            <div>Last Updated: {eventData.updatedAt.toLocaleString()}</div>
            <div className="flex items-center gap-2">
              <span>Transaction:</span>
              <Link
                href={`https://sepolia.lineascan.build/tx/${eventData.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              >
                {`${eventData.transactionHash.slice(
                  0,
                  6
                )}...${eventData.transactionHash.slice(-4)}`}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

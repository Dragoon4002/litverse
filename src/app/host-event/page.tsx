"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import { useActiveAccount, useConnect } from "thirdweb/react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import mongoose from "mongoose";
import { prepareContractCall, sendTransaction, toWei } from "thirdweb";
import { contract } from "@/lib/client-thirdweb";
import Link from "next/link";
import { ToastAction } from "@/components/ui/toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

type Config = {
  title: string;
  website: string;
  ticketPrice: number;
  tickets: number;
  venue: string;
};

export default function HostEventPage() {
  const [description, setDescription] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const activeAccount = useActiveAccount();
  const router = useRouter();
  const { isConnecting } = useConnect();
  const [config, setConfig] = useState<Config>({
    title: "",
    website: "",
    ticketPrice: 0,
    tickets: 0,
    venue: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<Date>();

  const createEvent = async () => {
    try {
      setLoading(true);
      if (
        !config?.title ||
        !description ||
        !config?.venue ||
        !activeAccount?.address ||
        !config?.ticketPrice ||
        !config?.tickets ||
        !date
      ) {
        toast({
          title: "Title, description, ticket number, ticket price is mandatory",
        });
      } else {
        const event_id = new mongoose.Types.ObjectId();

        const transaction = await prepareContractCall({
          contract,
          method:
            "function createEvent(string eventId, uint256 totalTickets, uint256 ticketPrice, string eventName, string eventDate, string eventLocation, string imageUrl)",
          params: [
            event_id.toString(),
            BigInt(config?.tickets),
            toWei(config?.ticketPrice.toString()),
            config.title,
            date.toISOString(),
            config.venue,
            imageUrl,
          ],
        });

        const { transactionHash } = await sendTransaction({
          transaction,
          account: activeAccount,
        });

        if (transactionHash) {
          const { data } = await axios.post("/api/events/host", {
            title: config.title,
            _id: event_id,
            website: config?.website,
            eventImage: imageUrl,
            ticketPrice: config?.ticketPrice,
            totalTickets: config?.tickets,
            venue: config?.venue,
            description: description,
            owner: activeAccount?.address,
            transactionHash,
            date,
          });
          if (!data?.success) {
            toast({
              variant: "destructive",
              title: "Error Occurred",
              description: data?.message,
            });
          } else {
            toast({
              title: "Event Created Successfully",
              description: data?.message,
              action: (
                <ToastAction altText={"transactionHash"}>
                  <Link
                    href={`https://testnet.bscscan.com/tx/${transactionHash}`}
                    target="_blank"
                  >
                    View
                  </Link>
                </ToastAction>
              ),
            });
            router.push("/");
          }
        } else {
          toast({ title: "Transaction could not be processed" });
        }
      }
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        description: error?.message || "Error while creating event",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!activeAccount && !isConnecting) {
      router.push("/");
    }
  }, [activeAccount, isConnecting]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              Host an Event
            </CardTitle>
            <CardDescription>
              Fill in the details to create your event on FrogHub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={config?.title}
                  onChange={(e) =>
                    setConfig({ ...config, title: e.target.value || "" })
                  }
                  placeholder="Enter event title"
                  className="bg-white dark:bg-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Event Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={config?.website}
                  onChange={(e) =>
                    setConfig({ ...config, website: e.target.value })
                  }
                  placeholder="https://your-event-website.com"
                  className="bg-white dark:bg-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Event Image</Label>
                {imageUrl.length == 0 ? (
                  <UploadDropzone
                    endpoint={"imageUploader"}
                    appearance={{
                      container: {
                        border: "2px dashed #ccc",
                      },
                    }}
                    onClientUploadComplete={(res) => {
                      setImageUrl(res[0].url);
                    }}
                    onUploadError={(error: Error) => {
                      console.log(error);
                      alert("Error occurred");
                    }}
                  />
                ) : (
                  <Image
                    src={imageUrl}
                    alt="my-image"
                    height={300}
                    width={500}
                  />
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="ticketPrice">Ticket Price</Label>
                  <Input
                    id="ticketPrice"
                    type="number"
                    value={config?.ticketPrice}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        ticketPrice: Number(e.target.value),
                      })
                    }
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-white dark:bg-zinc-800"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="numTickets">Number of Tickets</Label>
                  <Input
                    id="numTickets"
                    value={config?.tickets}
                    onChange={(e) =>
                      setConfig({ ...config, tickets: Number(e.target.value) })
                    }
                    type="number"
                    min="1"
                    placeholder="100"
                    className="bg-white dark:bg-zinc-800"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="eventDate">Event Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "bg-white dark:bg-zinc-800",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  value={config?.venue}
                  onChange={(e) =>
                    setConfig({ ...config, venue: e.target.value })
                  }
                  placeholder="Enter event venue"
                  className="bg-white dark:bg-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={previewMode ? "outline" : "default"}
                    onClick={() => setPreviewMode(false)}
                  >
                    Write
                  </Button>
                  <Button
                    type="button"
                    variant={previewMode ? "default" : "outline"}
                    onClick={() => setPreviewMode(true)}
                  >
                    Preview
                  </Button>
                </div>
                {previewMode ? (
                  <Card className="mt-2 p-4 max-w-none bg-white dark:bg-zinc-800">
                    <div className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown>{description}</ReactMarkdown>
                    </div>
                  </Card>
                ) : (
                  <Textarea
                    id="description"
                    placeholder="Write your event description here (Markdown supported)"
                    className="min-h-[200px] bg-white dark:bg-zinc-800"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button disabled={loading} onClick={createEvent} className="w-full">
              Create Event
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

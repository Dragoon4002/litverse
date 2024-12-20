import Event from "@/models/events.model";
import { dbConnect } from "./connect";

export async function fetchEvents() {
  await dbConnect();
  const events = await Event.find().sort({ createdAt: -1 });
  return events;
}

export async function getSingleEvent(id: string) {
  await dbConnect();
  const event = await Event.findById(id);
  return event;
}

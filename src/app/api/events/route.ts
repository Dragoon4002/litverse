// app/api/events/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/connect";
import { ApiResponse, IEvent } from "@/types/events";
import Event from "@/models/events.model";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { ids }: { ids: string[] } = await req.json();

    console.log(ids);

    if (ids.length > 0) {
      const events = await Event.find({ _id: { $in: ids } });

      const currentDate = new Date();
      const upcomingEvents: IEvent[] = [];
      const pastEvents: IEvent[] = [];

      events.forEach((event) => {
        const eventDate = new Date(event.date); // Assuming event.date is a valid date string
        if (eventDate >= currentDate) {
          upcomingEvents.push(event);
        } else {
          pastEvents.push(event);
        }
      });
      return NextResponse.json(
        {
          success: true,
          upcomingEvents,
          pastEvents,
          message: "Events fetched and categorized successfully",
        },
        { status: 200 } // Changed to 200 for successful fetch
      );
    } else {
      return Response.json({
        success: true,
        message: "No events found",
        upcomingEvents: [],
        pastEvents: [],
      });
    }
  } catch (error: any) {
    const response: ApiResponse<null> = {
      success: false,
      error: error.message,
    };

    return NextResponse.json(response, { status: 400 });
  }
}

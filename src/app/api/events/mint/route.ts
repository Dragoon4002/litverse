import { dbConnect } from "@/lib/connect";
import Event from "@/models/events.model";
import { ApiResponse } from "@/types/events";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: id, availableTickets: { $gt: 0 } },
      { $inc: { availableTickets: -1 } },
      { new: true }
    );

    if (!updatedEvent) {
      const response: ApiResponse<null> = {
        success: false,
        message: "No tickets available or event not found.",
      };
      return Response.json(response, { status: 404 });
    }

    const response: ApiResponse<typeof updatedEvent> = {
      success: true,
      data: updatedEvent,
    };
    return Response.json(response, { status: 200 });
  } catch (error: any) {
    const response: ApiResponse<null> = {
      success: false,
      error: error.message,
    };

    return Response.json(response, { status: 400 });
  }
}

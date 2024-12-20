import { dbConnect } from "@/lib/connect";
import Event from "@/models/events.model";
import { ApiResponse } from "@/types/events";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { id, description } = await req.json();

    // Update the description of the event
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: id },
      { description },
      { new: true }
    );

    if (!updatedEvent) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Event not found.",
      };
      return Response.json(response, { status: 404 });
    }

    const response: ApiResponse<typeof updatedEvent> = {
      success: true,
      message: `Event description updated successfully.`,
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

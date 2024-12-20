import { dbConnect } from "@/lib/connect";
import Event from "@/models/events.model";
import { ApiResponse } from "@/types/events";

export async function GET(
  _req: Request,
  _res: Response,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const id = params.id;
    const event = await Event.findById(id);

    if (event) {
      return Response.json(
        { success: true, event, message: "Event found" },
        { status: 201 }
      );
    } else {
      return Response.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }
  } catch (error: any) {
    const response: ApiResponse<null> = {
      success: false,
      error: error.message,
    };

    return Response.json(response, { status: 400 });
  }
}

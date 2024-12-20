import mongoose, { Schema } from "mongoose";
import { IEvent } from "@/types/events";

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    website: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(
            v
          );
        },
        message: "Please enter a valid URL",
      },
    },
    eventImage: {
      type: String,
      required: [true, "Event image is required"],
    },
    ticketPrice: {
      type: Number,
      required: [true, "Ticket price is required"],
      min: [0, "Ticket price cannot be negative"],
    },
    totalTickets: {
      type: Number,
      required: [true, "Total number of tickets is required"],
      min: [1, "Total tickets must be at least 1"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    availableTickets: {
      type: Number,
      default: 0,
    },
    owner: {
      type: String,
      required: true,
    },
    transactionHash: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Event =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);

export default Event;

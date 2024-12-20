export interface IEvent {
  _id: string;
  title: string;
  website: string;
  eventImage: string;
  ticketPrice: number;
  totalTickets: number;
  venue: string;
  description: string;
  availableTickets?: number;
  createdAt?: Date;
  updatedAt?: Date;
  owner: string;
  transactionHash?: string;
  date?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

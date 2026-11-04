export interface TicketData {
  id: string;
  ticketNo: string;
  busType: string;
  busName: string;
  seatNumber: string;
  departureTime: string;
  departureDate: string;
  passengerName: string;
  passengerPhone?: string;
  passengerCnic?: string;
  fromCity: string;
  toCity: string;
  fare: number;
  discount: number;
  totalFare: number;
  issueDate: string;
  issuedBy: string;
  reportingTime: string;
  status: 'confirmed' | 'cancelled';
}

export interface RoutePreset {
  from: string;
  to: string;
  defaultFare: number;
  estimatedHours: string;
}

export type Language = 'en' | 'ur';

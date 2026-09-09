import type { BarberService } from "./public.types";

export interface AvailableBookingDate {
  date: string;
  weekday: string;
  dayNumber: string;
  month: string;
  available: boolean;
  reason?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingClientData {
  name: string;
  phone: string;
  comment: string;
}

export interface CreateAppointmentInput {
  service: BarberService;
  date: string;
  time: string;
  client: BookingClientData;
}

export interface CreatedAppointment {
  id: string;
  service: BarberService;
  date: string;
  time: string;
  client: BookingClientData;
}

export type BookingStep =
  | "service"
  | "date"
  | "time"
  | "details"
  | "review";
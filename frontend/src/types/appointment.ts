export type AppointmentStatus =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "COMPLETADO"
  | "CANCELADO";

export interface Appointment {
  id: number;

  clientId: number;
  serviceId: number;

  date: string;
  time: string;

  client: string;
  phone: string;

  service: string;

  duration: number;
  price: number;

  status: AppointmentStatus;
}

export type AppointmentFormData = Omit<
  Appointment,
  "id"
>;
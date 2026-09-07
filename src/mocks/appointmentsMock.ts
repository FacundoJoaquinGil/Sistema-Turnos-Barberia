import type { Appointment } from "../types/appointment";

import { addDays } from "../utils/addDays";

const today = new Date();

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export const appointmentsMock: Appointment[] = [
  {
    id: 1,
    clientId: 1,
    serviceId: 1,
    date: formatDateKey(today),
    time: "09:00",
    client: "Martín Pérez",
    phone: "381 555-1201",
    service: "Corte clásico",
    duration: 45,
    price: 9000,
    status: "COMPLETADO",
  },
  {
    id: 2,
    clientId: 2,
    serviceId: 2,
    date: formatDateKey(today),
    time: "10:00",
    client: "Lautaro Gómez",
    phone: "381 555-1202",
    service: "Corte + Barba",
    duration: 60,
    price: 13000,
    status: "COMPLETADO",
  },
  {
    id: 3,
    clientId: 3,
    serviceId: 3,
    date: formatDateKey(today),
    time: "11:30",
    client: "Nicolás Ruiz",
    phone: "381 555-1203",
    service: "Corte degradado",
    duration: 45,
    price: 10000,
    status: "CONFIRMADO",
  },
  {
    id: 4,
    clientId: 4,
    serviceId: 4,
    date: formatDateKey(today),
    time: "13:00",
    client: "Franco Díaz",
    phone: "381 555-1204",
    service: "Barba",
    duration: 30,
    price: 6000,
    status: "PENDIENTE",
  },
  {
    id: 5,
    clientId: 5,
    serviceId: 5,
    date: formatDateKey(today),
    time: "15:00",
    client: "Lucas Herrera",
    phone: "381 555-1205",
    service: "Corte clásico",
    duration: 45,
    price: 9000,
    status: "CONFIRMADO",
  },
  {
    id: 6,
    clientId: 6,
    serviceId: 6,
    date: formatDateKey(
      addDays(today, 1),
    ),
    time: "10:00",
    client: "Agustín López",
    phone: "381 555-1206",
    service: "Corte + Barba",
    duration: 60,
    price: 13000,
    status: "CONFIRMADO",
  },
];
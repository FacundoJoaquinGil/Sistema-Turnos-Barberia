import type { Appointment } from "../types/appointment";

import { addDays } from "../utils/addDays";

const today = new Date();

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const previousMonthDate = (
  day: number,
) => {
  return new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    day,
  );
};

export const appointmentsMock: Appointment[] = [
  // =====================================================
  // MES ANTERIOR
  // Sirven para comparar facturación mensual
  // =====================================================

  {
    id: 1,
    clientId: 1,
    serviceId: 1,
    date: formatDateKey(
      previousMonthDate(5),
    ),
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
    date: formatDateKey(
      previousMonthDate(8),
    ),
    time: "10:30",
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
    date: formatDateKey(
      previousMonthDate(12),
    ),
    time: "16:00",
    client: "Nicolás Ruiz",
    phone: "381 555-1203",
    service: "Corte degradado",
    duration: 45,
    price: 10000,
    status: "COMPLETADO",
  },

  {
    id: 4,
    clientId: 4,
    serviceId: 4,
    date: formatDateKey(
      previousMonthDate(18),
    ),
    time: "18:00",
    client: "Franco Díaz",
    phone: "381 555-1204",
    service: "Barba",
    duration: 30,
    price: 6000,
    status: "COMPLETADO",
  },

  {
    id: 5,
    clientId: 5,
    serviceId: 1,
    date: formatDateKey(
      previousMonthDate(23),
    ),
    time: "11:00",
    client: "Lucas Herrera",
    phone: "381 555-1205",
    service: "Corte clásico",
    duration: 45,
    price: 9000,
    status: "COMPLETADO",
  },

  {
    id: 6,
    clientId: 6,
    serviceId: 2,
    date: formatDateKey(
      previousMonthDate(27),
    ),
    time: "15:00",
    client: "Agustín López",
    phone: "381 555-1206",
    service: "Corte + Barba",
    duration: 60,
    price: 13000,
    status: "CANCELADO",
  },

  // =====================================================
  // ÚLTIMOS 7 DÍAS
  // Sirven para alimentar el gráfico de facturación
  // =====================================================

  {
    id: 7,
    clientId: 7,
    serviceId: 1,
    date: formatDateKey(
      addDays(today, -6),
    ),
    time: "09:00",
    client: "Tomás Medina",
    phone: "381 555-1207",
    service: "Corte clásico",
    duration: 45,
    price: 9000,
    status: "COMPLETADO",
  },

  {
    id: 8,
    clientId: 8,
    serviceId: 2,
    date: formatDateKey(
      addDays(today, -5),
    ),
    time: "10:00",
    client: "Matías Romero",
    phone: "381 555-1208",
    service: "Corte + Barba",
    duration: 60,
    price: 13000,
    status: "COMPLETADO",
  },

  {
    id: 9,
    clientId: 9,
    serviceId: 1,
    date: formatDateKey(
      addDays(today, -5),
    ),
    time: "15:30",
    client: "Facundo Torres",
    phone: "381 555-1209",
    service: "Corte clásico",
    duration: 45,
    price: 9000,
    status: "COMPLETADO",
  },

  {
    id: 10,
    clientId: 10,
    serviceId: 3,
    date: formatDateKey(
      addDays(today, -4),
    ),
    time: "11:00",
    client: "Bruno Sánchez",
    phone: "381 555-1210",
    service: "Corte degradado",
    duration: 45,
    price: 10000,
    status: "COMPLETADO",
  },

  {
    id: 11,
    clientId: 11,
    serviceId: 4,
    date: formatDateKey(
      addDays(today, -3),
    ),
    time: "16:00",
    client: "Santiago Paz",
    phone: "381 555-1211",
    service: "Barba",
    duration: 30,
    price: 6000,
    status: "COMPLETADO",
  },

  {
    id: 12,
    clientId: 12,
    serviceId: 2,
    date: formatDateKey(
      addDays(today, -3),
    ),
    time: "18:00",
    client: "Ramiro Vega",
    phone: "381 555-1212",
    service: "Corte + Barba",
    duration: 60,
    price: 13000,
    status: "COMPLETADO",
  },

  {
    id: 13,
    clientId: 13,
    serviceId: 1,
    date: formatDateKey(
      addDays(today, -2),
    ),
    time: "10:00",
    client: "Emiliano Rojas",
    phone: "381 555-1213",
    service: "Corte clásico",
    duration: 45,
    price: 9000,
    status: "COMPLETADO",
  },

  {
    id: 14,
    clientId: 14,
    serviceId: 3,
    date: formatDateKey(
      addDays(today, -1),
    ),
    time: "09:30",
    client: "Joaquín Molina",
    phone: "381 555-1214",
    service: "Corte degradado",
    duration: 45,
    price: 10000,
    status: "COMPLETADO",
  },

  {
    id: 15,
    clientId: 15,
    serviceId: 1,
    date: formatDateKey(
      addDays(today, -1),
    ),
    time: "14:30",
    client: "Ignacio Cruz",
    phone: "381 555-1215",
    service: "Corte clásico",
    duration: 45,
    price: 9000,
    status: "CANCELADO",
  },

  // =====================================================
  // HOY
  // Mezclamos distintos estados
  // =====================================================

  {
    id: 16,
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
    id: 17,
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
    id: 18,
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
    id: 19,
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
    id: 20,
    clientId: 5,
    serviceId: 1,
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
    id: 21,
    clientId: 6,
    serviceId: 2,
    date: formatDateKey(today),
    time: "17:00",
    client: "Agustín López",
    phone: "381 555-1206",
    service: "Corte + Barba",
    duration: 60,
    price: 13000,
    status: "CANCELADO",
  },

  // =====================================================
  // PRÓXIMOS DÍAS
  // Sirven para agenda y turnos futuros
  // =====================================================

  {
    id: 22,
    clientId: 7,
    serviceId: 2,
    date: formatDateKey(
      addDays(today, 1),
    ),
    time: "10:00",
    client: "Tomás Medina",
    phone: "381 555-1207",
    service: "Corte + Barba",
    duration: 60,
    price: 13000,
    status: "CONFIRMADO",
  },

  {
    id: 23,
    clientId: 8,
    serviceId: 1,
    date: formatDateKey(
      addDays(today, 1),
    ),
    time: "12:00",
    client: "Matías Romero",
    phone: "381 555-1208",
    service: "Corte clásico",
    duration: 45,
    price: 9000,
    status: "PENDIENTE",
  },

  {
    id: 24,
    clientId: 9,
    serviceId: 3,
    date: formatDateKey(
      addDays(today, 2),
    ),
    time: "16:00",
    client: "Facundo Torres",
    phone: "381 555-1209",
    service: "Corte degradado",
    duration: 45,
    price: 10000,
    status: "CONFIRMADO",
  },

  {
    id: 25,
    clientId: 10,
    serviceId: 4,
    date: formatDateKey(
      addDays(today, 3),
    ),
    time: "18:30",
    client: "Bruno Sánchez",
    phone: "381 555-1210",
    service: "Barba",
    duration: 30,
    price: 6000,
    status: "PENDIENTE",
  },
];
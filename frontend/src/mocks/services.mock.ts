import type { BarberService } from "../types/public.types";

export const servicesMock: BarberService[] = [
  {
    id: "service-1",
    name: "Corte clásico",
    description:
      "Un corte prolijo y versátil adaptado a tu estilo y tipo de cabello.",
    price: 10000,
    durationMinutes: 30,
    active: true,
  },
  {
    id: "service-2",
    name: "Degradado",
    description:
      "Fade trabajado con precisión para conseguir una transición limpia y moderna.",
    price: 12000,
    durationMinutes: 40,
    active: true,
    featured: true,
  },
  {
    id: "service-3",
    name: "Corte + barba",
    description:
      "Servicio completo de corte, perfilado y terminación de barba.",
    price: 16000,
    durationMinutes: 60,
    active: true,
  },
  {
    id: "service-4",
    name: "Barba",
    description:
      "Perfilado, rebaje y terminación para mantener tu barba prolija.",
    price: 7000,
    durationMinutes: 25,
    active: true,
  },
  {
    id: "service-5",
    name: "Corte infantil",
    description:
      "Corte pensado para los más chicos, realizado de manera cómoda y rápida.",
    price: 9000,
    durationMinutes: 30,
    active: true,
  },
  {
    id: "service-6",
    name: "Perfilado premium",
    description:
      "Perfilado detallado con terminaciones especiales.",
    price: 8000,
    durationMinutes: 25,
    active: false,
  },
];
import type { Service } from "../types/service";

export const servicesMock: Service[] = [
  {
    id: 1,
    name: "Corte clásico",
    description:
      "Corte tradicional adaptado al estilo del cliente.",
    duration: 45,
    price: 9000,
    isActive: true,
    createdAt: "2026-07-01",
  },
  {
    id: 2,
    name: "Corte degradado",
    description:
      "Corte con degradado y terminaciones detalladas.",
    duration: 45,
    price: 10000,
    isActive: true,
    createdAt: "2026-07-01",
  },
  {
    id: 3,
    name: "Barba",
    description:
      "Perfilado, recorte y terminación de barba.",
    duration: 30,
    price: 6000,
    isActive: true,
    createdAt: "2026-07-01",
  },
  {
    id: 4,
    name: "Corte + Barba",
    description:
      "Servicio completo de corte de cabello y barba.",
    duration: 60,
    price: 13000,
    isActive: true,
    createdAt: "2026-07-01",
  },
];
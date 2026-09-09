import type { Client } from "../types/client";

export const clientsMock: Client[] = [
  {
    id: 1,
    name: "Martín Pérez",
    phone: "381 555-1201",
    notes: "Prefiere corte clásico.",
    createdAt: "2026-07-12",
  },
  {
    id: 2,
    name: "Lautaro Gómez",
    phone: "381 555-1202",
    notes: "Suele reservar corte + barba.",
    createdAt: "2026-07-18",
  },
  {
    id: 3,
    name: "Nicolás Ruiz",
    phone: "381 555-1203",
    notes: "",
    createdAt: "2026-08-02",
  },
  {
    id: 4,
    name: "Franco Díaz",
    phone: "381 555-1204",
    notes: "Cliente frecuente.",
    createdAt: "2026-08-10",
  },
  {
    id: 5,
    name: "Lucas Herrera",
    phone: "381 555-1205",
    notes: "",
    createdAt: "2026-08-15",
  },
  {
    id: 6,
    name: "Agustín López",
    phone: "381 555-1206",
    notes: "",
    createdAt: "2026-08-25",
  },
];
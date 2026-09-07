import type { DayAvailability } from "../types/availability";

export const weeklyAvailabilityMock: DayAvailability[] = [
  {
    day: "MONDAY",
    label: "Lunes",
    isOpen: true,
    startTime: "09:00",
    endTime: "18:00",
  },
  {
    day: "TUESDAY",
    label: "Martes",
    isOpen: true,
    startTime: "09:00",
    endTime: "18:00",
  },
  {
    day: "WEDNESDAY",
    label: "Miércoles",
    isOpen: true,
    startTime: "09:00",
    endTime: "18:00",
  },
  {
    day: "THURSDAY",
    label: "Jueves",
    isOpen: true,
    startTime: "09:00",
    endTime: "18:00",
  },
  {
    day: "FRIDAY",
    label: "Viernes",
    isOpen: true,
    startTime: "09:00",
    endTime: "18:00",
  },
  {
    day: "SATURDAY",
    label: "Sábado",
    isOpen: true,
    startTime: "09:00",
    endTime: "14:00",
  },
  {
    day: "SUNDAY",
    label: "Domingo",
    isOpen: false,
    startTime: "09:00",
    endTime: "14:00",
  },
];
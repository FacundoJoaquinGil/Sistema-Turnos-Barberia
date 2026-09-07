import type { Appointment } from "../types/appointment";

import type {
  BlockedPeriod,
  DayAvailability,
  WeekDay,
} from "../types/availability";

interface GetAvailableSlotsParams {
  date: string;
  duration: number;
  slotInterval: number;

  weeklySchedule: DayAvailability[];

  blockedDates: string[];

  blockedPeriods: BlockedPeriod[];

  appointments: Appointment[];

  excludeAppointmentId?: number;
}

const weekDays: WeekDay[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const timeToMinutes = (
  time: string,
) => {
  const [hours, minutes] = time
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
};

const minutesToTime = (
  minutes: number,
) => {
  const hours = Math.floor(
    minutes / 60,
  );

  const mins = minutes % 60;

  return `${String(hours).padStart(
    2,
    "0",
  )}:${String(mins).padStart(2, "0")}`;
};

const rangesOverlap = (
  startA: number,
  endA: number,
  startB: number,
  endB: number,
) => {
  return (
    startA < endB &&
    endA > startB
  );
};

const formatDateKey = (
  date: Date,
) => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getAvailableSlots = ({
  date,
  duration,
  slotInterval,
  weeklySchedule,
  blockedDates,
  blockedPeriods,
  appointments,
  excludeAppointmentId,
}: GetAvailableSlotsParams) => {
  if (
    !date ||
    duration <= 0
  ) {
    return [];
  }

  const now = new Date();

  const todayKey =
    formatDateKey(now);

  // No permitir turnos en fechas pasadas
  if (date < todayKey) {
    return [];
  }

  // Día completamente bloqueado
  if (
    blockedDates.includes(date)
  ) {
    return [];
  }

  const dateObject = new Date(
    `${date}T00:00:00`,
  );

  const weekDay =
    weekDays[dateObject.getDay()];

  const dayAvailability =
    weeklySchedule.find(
      (item) =>
        item.day === weekDay,
    );

  if (
    !dayAvailability ||
    !dayAvailability.isOpen
  ) {
    return [];
  }

  const openingMinutes =
    timeToMinutes(
      dayAvailability.startTime,
    );

  const closingMinutes =
    timeToMinutes(
      dayAvailability.endTime,
    );

  const dayAppointments =
    appointments.filter(
      (appointment) =>
        appointment.date === date &&
        appointment.status !==
          "CANCELADO" &&
        appointment.id !==
          excludeAppointmentId,
    );

  const dayBlockedPeriods =
    blockedPeriods.filter(
      (period) =>
        period.date === date,
    );

  const availableSlots: string[] =
    [];

  for (
    let start = openingMinutes;
    start + duration <=
    closingMinutes;
    start += slotInterval
  ) {
    const end = start + duration;

    // Evitar horarios pasados del día actual
    if (date === todayKey) {
      const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes();

      if (start <= currentMinutes) {
        continue;
      }
    }

    const conflictsWithAppointment =
      dayAppointments.some(
        (appointment) => {
          const appointmentStart =
            timeToMinutes(
              appointment.time,
            );

          const appointmentEnd =
            appointmentStart +
            appointment.duration;

          return rangesOverlap(
            start,
            end,
            appointmentStart,
            appointmentEnd,
          );
        },
      );

    if (
      conflictsWithAppointment
    ) {
      continue;
    }

    const conflictsWithBlockedPeriod =
      dayBlockedPeriods.some(
        (period) => {
          const blockedStart =
            timeToMinutes(
              period.startTime,
            );

          const blockedEnd =
            timeToMinutes(
              period.endTime,
            );

          return rangesOverlap(
            start,
            end,
            blockedStart,
            blockedEnd,
          );
        },
      );

    if (
      conflictsWithBlockedPeriod
    ) {
      continue;
    }

    availableSlots.push(
      minutesToTime(start),
    );
  }

  return availableSlots;
};
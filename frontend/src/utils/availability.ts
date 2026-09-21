import type { AppointmentStatus } from "../types/appointment";

import type {
  BlockedPeriod,
  DayAvailability,
  WeekDay,
} from "../types/availability";

type AvailabilityAppointment = {
  id?: number;

  date: string;
  time: string;
  duration: number;
  status: AppointmentStatus;
};

interface GetAvailableSlotsParams {
  date: string;
  serviceDuration: number;

  slotInterval: number;
  weeklySchedule: DayAvailability[];
  blockedDates: string[];
  blockedPeriods: BlockedPeriod[];

  appointments: AvailabilityAppointment[];

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
  totalMinutes: number,
) => {
  const hours = Math.floor(
    totalMinutes / 60,
  );

  const minutes =
    totalMinutes % 60;

  return `${String(hours).padStart(
    2,
    "0",
  )}:${String(minutes).padStart(
    2,
    "0",
  )}`;
};

const intervalsOverlap = (
  firstStart: number,
  firstEnd: number,
  secondStart: number,
  secondEnd: number,
) => {
  return (
    firstStart < secondEnd &&
    firstEnd > secondStart
  );
};

const getLocalDateKey = (
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
  serviceDuration,
  weeklySchedule,
  slotInterval,
  blockedDates,
  blockedPeriods,
  appointments,
  excludeAppointmentId,
}: GetAvailableSlotsParams) => {
  if (
    !date ||
    serviceDuration <= 0 ||
    slotInterval <= 0
  ) {
    return [];
  }

  /*
   * 1. No permitir fechas anteriores
   * al día actual.
   */
  const now = new Date();

  const todayKey =
    getLocalDateKey(now);

  if (date < todayKey) {
    return [];
  }

  /*
   * 2. Si el día completo está
   * bloqueado, no existen horarios.
   */
  if (
    blockedDates.includes(date)
  ) {
    return [];
  }

  /*
   * Importante:
   * T00:00 evita problemas de zona
   * horaria al obtener getDay().
   */
  const selectedDate =
    new Date(`${date}T00:00:00`);

  const weekDay =
    weekDays[
      selectedDate.getDay()
    ];

  /*
   * 3. Obtener el horario semanal
   * correspondiente.
   */
  const daySchedule =
    weeklySchedule.find(
      (day) =>
        day.day === weekDay,
    );

  if (
    !daySchedule ||
    !daySchedule.isOpen
  ) {
    return [];
  }

  const workStart =
    timeToMinutes(
      daySchedule.startTime,
    );

  const workEnd =
    timeToMinutes(
      daySchedule.endTime,
    );

  if (workStart >= workEnd) {
    return [];
  }

  /*
   * 4. Bloqueos parciales
   * únicamente de esta fecha.
   */
  const dateBlockedPeriods =
    blockedPeriods.filter(
      (period) =>
        period.date === date,
    );

  /*
   * 5. Turnos existentes de esta
   * fecha.
   *
   * Los CANCELADO no ocupan lugar.
   */
  const dateAppointments =
  appointments.filter(
    (appointment) =>
      appointment.date === date &&
      appointment.status !==
        "CANCELADO" &&
      appointment.id !==
        excludeAppointmentId,
  );

  const availableSlots: string[] =
    [];

  /*
   * 6. Generar posibles horarios
   * utilizando slotInterval.
   */
  for (
    let slotStart = workStart;
    slotStart + serviceDuration <=
    workEnd;
    slotStart += slotInterval
  ) {
    const slotEnd =
      slotStart +
      serviceDuration;

    /*
     * 7. Si estamos viendo hoy,
     * eliminar horarios que ya
     * pasaron.
     */
    if (date === todayKey) {
      const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes();

      if (
        slotStart <=
        currentMinutes
      ) {
        continue;
      }
    }

    /*
     * 8. Verificar períodos
     * bloqueados.
     */
    const overlapsBlockedPeriod =
      dateBlockedPeriods.some(
        (period) => {
          const blockedStart =
            timeToMinutes(
              period.startTime,
            );

          const blockedEnd =
            timeToMinutes(
              period.endTime,
            );

          return intervalsOverlap(
            slotStart,
            slotEnd,
            blockedStart,
            blockedEnd,
          );
        },
      );

    if (
      overlapsBlockedPeriod
    ) {
      continue;
    }

    /*
     * 9. Verificar turnos ya
     * existentes.
     */
    const overlapsAppointment =
      dateAppointments.some(
        (appointment) => {
          const appointmentStart =
            timeToMinutes(
              appointment.time,
            );

          const appointmentEnd =
            appointmentStart +
            appointment.duration;

          return intervalsOverlap(
            slotStart,
            slotEnd,
            appointmentStart,
            appointmentEnd,
          );
        },
      );

    if (
      overlapsAppointment
    ) {
      continue;
    }

    availableSlots.push(
      minutesToTime(
        slotStart,
      ),
    );
  }

  return availableSlots;
};
import { weeklyAvailabilityMock } from "../mocks/availability.mock";
import { servicesMock } from "../mocks/services.mock";

import type {
  AvailableBookingDate,
  CreateAppointmentInput,
  CreatedAppointment,
  TimeSlot,
} from "../types/booking.types";

import type { BarberService } from "../types/public.types";

const MOCK_DELAY = 350;

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

const formatDateToISO = (
  date: Date,
): string => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const timeToMinutes = (
  time: string,
): number => {
  const [hours, minutes] = time
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
};

const minutesToTime = (
  minutes: number,
): string => {
  const hours = Math.floor(minutes / 60);

  const remainingMinutes =
    minutes % 60;

  return `${String(hours).padStart(
    2,
    "0",
  )}:${String(remainingMinutes).padStart(
    2,
    "0",
  )}`;
};

const getMockOccupiedTimes = (
  date: string,
): string[] => {
  const parsedDate = new Date(
    `${date}T00:00:00`,
  );

  const day = parsedDate.getDate();

  if (day % 3 === 0) {
    return [
      "09:30",
      "11:00",
      "15:30",
      "17:00",
    ];
  }

  if (day % 3 === 1) {
    return [
      "10:00",
      "12:30",
      "16:00",
      "18:00",
    ];
  }

  return [
    "09:00",
    "13:00",
    "17:30",
  ];
};

const isPastTime = (
  date: string,
  time: string,
): boolean => {
  const today = new Date();

  if (
    formatDateToISO(today) !== date
  ) {
    return false;
  }

  const currentMinutes =
    today.getHours() * 60 +
    today.getMinutes();

  return (
    timeToMinutes(time) <=
    currentMinutes
  );
};

export const getBookableServices =
  async (): Promise<BarberService[]> => {
    await wait(MOCK_DELAY);

    return servicesMock.filter(
      (service) => service.active,
    );
  };

export const getAvailableBookingDates =
  async (): Promise<
    AvailableBookingDate[]
  > => {
    await wait(MOCK_DELAY);

    const dates: AvailableBookingDate[] =
      [];

    const today = new Date();

    for (
      let offset = 0;
      offset < 14;
      offset += 1
    ) {
      const currentDate = new Date(today);

      currentDate.setDate(
        today.getDate() + offset,
      );

      const weekday =
        currentDate.getDay();

      const isWorkingDay =
        weeklyAvailabilityMock[
          weekday
        ] !== null;

      /*
       * Simulamos una fecha bloqueada por el barbero.
       * Después esto vendrá de blocked_dates.
       */
      const isMockBlockedDate =
        offset === 7;

      const available =
        isWorkingDay &&
        !isMockBlockedDate;

      dates.push({
        date: formatDateToISO(
          currentDate,
        ),

        weekday:
          new Intl.DateTimeFormat(
            "es-AR",
            {
              weekday: "short",
            },
          ).format(currentDate),

        dayNumber: String(
          currentDate.getDate(),
        ),

        month:
          new Intl.DateTimeFormat(
            "es-AR",
            {
              month: "short",
            },
          ).format(currentDate),

        available,

        reason: !isWorkingDay
          ? "Cerrado"
          : isMockBlockedDate
            ? "No disponible"
            : undefined,
      });
    }

    return dates;
  };

export const getAvailableTimeSlots =
  async (
    date: string,
    serviceDurationMinutes: number,
  ): Promise<TimeSlot[]> => {
    await wait(MOCK_DELAY);

    const parsedDate = new Date(
      `${date}T00:00:00`,
    );

    const weekday =
      parsedDate.getDay();

    const workingHours =
      weeklyAvailabilityMock[weekday];

    if (!workingHours) {
      return [];
    }

    const startMinutes =
      timeToMinutes(
        workingHours.start,
      );

    const endMinutes =
      timeToMinutes(
        workingHours.end,
      );

    const occupiedTimes =
      getMockOccupiedTimes(date);

    const slots: TimeSlot[] = [];

    const SLOT_INTERVAL = 30;

    for (
      let currentMinutes =
        startMinutes;
      currentMinutes +
        serviceDurationMinutes <=
      endMinutes;
      currentMinutes +=
      SLOT_INTERVAL
    ) {
      const time =
        minutesToTime(
          currentMinutes,
        );

      const occupied =
        occupiedTimes.includes(
          time,
        );

      slots.push({
        time,
        available:
          !occupied &&
          !isPastTime(
            date,
            time,
          ),
      });
    }

    return slots;
  };

export const createMockAppointment =
  async (
    input: CreateAppointmentInput,
  ): Promise<CreatedAppointment> => {
    await wait(700);

    return {
      id: crypto.randomUUID(),
      ...input,
    };
  };
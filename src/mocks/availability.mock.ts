export interface WorkingHours {
  start: string;
  end: string;
}

export const weeklyAvailabilityMock: Record<
  number,
  WorkingHours | null
> = {
  0: null,
  1: {
    start: "09:00",
    end: "18:00",
  },
  2: {
    start: "09:00",
    end: "18:00",
  },
  3: {
    start: "09:00",
    end: "18:00",
  },
  4: {
    start: "09:00",
    end: "18:00",
  },
  5: {
    start: "09:00",
    end: "20:00",
  },
  6: {
    start: "09:00",
    end: "14:00",
  },
};
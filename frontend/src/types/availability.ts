export type WeekDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface DayAvailability {
  day: WeekDay;
  label: string;
  isOpen: boolean;
  startTime: string;
  endTime: string;
}

export interface BlockedPeriod {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
}

export interface BlockedPeriodFormData {
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
}

export type DayAvailabilityUpdate =
  Partial<
    Pick<
      DayAvailability,
      | "isOpen"
      | "startTime"
      | "endTime"
    >
  >;
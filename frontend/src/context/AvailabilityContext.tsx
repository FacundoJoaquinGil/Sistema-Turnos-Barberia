import {
  createContext,
  useContext,
  useState,
} from "react";

import type { ReactNode } from "react";

import { weeklyAvailabilityMock } from "../mocks/availabilityMock";

import type {
  BlockedPeriod,
  BlockedPeriodFormData,
  DayAvailability,
  WeekDay,
} from "../types/availability";

interface AvailabilityContextValue {
  weeklySchedule: DayAvailability[];

  slotInterval: number;

  blockedDates: string[];

  blockedPeriods: BlockedPeriod[];

  updateDayAvailability: (
    day: WeekDay,
    data: Partial<
      Omit<DayAvailability, "day" | "label">
    >,
  ) => void;

  updateSlotInterval: (
    interval: number,
  ) => void;

  blockDate: (date: string) => void;

  unblockDate: (date: string) => void;

  addBlockedPeriod: (
    data: BlockedPeriodFormData,
  ) => void;

  removeBlockedPeriod: (
    id: number,
  ) => void;
}

interface AvailabilityProviderProps {
  children: ReactNode;
}

const AvailabilityContext =
  createContext<AvailabilityContextValue | null>(
    null,
  );

export const AvailabilityProvider = ({
  children,
}: AvailabilityProviderProps) => {
  const [
    weeklySchedule,
    setWeeklySchedule,
  ] = useState<DayAvailability[]>(
    weeklyAvailabilityMock,
  );

  const [
    slotInterval,
    setSlotInterval,
  ] = useState(30);

  const [
    blockedDates,
    setBlockedDates,
  ] = useState<string[]>([]);

  const [
    blockedPeriods,
    setBlockedPeriods,
  ] = useState<BlockedPeriod[]>([]);

  const updateDayAvailability = (
    day: WeekDay,
    data: Partial<
      Omit<DayAvailability, "day" | "label">
    >,
  ) => {
    setWeeklySchedule((current) =>
      current.map((item) =>
        item.day === day
          ? {
              ...item,
              ...data,
            }
          : item,
      ),
    );
  };

  const updateSlotInterval = (
    interval: number,
  ) => {
    setSlotInterval(interval);
  };

  const blockDate = (
    date: string,
  ) => {
    setBlockedDates((current) => {
      if (current.includes(date)) {
        return current;
      }

      return [...current, date];
    });
  };

  const unblockDate = (
    date: string,
  ) => {
    setBlockedDates((current) =>
      current.filter(
        (item) => item !== date,
      ),
    );
  };

  const addBlockedPeriod = (
    data: BlockedPeriodFormData,
  ) => {
    const newPeriod: BlockedPeriod = {
      id: Date.now(),
      ...data,
    };

    setBlockedPeriods((current) => [
      ...current,
      newPeriod,
    ]);
  };

  const removeBlockedPeriod = (
    id: number,
  ) => {
    setBlockedPeriods((current) =>
      current.filter(
        (period) => period.id !== id,
      ),
    );
  };

  return (
    <AvailabilityContext.Provider
      value={{
        weeklySchedule,
        slotInterval,
        blockedDates,
        blockedPeriods,
        updateDayAvailability,
        updateSlotInterval,
        blockDate,
        unblockDate,
        addBlockedPeriod,
        removeBlockedPeriod,
      }}
    >
      {children}
    </AvailabilityContext.Provider>
  );
};

export const useAvailability = () => {
  const context = useContext(
    AvailabilityContext,
  );

  if (!context) {
    throw new Error(
      "useAvailability debe utilizarse dentro de AvailabilityProvider",
    );
  }

  return context;
};
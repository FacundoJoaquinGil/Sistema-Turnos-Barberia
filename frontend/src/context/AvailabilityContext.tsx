import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "../lib/supabase";

import type { Database } from "../types/database.types";

import type {
  BlockedPeriod,
  BlockedPeriodFormData,
  DayAvailability,
  DayAvailabilityUpdate,
  WeekDay,
} from "../types/availability";

type AvailabilityRow =
  Database["public"]["Tables"]["availability"]["Row"];

type BlockedPeriodRow =
  Database["public"]["Tables"]["blocked_periods"]["Row"];

interface AvailabilityContextValue {
  weeklySchedule: DayAvailability[];
  slotInterval: number;
  blockedDates: string[];
  blockedPeriods: BlockedPeriod[];

  loading: boolean;
  error: string | null;

  refreshAvailability: () => Promise<void>;

  updateDayAvailability: (
    day: WeekDay,
    updates: DayAvailabilityUpdate,
  ) => Promise<void>;

  updateSlotInterval: (
    interval: number,
  ) => Promise<void>;

  blockDate: (
    date: string,
  ) => Promise<void>;

  unblockDate: (
    date: string,
  ) => Promise<void>;

  addBlockedPeriod: (
    period: BlockedPeriodFormData,
  ) => Promise<void>;

  removeBlockedPeriod: (
    periodId: number,
  ) => Promise<void>;
}

interface AvailabilityProviderProps {
  children: ReactNode;
}

const AvailabilityContext =
  createContext<AvailabilityContextValue | null>(
    null,
  );

const dayByNumber: Record<
  number,
  {
    day: WeekDay;
    label: string;
  }
> = {
  0: {
    day: "SUNDAY",
    label: "Domingo",
  },
  1: {
    day: "MONDAY",
    label: "Lunes",
  },
  2: {
    day: "TUESDAY",
    label: "Martes",
  },
  3: {
    day: "WEDNESDAY",
    label: "Miércoles",
  },
  4: {
    day: "THURSDAY",
    label: "Jueves",
  },
  5: {
    day: "FRIDAY",
    label: "Viernes",
  },
  6: {
    day: "SATURDAY",
    label: "Sábado",
  },
};

const numberByDay: Record<
  WeekDay,
  number
> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

const normalizeTime = (
  time: string | null,
  fallback: string,
) => {
  return time?.slice(0, 5) ?? fallback;
};
const mapAvailability = (
  row: AvailabilityRow,
): DayAvailability => {
  const dayData =
    dayByNumber[row.day_of_week];

  if (!dayData) {
    throw new Error(
      `Día inválido: ${row.day_of_week}`,
    );
  }

  return {
    day: dayData.day,
    label: dayData.label,
    isOpen: row.enabled,

    startTime: normalizeTime(
      row.start_time,
      "09:00",
    ),

    endTime: normalizeTime(
      row.end_time,
      "18:00",
    ),
  };
};

const mapBlockedPeriod = (
  row: BlockedPeriodRow,
): BlockedPeriod => {
  return {
    id: row.id,
    date: row.date,

    startTime: normalizeTime(
      row.start_time,
      "09:00",
    ),

    endTime: normalizeTime(
      row.end_time,
      "10:00",
    ),

    reason: row.reason ?? "",
  };
};

const getErrorMessage = (
  error: unknown,
) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Ocurrió un error con la disponibilidad.";
};

export const AvailabilityProvider = ({
  children,
}: AvailabilityProviderProps) => {
  const [
    weeklySchedule,
    setWeeklySchedule,
  ] = useState<DayAvailability[]>([]);

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

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  const refreshAvailability =
    useCallback(async () => {
      setLoading(true);
      setError(null);

      try {
        const [
          availabilityResult,
          settingsResult,
          blockedDatesResult,
          blockedPeriodsResult,
        ] = await Promise.all([
          supabase
            .from("availability")
            .select("*")
            .order("day_of_week"),

          supabase
            .from("availability_settings")
            .select("*")
            .eq("id", 1)
            .single(),

          supabase
            .from("blocked_dates")
            .select("*")
            .order("date"),

          supabase
            .from("blocked_periods")
            .select("*")
            .order("date")
            .order("start_time"),
        ]);

        if (availabilityResult.error) {
          throw availabilityResult.error;
        }

        if (settingsResult.error) {
          throw settingsResult.error;
        }

        if (blockedDatesResult.error) {
          throw blockedDatesResult.error;
        }

        if (blockedPeriodsResult.error) {
          throw blockedPeriodsResult.error;
        }

        setWeeklySchedule(
          availabilityResult.data.map(
            mapAvailability,
          ),
        );

        setSlotInterval(
          settingsResult.data.slot_interval,
        );

        setBlockedDates(
          blockedDatesResult.data.map(
            (row) => row.date,
          ),
        );

        setBlockedPeriods(
          blockedPeriodsResult.data.map(
            mapBlockedPeriod,
          ),
        );
      } catch (caughtError) {
        const message =
          getErrorMessage(caughtError);

        console.error(
          "Error al cargar disponibilidad:",
          caughtError,
        );

        setError(message);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void refreshAvailability();
  }, [refreshAvailability]);

  const updateDayAvailability =
    useCallback(
      async (
        day: WeekDay,
        updates: DayAvailabilityUpdate,
      ) => {
        const currentDay =
          weeklySchedule.find(
            (item) =>
              item.day === day,
          );

        if (!currentDay) {
          throw new Error(
            "Día no encontrado.",
          );
        }

        const nextDay = {
          ...currentDay,
          ...updates,
        };

        const {
          error: supabaseError,
        } = await supabase
          .from("availability")
          .update({
            enabled:
              nextDay.isOpen,

            start_time:
              nextDay.startTime,

            end_time:
              nextDay.endTime,
          })
          .eq(
            "day_of_week",
            numberByDay[day],
          );

        if (supabaseError) {
          throw supabaseError;
        }

        setWeeklySchedule(
          (currentSchedule) =>
            currentSchedule.map(
              (item) =>
                item.day === day
                  ? nextDay
                  : item,
            ),
        );
      },
      [weeklySchedule],
    );

  const updateSlotInterval =
    useCallback(
      async (interval: number) => {
        const {
          error: supabaseError,
        } = await supabase
          .from(
            "availability_settings",
          )
          .upsert({
            id: 1,
            slot_interval: interval,
            updated_at:
              new Date().toISOString(),
          });

        if (supabaseError) {
          throw supabaseError;
        }

        setSlotInterval(interval);
      },
      [],
    );

  const blockDate = useCallback(
    async (date: string) => {
      const {
        error: supabaseError,
      } = await supabase
        .from("blocked_dates")
        .insert({
          date,
        });

      if (supabaseError) {
        if (
          supabaseError.code ===
          "23505"
        ) {
          return;
        }

        throw supabaseError;
      }

      setBlockedDates((current) =>
        [...current, date].sort(),
      );
    },
    [],
  );

  const unblockDate = useCallback(
    async (date: string) => {
      const {
        error: supabaseError,
      } = await supabase
        .from("blocked_dates")
        .delete()
        .eq("date", date);

      if (supabaseError) {
        throw supabaseError;
      }

      setBlockedDates((current) =>
        current.filter(
          (blockedDate) =>
            blockedDate !== date,
        ),
      );
    },
    [],
  );

  const addBlockedPeriod =
    useCallback(
      async (
        period: BlockedPeriodFormData,
      ) => {
        const {
          data,
          error: supabaseError,
        } = await supabase
          .from("blocked_periods")
          .insert({
            date: period.date,

            start_time:
              period.startTime,

            end_time:
              period.endTime,

            reason:
              period.reason.trim(),
          })
          .select("*")
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        const createdPeriod =
          mapBlockedPeriod(data);

        setBlockedPeriods((current) =>
          [...current, createdPeriod].sort(
            (first, second) =>
              `${first.date} ${first.startTime}`.localeCompare(
                `${second.date} ${second.startTime}`,
              ),
          ),
        );
      },
      [],
    );

  const removeBlockedPeriod =
    useCallback(
      async (periodId: number) => {
        const {
          error: supabaseError,
        } = await supabase
          .from("blocked_periods")
          .delete()
          .eq("id", periodId);

        if (supabaseError) {
          throw supabaseError;
        }

        setBlockedPeriods((current) =>
          current.filter(
            (period) =>
              period.id !== periodId,
          ),
        );
      },
      [],
    );

  const value =
    useMemo<AvailabilityContextValue>(
      () => ({
        weeklySchedule,
        slotInterval,
        blockedDates,
        blockedPeriods,
        loading,
        error,
        refreshAvailability,
        updateDayAvailability,
        updateSlotInterval,
        blockDate,
        unblockDate,
        addBlockedPeriod,
        removeBlockedPeriod,
      }),
      [
        weeklySchedule,
        slotInterval,
        blockedDates,
        blockedPeriods,
        loading,
        error,
        refreshAvailability,
        updateDayAvailability,
        updateSlotInterval,
        blockDate,
        unblockDate,
        addBlockedPeriod,
        removeBlockedPeriod,
      ],
    );

  return (
    <AvailabilityContext.Provider
      value={value}
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
      "useAvailability debe utilizarse dentro de AvailabilityProvider.",
    );
  }

  return context;
};
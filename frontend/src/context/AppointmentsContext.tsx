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
  Appointment,
  AppointmentFormData,
  AppointmentStatus,
} from "../types/appointment";

type AppointmentRow =
  Database["public"]["Tables"]["appointments"]["Row"];

interface AppointmentQueryRow
  extends AppointmentRow {
  client: {
    name: string;
    phone: string;
  } | null;

  service: {
    name: string;
  } | null;
}

interface AppointmentsContextValue {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;

  refreshAppointments: () => Promise<void>;

  addAppointment: (
    data: AppointmentFormData,
  ) => Promise<Appointment>;

  updateAppointment: (
    appointmentId: number,
    data: AppointmentFormData,
  ) => Promise<Appointment>;

  updateAppointmentStatus: (
    appointmentId: number,
    status: AppointmentStatus,
  ) => Promise<Appointment>;

  deleteAppointment: (
    appointmentId: number,
  ) => Promise<void>;

  updateAppointmentsClientSnapshot: (
    clientId: number,
    client: string,
    phone: string,
  ) => void;
}

interface AppointmentsProviderProps {
  children: ReactNode;
}

const AppointmentsContext =
  createContext<AppointmentsContextValue | null>(
    null,
  );

const appointmentSelect = `
  id,
  client_id,
  service_id,
  date,
  time,
  status,
  price,
  duration_minutes,
  created_at,
  client:clients!appointments_client_id_fkey (
    name,
    phone
  ),
  service:services!appointments_service_id_fkey (
    name
  )
`;

const mapAppointmentRow = (
  row: AppointmentQueryRow,
): Appointment => {
  return {
    id: row.id,

    clientId: row.client_id,
    serviceId: row.service_id,

    date: row.date,

    /*
     * PostgreSQL puede devolver 09:00:00,
     * mientras que los formularios utilizan 09:00.
     */
    time: row.time.slice(0, 5),

    client:
      row.client?.name ??
      "Cliente no disponible",

    phone: row.client?.phone ?? "",

    service:
      row.service?.name ??
      "Servicio no disponible",

    duration: row.duration_minutes,
    price: Number(row.price),

    status:
      row.status as AppointmentStatus,
  };
};

const sortAppointments = (
  appointments: Appointment[],
) => {
  return [...appointments].sort(
    (first, second) => {
      const firstKey =
        `${first.date} ${first.time}`;

      const secondKey =
        `${second.date} ${second.time}`;

      return firstKey.localeCompare(
        secondKey,
      );
    },
  );
};

const normalizeTimeForDatabase = (
  time: string,
) => {
  return time.length === 5
    ? `${time}:00`
    : time;
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

  return "Ocurrió un error inesperado con los turnos.";
};

const getAppointmentErrorMessage = (
  code: string | undefined,
  message: string,
) => {
  if (code === "23505") {
    return "Ya existe un turno reservado para esa fecha y hora.";
  }

  if (code === "23503") {
    return "El cliente o el servicio seleccionado ya no existe.";
  }

  return message;
};

export const AppointmentsProvider = ({
  children,
}: AppointmentsProviderProps) => {
  const [
    appointments,
    setAppointments,
  ] = useState<Appointment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  const refreshAppointments =
    useCallback(async () => {
      setLoading(true);
      setError(null);

      const {
        data,
        error: supabaseError,
      } = await supabase
        .from("appointments")
        .select(appointmentSelect)
        .order("date", {
          ascending: true,
        })
        .order("time", {
          ascending: true,
        });

      if (supabaseError) {
        setAppointments([]);
        setError(supabaseError.message);
        setLoading(false);

        return;
      }

      const rows =
        (data ??
          []) as AppointmentQueryRow[];

      setAppointments(
        rows.map(mapAppointmentRow),
      );

      setLoading(false);
    }, []);

  useEffect(() => {
    void refreshAppointments();
  }, [refreshAppointments]);

  const addAppointment = useCallback(
  async (
    appointment: AppointmentFormData,
  ): Promise<Appointment> => {
    setError(null);

    try {
      const {
        data,
        error: supabaseError,
      } = await supabase
        .from("appointments")
        .insert({
          client_id:
            appointment.clientId,

          service_id:
            appointment.serviceId,

          date: appointment.date,

          time:
            normalizeTimeForDatabase(
              appointment.time,
            ),

          price: appointment.price,

          duration_minutes:
            appointment.duration,

          status: appointment.status,
        })
        .select("id")
        .single();

      if (supabaseError) {
        throw new Error(
          getAppointmentErrorMessage(
            supabaseError.code,
            supabaseError.message,
          ),
        );
      }

      /*
       * Los nombres, teléfono, precio y
       * duración ya vienen correctamente
       * desde AppointmentFormModal.
       */
      const createdAppointment: Appointment =
        {
          id: data.id,
          ...appointment,
        };

      setAppointments(
        (currentAppointments) =>
          sortAppointments([
            ...currentAppointments,
            createdAppointment,
          ]),
      );

      return createdAppointment;
    } catch (caughtError) {
      const message =
        getErrorMessage(caughtError);

      setError(message);

      throw new Error(message);
    }
  },
  [],
);

  const updateAppointment =
    useCallback(
      async (
        appointmentId: number,
        appointment:
          AppointmentFormData,
      ): Promise<Appointment> => {
        setError(null);

        try {
          const {
            data,
            error: supabaseError,
          } = await supabase
            .from("appointments")
            .update({
              client_id:
                appointment.clientId,

              service_id:
                appointment.serviceId,

              date: appointment.date,

              time:
                normalizeTimeForDatabase(
                  appointment.time,
                ),

              price:
                appointment.price,

              duration_minutes:
                appointment.duration,

              status:
                appointment.status,
            })
            .eq("id", appointmentId)
            .select(appointmentSelect)
            .single();

          if (supabaseError) {
            throw new Error(
              getAppointmentErrorMessage(
                supabaseError.code,
                supabaseError.message,
              ),
            );
          }

          const updatedAppointment =
            mapAppointmentRow(
              data as AppointmentQueryRow,
            );

          setAppointments((current) =>
            sortAppointments(
              current.map(
                (currentAppointment) =>
                  currentAppointment.id ===
                  appointmentId
                    ? updatedAppointment
                    : currentAppointment,
              ),
            ),
          );

          return updatedAppointment;
        } catch (caughtError) {
          const message =
            getErrorMessage(caughtError);

          setError(message);

          throw new Error(message);
        }
      },
      [],
    );

  const updateAppointmentStatus =
    useCallback(
      async (
        appointmentId: number,
        status: AppointmentStatus,
      ): Promise<Appointment> => {
        setError(null);

        try {
          const {
            data,
            error: supabaseError,
          } = await supabase
            .from("appointments")
            .update({
              status,
            })
            .eq("id", appointmentId)
            .select(appointmentSelect)
            .single();

          if (supabaseError) {
            throw new Error(
              getAppointmentErrorMessage(
                supabaseError.code,
                supabaseError.message,
              ),
            );
          }

          const updatedAppointment =
            mapAppointmentRow(
              data as AppointmentQueryRow,
            );

          setAppointments((current) =>
            current.map(
              (appointment) =>
                appointment.id ===
                appointmentId
                  ? updatedAppointment
                  : appointment,
            ),
          );

          return updatedAppointment;
        } catch (caughtError) {
          const message =
            getErrorMessage(caughtError);

          setError(message);

          throw new Error(message);
        }
      },
      [],
    );

  const deleteAppointment =
    useCallback(
      async (
        appointmentId: number,
      ): Promise<void> => {
        setError(null);

        try {
          const {
            error: supabaseError,
          } = await supabase
            .from("appointments")
            .delete()
            .eq("id", appointmentId);

          if (supabaseError) {
            throw new Error(
              supabaseError.message,
            );
          }

          setAppointments((current) =>
            current.filter(
              (appointment) =>
                appointment.id !==
                appointmentId,
            ),
          );
        } catch (caughtError) {
          const message =
            getErrorMessage(caughtError);

          setError(message);

          throw new Error(message);
        }
      },
      [],
    );

  /*
   * Se conserva temporalmente para que
   * AdminClients no se rompa.
   *
   * Supabase obtiene estos datos mediante
   * la relación con clients, pero esta
   * actualización permite reflejar el
   * cambio inmediatamente sin recargar.
   */
  const updateAppointmentsClientSnapshot =
    useCallback(
      (
        clientId: number,
        client: string,
        phone: string,
      ) => {
        setAppointments((current) =>
          current.map((appointment) =>
            appointment.clientId ===
            clientId
              ? {
                  ...appointment,
                  client,
                  phone,
                }
              : appointment,
          ),
        );
      },
      [],
    );

  const value =
    useMemo<AppointmentsContextValue>(
      () => ({
        appointments,
        loading,
        error,
        refreshAppointments,
        addAppointment,
        updateAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        updateAppointmentsClientSnapshot,
      }),
      [
        appointments,
        loading,
        error,
        refreshAppointments,
        addAppointment,
        updateAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        updateAppointmentsClientSnapshot,
      ],
    );

  return (
    <AppointmentsContext.Provider
      value={value}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(
    AppointmentsContext,
  );

  if (!context) {
    throw new Error(
      "useAppointments debe utilizarse dentro de AppointmentsProvider.",
    );
  }

  return context;
};
import {
  createContext,
  useContext,
  useState,
} from "react";

import type { ReactNode } from "react";

import { appointmentsMock } from "../mocks/appointmentsMock";

import type {
  Appointment,
  AppointmentFormData,
  AppointmentStatus,
} from "../types/appointment";

interface AppointmentsContextValue {
  appointments: Appointment[];
  addAppointment: (data: AppointmentFormData) => void;
  updateAppointment: (
    id: number,
    data: AppointmentFormData,
  ) => void;
  updateAppointmentStatus: (
    id: number,
    status: AppointmentStatus,
  ) => void;
  updateAppointmentsClientSnapshot: (
    clientId: Appointment["clientId"],
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

export const AppointmentsProvider = ({
  children,
}: AppointmentsProviderProps) => {
  const [appointments, setAppointments] =
    useState<Appointment[]>(
      appointmentsMock,
    );

  const addAppointment = (
    data: AppointmentFormData,
  ) => {
    const newAppointment: Appointment = {
      id: Date.now(),
      ...data,
    };

    setAppointments((current) => [
      ...current,
      newAppointment,
    ]);
  };

  const updateAppointment = (
    id: number,
    data: AppointmentFormData,
  ) => {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              ...data,
            }
          : appointment,
      ),
    );
  };

  const updateAppointmentStatus = (
    id: number,
    status: AppointmentStatus,
  ) => {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status,
            }
          : appointment,
      ),
    );
  };

  const updateAppointmentsClientSnapshot = (
  clientId: Appointment["clientId"],
  client: string,
  phone: string,
) => {
  // Evita modificar turnos que no tienen un cliente asociado.
  if (clientId == null) return;

  setAppointments((current) =>
    current.map((appointment) =>
      appointment.clientId === clientId
        ? {
            ...appointment,
            client,
            phone,
          }
        : appointment,
    ),
  );
};

  return (
  <AppointmentsContext.Provider
    value={{
      appointments,
      addAppointment,
      updateAppointment,
      updateAppointmentStatus,
      updateAppointmentsClientSnapshot,
    }}
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
      "useAppointments debe utilizarse dentro de AppointmentsProvider",
    );
  }

  return context;
};
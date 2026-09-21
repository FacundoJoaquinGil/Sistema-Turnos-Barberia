import { supabase } from "../lib/supabase";

import type { AppointmentStatus } from "../types/appointment";

/*
 * ============================================================
 * TIPOS
 * ============================================================
 */

/*
 * Este es el único dato de un turno que la página pública
 * necesita conocer.
 *
 * No exponemos:
 *
 * - clientId
 * - client
 * - phone
 * - serviceId
 * - service
 * - price
 *
 * Booking solamente necesita saber qué espacio horario
 * ya se encuentra ocupado.
 */
export type PublicBusyAppointment = {
  date: string;

  time: string;

  duration: number;

  status: AppointmentStatus;
};

/*
 * Forma exacta devuelta por:
 *
 * get_public_busy_appointments()
 *
 * Estos nombres deben coincidir con los definidos
 * en RETURNS TABLE de la función PostgreSQL.
 */
type BusyAppointmentRow = {
  appointment_date: string;

  appointment_time: string;

  appointment_duration: number;

  appointment_status: string;
};

export type CreatePublicBookingInput = {
  name: string;

  phone: string;

  comment: string;

  serviceId: number;

  date: string;

  time: string;
};

/*
 * ============================================================
 * TURNOS OCUPADOS
 * ============================================================
 */

/*
 * Obtiene únicamente los turnos necesarios para calcular
 * disponibilidad pública.
 *
 * No consulta directamente appointments porque esa tabla
 * contiene información privada de clientes.
 */
export const getPublicBusyAppointments =
  async (
    startDate: string,
    endDate: string,
  ): Promise<PublicBusyAppointment[]> => {
    const { data, error } =
      await supabase.rpc(
        "get_public_busy_appointments",
        {
          p_start_date: startDate,

          p_end_date: endDate,
        },
      );

    if (error) {
      throw new Error(
        error.message,
      );
    }

    const rows =
      (data ??
        []) as BusyAppointmentRow[];

    return rows.map(
      (row) => ({
        date:
          row.appointment_date,

        /*
         * PostgreSQL normalmente devuelve TIME
         * como:
         *
         * 09:30:00
         *
         * Nuestro frontend trabaja con:
         *
         * 09:30
         */
        time:
          row.appointment_time.slice(
            0,
            5,
          ),

        duration:
          row.appointment_duration,

        status:
          row.appointment_status as AppointmentStatus,
      }),
    );
  };

/*
 * ============================================================
 * CREAR RESERVA PÚBLICA
 * ============================================================
 */

/*
 * La reserva NO inserta directamente en clients ni
 * appointments.
 *
 * Toda la operación se delega a create_public_booking(),
 * que se encarga de:
 *
 * 1. validar el servicio;
 * 2. validar fecha y horario;
 * 3. validar disponibilidad semanal;
 * 4. validar blockedDates;
 * 5. validar blockedPeriods;
 * 6. comprobar superposición con otros turnos;
 * 7. buscar o crear al cliente;
 * 8. crear el appointment como PENDIENTE.
 */
export const createPublicBooking =
  async ({
    name,
    phone,
    comment,
    serviceId,
    date,
    time,
  }: CreatePublicBookingInput): Promise<number> => {
    const { data, error } =
      await supabase.rpc(
        "create_public_booking",
        {
          p_name:
            name.trim(),

          p_phone:
            phone.trim(),

          p_service_id:
            serviceId,

          p_date:
            date,

          p_time:
            time,

          p_comment:
            comment.trim(),
        },
      );

    if (error) {
      throw new Error(
        error.message,
      );
    }

    if (data === null) {
      throw new Error(
        "No se pudo crear la reserva.",
      );
    }

    const appointmentId =
      Number(data);

    if (
      !Number.isInteger(
        appointmentId,
      ) ||
      appointmentId <= 0
    ) {
      throw new Error(
        "La reserva fue procesada pero no se recibió un identificador válido.",
      );
    }

    return appointmentId;
  };
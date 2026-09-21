import {
  CalendarDays,
  Clock3,
  DollarSign,
  Scissors,
  UserRound,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import type { FormEvent } from "react";

import {
  useAppointments,
  useAvailability,
  useClients,
  useServices,
} from "../../../context";

import { getAvailableSlots } from "../../../utils/availability";

import type {
  Appointment,
  AppointmentFormData,
  AppointmentStatus,
} from "../../../types/appointment";

interface AppointmentFormModalProps {
  isOpen: boolean;

  initialDate?: string;

  appointment?: Appointment | null;

  onClose: () => void;

  onSubmit: (data: AppointmentFormData) => Promise<void> | void;
}

const getDefaultForm = (date: string): AppointmentFormData => ({
  clientId: 0,
  serviceId: 0,

  date,
  time: "",

  client: "",
  phone: "",

  service: "",

  duration: 0,
  price: 0,

  status: "PENDIENTE",
});

const AppointmentFormModal = ({
  isOpen,
  initialDate = "",
  appointment,
  onClose,
  onSubmit,
}: AppointmentFormModalProps) => {
  const [form, setForm] = useState<AppointmentFormData>(
    getDefaultForm(initialDate),
  );

  const { appointments } = useAppointments();

  const { weeklySchedule, slotInterval, blockedDates, blockedPeriods } =
    useAvailability();

  const { services } = useServices();

  const { clients } = useClients();

  const isEditing = appointment !== null && appointment !== undefined;

  /*
   * Carga los datos cuando:
   * - se abre el modal
   * - se edita un turno
   * - cambia la fecha inicial
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (appointment) {
      const {
        clientId,
        serviceId,
        date,
        time,
        client,
        phone,
        service,
        duration,
        price,
        status,
      } = appointment;

      setForm({
        clientId,
        serviceId,

        date,
        time,

        client,
        phone,

        service,

        duration,
        price,

        status,
      });

      return;
    }

    setForm(getDefaultForm(initialDate));
  }, [isOpen, appointment, initialDate]);

  /*
   * Calcula los horarios realmente
   * disponibles según:
   *
   * - fecha
   * - duración
   * - jornada laboral
   * - intervalos
   * - días bloqueados
   * - horarios bloqueados
   * - turnos existentes
   */
  const availableSlots = useMemo(() => {
    if (!form.date || !form.serviceId || form.duration <= 0) {
      return [];
    }

    return getAvailableSlots({
      date: form.date,

      serviceDuration: form.duration,

      slotInterval,

      weeklySchedule,

      blockedDates,

      blockedPeriods,

      appointments,

      excludeAppointmentId: appointment?.id,
    });
  }, [
    form.date,
    form.serviceId,
    form.duration,
    slotInterval,
    weeklySchedule,
    blockedDates,
    blockedPeriods,
    appointments,
    appointment?.id,
  ]);

  /*
   * Durante una edición conservamos
   * el horario original si seguimos
   * trabajando con la misma fecha,
   * servicio y duración.
   */
  const timeOptions = useMemo(() => {
    const slots = [...availableSlots];

    const canKeepOriginalTime =
      appointment &&
      form.date === appointment.date &&
      form.serviceId === appointment.serviceId &&
      form.duration === appointment.duration &&
      appointment.time;

    if (canKeepOriginalTime && !slots.includes(appointment.time)) {
      slots.push(appointment.time);

      slots.sort();
    }

    return slots;
  }, [availableSlots, appointment, form.date, form.serviceId, form.duration]);

  /*
   * IMPORTANTE:
   * todos los hooks están antes
   * del return condicional.
   */
  if (!isOpen) {
    return null;
  }

  const handleClientChange = (clientId: string) => {
    const id = Number(clientId);

    const selectedClient = clients.find((client) => client.id === id);

    setForm((current) => ({
      ...current,

      clientId: id,

      client: selectedClient?.name ?? "",

      phone: selectedClient?.phone ?? "",
    }));
  };

  const handleServiceChange = (serviceId: string) => {
    const id = Number(serviceId);

    const selectedService = services.find((service) => service.id === id);

    setForm((current) => ({
      ...current,

      serviceId: id,

      service: selectedService?.name ?? "",

      duration: selectedService?.duration ?? 0,

      price: selectedService?.price ?? 0,

      /*
       * Al cambiar el servicio
       * limpiamos el horario porque
       * la duración puede cambiar.
       */
      time: "",
    }));
  };

  const handleStatusChange = (status: AppointmentStatus) => {
    setForm((current) => ({
      ...current,
      status,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.clientId ||
      !form.serviceId ||
      !form.client ||
      !form.service ||
      !form.date ||
      !form.time
    ) {
      return;
    }

    await onSubmit(form);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
      style={{
        background: "color-mix(in srgb, var(--color-primary) 45%, transparent)",
      }}
    >
      {/* FONDO PARA CERRAR */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar modal"
        className="absolute inset-0"
      />

      <section className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-[var(--color-border)] bg-[var(--color-background-light)] sm:max-w-2xl sm:rounded-3xl">
        {/* HEADER */}
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-[var(--color-border)] bg-[var(--color-background-light)] p-5 sm:p-6">
          <div>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              Gestión de turnos
            </p>

            <h2 className="mt-1 text-xl font-semibold text-[var(--color-text)] sm:text-2xl">
              {isEditing ? "Editar turno" : "Nuevo turno"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-background)] hover:text-[var(--color-text)]"
          >
            <X size={19} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
          {/* CLIENTE */}
          <div>
            <label
              htmlFor="appointment-client"
              className="mb-2 block text-sm font-medium text-[var(--color-text)]"
            >
              Cliente
            </label>

            <div className="relative">
              <UserRound
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
              />

              <select
                id="appointment-client"
                value={form.clientId === 0 ? "" : form.clientId}
                onChange={(e) => handleClientChange(e.target.value)}
                required
                className="h-12 w-full appearance-none rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] pl-12 pr-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
              >
                <option value="">Seleccionar cliente</option>

                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            {form.phone && (
              <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                Teléfono: {form.phone}
              </p>
            )}
          </div>

          {/* SERVICIO */}
          <div>
            <label
              htmlFor="appointment-service"
              className="mb-2 block text-sm font-medium text-[var(--color-text)]"
            >
              Servicio
            </label>

            <div className="relative">
              <Scissors
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
              />

              <select
                id="appointment-service"
                value={form.serviceId === 0 ? "" : form.serviceId}
                onChange={(e) => handleServiceChange(e.target.value)}
                required
                className="h-12 w-full appearance-none rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] pl-12 pr-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
              >
                <option value="">Seleccionar servicio</option>

                {services.map((service) => (
                  <option
                    key={service.id}
                    value={service.id}
                    disabled={!service.isActive}
                  >
                    {service.name}

                    {!service.isActive ? " (Inactivo)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FECHA Y HORARIO */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* FECHA */}
            <div>
              <label
                htmlFor="appointment-date"
                className="mb-2 block text-sm font-medium text-[var(--color-text)]"
              >
                Fecha
              </label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
                />

                <input
                  id="appointment-date"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,

                      date: e.target.value,

                      /*
                       * La disponibilidad
                       * cambia con la fecha.
                       */
                      time: "",
                    }))
                  }
                  required
                  className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] pl-12 pr-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            {/* HORARIO */}
            <div>
              <label
                htmlFor="appointment-time"
                className="mb-2 block text-sm font-medium text-[var(--color-text)]"
              >
                Horario
              </label>

              <div className="relative">
                <Clock3
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
                />

                <select
                  id="appointment-time"
                  value={form.time}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,

                      time: e.target.value,
                    }))
                  }
                  disabled={!form.date || !form.serviceId}
                  required
                  className="h-12 w-full appearance-none rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] pl-12 pr-4 text-sm text-[var(--color-text)] outline-none transition disabled:cursor-not-allowed disabled:opacity-50 focus:border-[var(--color-primary)]"
                >
                  <option value="">
                    {!form.date
                      ? "Seleccionar fecha"
                      : !form.serviceId
                        ? "Seleccionar servicio"
                        : timeOptions.length === 0
                          ? "Sin horarios disponibles"
                          : "Seleccionar horario"}
                  </option>

                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {form.date &&
                form.serviceId !== 0 &&
                timeOptions.length === 0 && (
                  <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                    No hay horarios disponibles para esta fecha y servicio.
                  </p>
                )}
            </div>
          </div>

          {/* DURACIÓN Y PRECIO */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* DURACIÓN */}
            <div>
              <label
                htmlFor="appointment-duration"
                className="mb-2 block text-sm font-medium text-[var(--color-text)]"
              >
                Duración
              </label>

              <div className="relative">
                <Clock3
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
                />

                <input
                  id="appointment-duration"
                  type="number"
                  value={form.duration}
                  readOnly
                  className="h-12 w-full cursor-not-allowed rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] pl-12 pr-14 text-sm text-[var(--color-text-secondary)] outline-none"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-secondary)]">
                  min
                </span>
              </div>
            </div>

            {/* PRECIO */}
            <div>
              <label
                htmlFor="appointment-price"
                className="mb-2 block text-sm font-medium text-[var(--color-text)]"
              >
                Precio
              </label>

              <div className="relative">
                <DollarSign
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
                />

                <input
                  id="appointment-price"
                  type="number"
                  value={form.price}
                  readOnly
                  className="h-12 w-full cursor-not-allowed rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] pl-12 pr-4 text-sm text-[var(--color-text-secondary)] outline-none"
                />
              </div>
            </div>
          </div>

          {/* ESTADO */}
          <div>
            <label
              htmlFor="appointment-status"
              className="mb-2 block text-sm font-medium text-[var(--color-text)]"
            >
              Estado
            </label>

            <select
              id="appointment-status"
              value={form.status}
              onChange={(e) =>
                handleStatusChange(e.target.value as AppointmentStatus)
              }
              className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
            >
              <option value="PENDIENTE">Pendiente</option>

              <option value="CONFIRMADO">Confirmado</option>

              <option value="COMPLETADO">Completado</option>

              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          {/* RESUMEN DEL SERVICIO */}
          {form.service && (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-[var(--color-background-light)]">
                  <Scissors size={18} />
                </div>

                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {form.service}
                  </p>

                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    {form.duration} min · ${form.price.toLocaleString("es-AR")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ACCIONES */}
          <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[var(--color-border)] px-5 py-3 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-background)]"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-[var(--color-background-light)] transition hover:bg-[var(--color-primary-hover)]"
            >
              {isEditing ? "Guardar cambios" : "Crear turno"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AppointmentFormModal;

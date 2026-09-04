import {
  CalendarDays,
  Clock3,
  DollarSign,
  Scissors,
  UserRound,
  X,
} from "lucide-react";

import { FormEvent, useEffect, useState } from "react";

import type {
  Appointment,
  AppointmentFormData,
  AppointmentStatus,
} from "../../../types/appointment";

import { useClients } from "../../../context/ClientsContext";

interface AppointmentFormModalProps {
  isOpen: boolean;

  initialDate?: string;

  appointment?: Appointment | null;

  onClose: () => void;

  onSubmit: (data: AppointmentFormData) => void;
}

interface ServiceMock {
  id: number;
  name: string;
  duration: number;
  price: number;
}



const servicesMock: ServiceMock[] = [
  {
    id: 1,
    name: "Corte clásico",
    duration: 45,
    price: 9000,
  },
  {
    id: 2,
    name: "Corte degradado",
    duration: 45,
    price: 10000,
  },
  {
    id: 3,
    name: "Barba",
    duration: 30,
    price: 6000,
  },
  {
    id: 4,
    name: "Corte + Barba",
    duration: 60,
    price: 13000,
  },
];

const getDefaultForm = (date: string): AppointmentFormData => ({
  clientId: 0,

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

  const { clients } = useClients();

  const isEditing = appointment !== null && appointment !== undefined;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (appointment) {
      const { clientId, date, time, client, phone, service, duration, price, status } =
        appointment;

      setForm({
        clientId,
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

  if (!isOpen) {
    return null;
  }

  const handleClientChange = (clientId: string) => {
    const id = Number(clientId);

    const client = clients.find((item) => item.id === id);

    setForm((current) => ({
      ...current,

      clientId: id,

      client: client?.name ?? "",

      phone: client?.phone ?? "",
    }));
  };

  const handleServiceChange = (serviceName: string) => {
    const service = servicesMock.find((item) => item.name === serviceName);

    setForm((current) => ({
      ...current,
      service: serviceName,
      duration: service?.duration ?? 0,
      price: service?.price ?? 0,
    }));
  };

  const handleStatusChange = (status: AppointmentStatus) => {
    setForm((current) => ({
      ...current,
      status,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !form.clientId ||
      !form.client ||
      !form.service ||
      !form.date ||
      !form.time
    ) {
      return;
    }

    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-5">
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
                value={form.service}
                onChange={(e) => handleServiceChange(e.target.value)}
                required
                className="h-12 w-full appearance-none rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] pl-12 pr-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
              >
                <option value="">Seleccionar servicio</option>

                {servicesMock.map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FECHA Y HORARIO */}
          <div className="grid gap-4 sm:grid-cols-2">
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
                    }))
                  }
                  required
                  className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] pl-12 pr-4 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

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

                <input
                  id="appointment-time"
                  type="time"
                  value={form.time}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      time: e.target.value,
                    }))
                  }
                  required
                  className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] pl-12 pr-4 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>
          </div>

          {/* DURACIÓN Y PRECIO */}
          <div className="grid gap-4 sm:grid-cols-2">
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
                  min="0"
                  value={form.duration}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      duration: Number(e.target.value),
                    }))
                  }
                  className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] pl-12 pr-14 text-sm text-[var(--color-text)] outline-none"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-secondary)]">
                  min
                </span>
              </div>
            </div>

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
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      price: Number(e.target.value),
                    }))
                  }
                  className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] pl-12 pr-4 text-sm text-[var(--color-text)] outline-none"
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
              className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] px-4 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
            >
              <option value="PENDIENTE">Pendiente</option>

              <option value="CONFIRMADO">Confirmado</option>

              <option value="COMPLETADO">Completado</option>

              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          {/* RESUMEN */}
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

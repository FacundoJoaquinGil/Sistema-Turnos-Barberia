import {
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  Scissors,
  UserRound,
} from "lucide-react";

import { useMemo, useState } from "react";

import Swal from "sweetalert2";

import AppointmentFormModal from "../../components/admin/appointments/AppointmentFormModal";

import type {
  Appointment,
  AppointmentFormData,
  AppointmentStatus,
} from "../../types/appointment";

import { useAppointments } from "../../context/AppointmentsContext";

import { addDays } from "../../utils/addDays";

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


const today = new Date();

const statusLabel: Record<AppointmentStatus, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado",
};

const statusClasses: Record<AppointmentStatus, string> = {
  PENDIENTE: "border-[var(--color-accent)] text-[var(--color-accent)]",
  CONFIRMADO: "border-[var(--color-primary)] text-[var(--color-primary)]",
  COMPLETADO:
    "border-[var(--color-secondary)] bg-[var(--color-secondary)] text-[var(--color-background-light)]",
  CANCELADO:
    "border-[var(--color-border)] text-[var(--color-text-secondary)] opacity-60",
};

const AdminAgenda = () => {
  const [selectedDate, setSelectedDate] = useState(today);

  const {
  appointments,
  addAppointment,
  updateAppointment,
  updateAppointmentStatus,
} = useAppointments();

  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);

  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  const selectedDateKey = formatDateKey(selectedDate);

  const dayAppointments = useMemo(() => {
    return appointments
      .filter(
        (appointment) =>
          appointment.date === selectedDateKey &&
          appointment.status !== "CANCELADO",
      )
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, selectedDateKey]);

  const totalSlots = 10;

  const bookedSlots = dayAppointments.length;

  const freeSlots = Math.max(totalSlots - bookedSlots, 0);

  const completedAppointments = dayAppointments.filter(
    (appointment) => appointment.status === "COMPLETADO",
  ).length;

  const occupancy =
    totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;

  const formattedSelectedDate = selectedDate.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isToday = selectedDateKey === formatDateKey(today);

  const changeDay = (amount: number) => {
    setSelectedDate((current) => addDays(current, amount));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const handleViewDetails = (appointment: Appointment) => {
    Swal.fire({
      title: appointment.client,
      html: `
        <div style="text-align:left; line-height:1.8">
          <p><strong>Horario:</strong> ${appointment.time}</p>
          <p><strong>Servicio:</strong> ${appointment.service}</p>
          <p><strong>Duración:</strong> ${appointment.duration} min</p>
          <p><strong>Teléfono:</strong> ${appointment.phone}</p>
          <p><strong>Precio:</strong> $${appointment.price.toLocaleString(
            "es-AR",
          )}</p>
          <p><strong>Estado:</strong> ${statusLabel[appointment.status]}</p>
        </div>
      `,
      confirmButtonText: "Cerrar",
      confirmButtonColor: "var(--color-primary)",
    });
  };

  const handleConfirm = async (appointment: Appointment) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Confirmar turno",
      text: `¿Querés confirmar el turno de ${appointment.client}?`,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Volver",
      confirmButtonColor: "var(--color-primary)",
    });

    if (!result.isConfirmed) {
      return;
    }

    updateAppointmentStatus(appointment.id, "CONFIRMADO");

    await Swal.fire({
      icon: "success",
      title: "Turno confirmado",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const handleComplete = async (appointment: Appointment) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Completar turno",
      text: `¿Marcar el turno de ${appointment.client} como completado?`,
      showCancelButton: true,
      confirmButtonText: "Marcar completado",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "var(--color-primary)",
    });

    if (!result.isConfirmed) {
      return;
    }

    updateAppointmentStatus(appointment.id, "COMPLETADO");
  };

  const handleCancel = async (appointment: Appointment) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Cancelar turno",
      text: `¿Seguro que querés cancelar el turno de ${appointment.client}?`,
      showCancelButton: true,
      confirmButtonText: "Cancelar turno",
      cancelButtonText: "Volver",
      confirmButtonColor: "var(--color-secondary)",
    });

    if (!result.isConfirmed) {
      return;
    }

    updateAppointmentStatus(appointment.id, "CANCELADO");
  };

  const handleNewAppointment = () => {
    setEditingAppointment(null);
    setAppointmentModalOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);

    setAppointmentModalOpen(true);
  };

const handleSaveAppointment = async (
  data: AppointmentFormData,
) => {
  try {
    if (editingAppointment) {
      await updateAppointment(
        editingAppointment.id,
        data,
      );

      await Swal.fire({
        icon: "success",
        title: "Turno actualizado",
        text: "Los cambios fueron guardados correctamente.",
        timer: 1300,
        showConfirmButton: false,
      });
    } else {
      await addAppointment(data);

      await Swal.fire({
        icon: "success",
        title: "Turno creado",
        text: "El nuevo turno fue registrado correctamente.",
        timer: 1300,
        showConfirmButton: false,
      });
    }

    /*
     * El modal solamente se cierra cuando
     * Supabase confirmó la operación.
     */
    setAppointmentModalOpen(false);
    setEditingAppointment(null);
  } catch (error) {
    console.error(
      "Error al guardar el turno:",
      error,
    );

    await Swal.fire({
      icon: "error",
      title: "No se pudo guardar el turno",
      text:
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado.",
      confirmButtonText: "Entendido",
      confirmButtonColor:
        "var(--color-primary)",
    });
  }
};

  const handleCloseAppointmentModal = () => {
    setAppointmentModalOpen(false);

    setEditingAppointment(null);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 text-[var(--color-text)]">
      {/* CABECERA */}
      <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5 sm:p-6 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            Gestión diaria
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Agenda de turnos
          </h2>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Consultá y administrá los turnos programados para cada jornada.
          </p>
        </div>

        <button
          onClick={handleNewAppointment}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-[var(--color-background-light)] transition hover:bg-[var(--color-primary-hover)] sm:w-auto"
        >
          <Plus size={18} />
          Nuevo turno
        </button>
      </section>

      {/* SELECTOR DE FECHA */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-2 sm:justify-start">
            <button
              onClick={() => changeDay(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] transition hover:bg-[var(--color-background)]"
              aria-label="Día anterior"
            >
              <ChevronLeft size={19} />
            </button>

            <button
              onClick={() => changeDay(1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] transition hover:bg-[var(--color-background)]"
              aria-label="Día siguiente"
            >
              <ChevronRight size={19} />
            </button>

            {!isToday && (
              <button
                onClick={goToToday}
                className="ml-1 rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--color-background)]"
              >
                Hoy
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-background)] text-[var(--color-primary)]">
              <CalendarCheck2 size={20} />
            </div>

            <div>
              <p className="capitalize font-semibold">
                {formattedSelectedDate}
              </p>

              <p className="text-sm text-[var(--color-text-secondary)]">
                {bookedSlots} turnos programados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RESUMEN */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5">
          <p className="text-sm text-[var(--color-text-secondary)]">Turnos</p>

          <p className="mt-2 text-3xl font-semibold">{bookedSlots}</p>

          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
            Programados para este día
          </p>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Completados
          </p>

          <p className="mt-2 text-3xl font-semibold">{completedAppointments}</p>

          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
            Clientes ya atendidos
          </p>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Horarios libres
          </p>

          <p className="mt-2 text-3xl font-semibold">{freeSlots}</p>

          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
            De {totalSlots} espacios disponibles
          </p>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Ocupación
          </p>

          <p className="mt-2 text-3xl font-semibold">{occupancy}%</p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-background)]">
            <div
              className="h-full rounded-full bg-[var(--color-primary)] transition-all"
              style={{
                width: `${occupancy}%`,
              }}
            />
          </div>
        </article>
      </section>

      {/* LISTADO */}
      <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)]">
        <div className="border-b border-[var(--color-border)] p-5 sm:p-6">
          <h3 className="font-semibold">Turnos del día</h3>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Ordenados cronológicamente.
          </p>
        </div>

        {dayAppointments.length === 0 ? (
          <div className="flex min-h-72 items-center justify-center p-8 text-center">
            <div className="max-w-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-background)] text-[var(--color-primary)]">
                <CalendarCheck2 size={25} />
              </div>

              <h4 className="mt-5 font-semibold">No hay turnos</h4>

              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                No existen reservas para esta fecha. Podés crear un turno
                manualmente.
              </p>

              <button
                onClick={handleNewAppointment}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-[var(--color-background-light)] transition hover:bg-[var(--color-primary-hover)]"
              >
                <Plus size={17} />
                Crear turno
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {dayAppointments.map((appointment) => (
              <article
                key={appointment.id}
                className="p-5 transition hover:bg-[var(--color-background)] sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* INFO PRINCIPAL */}
                  <div className="flex gap-4">
                    <div className="flex h-14 min-w-20 items-center justify-center rounded-xl bg-[var(--color-primary)] font-semibold text-[var(--color-background-light)]">
                      {appointment.time}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold">{appointment.client}</h4>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                            statusClasses[appointment.status]
                          }`}
                        >
                          {statusLabel[appointment.status]}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--color-text-secondary)]">
                        <span className="flex items-center gap-1.5">
                          <Scissors size={15} />

                          {appointment.service}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Clock3 size={15} />
                          {appointment.duration} min
                        </span>

                        <span className="flex items-center gap-1.5">
                          <UserRound size={15} />

                          {appointment.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ACCIONES */}
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <button
                      onClick={() => handleViewDetails(appointment)}
                      className="rounded-xl border border-[var(--color-border)] px-3.5 py-2 text-sm font-medium transition hover:bg-[var(--color-background)]"
                    >
                      Ver detalle
                    </button>

                    <button
                      onClick={() => handleEditAppointment(appointment)}
                      className="rounded-xl border border-[var(--color-border)] px-3.5 py-2 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-background)]"
                    >
                      Editar
                    </button>

                    {appointment.status === "PENDIENTE" && (
                      <button
                        onClick={() => handleConfirm(appointment)}
                        className="rounded-xl bg-[var(--color-accent)] px-3.5 py-2 text-sm font-medium text-[var(--color-background-light)] transition hover:bg-[var(--color-secondary)]"
                      >
                        Confirmar
                      </button>
                    )}

                    {appointment.status === "CONFIRMADO" && (
                      <button
                        onClick={() => handleComplete(appointment)}
                        className="rounded-xl bg-[var(--color-primary)] px-3.5 py-2 text-sm font-medium text-[var(--color-background-light)] transition hover:bg-[var(--color-primary-hover)]"
                      >
                        Completar
                      </button>
                    )}

                    {appointment.status !== "COMPLETADO" && (
                      <button
                        onClick={() => handleCancel(appointment)}
                        className="rounded-xl border border-[var(--color-secondary)] px-3.5 py-2 text-sm font-medium text-[var(--color-secondary)] transition hover:bg-[var(--color-background)]"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <AppointmentFormModal
        isOpen={appointmentModalOpen}
        initialDate={selectedDateKey}
        appointment={editingAppointment}
        onClose={handleCloseAppointmentModal}
        onSubmit={handleSaveAppointment}
      />
    </div>
  );
};

export default AdminAgenda;

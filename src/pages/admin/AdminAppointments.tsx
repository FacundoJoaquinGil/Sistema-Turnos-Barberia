import {
  CalendarDays,
  Check,
  Clock3,
  Pencil,
  Plus,
  Search,
  Scissors,
  UserRound,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import Swal from "sweetalert2";

import AppointmentFormModal from "../../components/admin/appointments/AppointmentFormModal";

import { useAppointments } from "../../context/AppointmentsContext";

import type {
  Appointment,
  AppointmentFormData,
  AppointmentStatus,
} from "../../types/appointment";

type StatusFilter =
  | "TODOS"
  | AppointmentStatus;

const statusLabel: Record<
  AppointmentStatus,
  string
> = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado",
};

const statusClasses: Record<
  AppointmentStatus,
  string
> = {
  PENDIENTE:
    "border-[var(--color-accent)] text-[var(--color-accent)]",

  CONFIRMADO:
    "border-[var(--color-primary)] text-[var(--color-primary)]",

  COMPLETADO:
    "border-[var(--color-secondary)] bg-[var(--color-secondary)] text-[var(--color-background-light)]",

  CANCELADO:
    "border-[var(--color-border)] text-[var(--color-text-secondary)] opacity-60",
};

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (
  date: string,
) => {
  return new Date(
    `${date}T00:00:00`,
  ).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const AdminAppointments = () => {
  const {
    appointments,
    addAppointment,
    updateAppointment,
    updateAppointmentStatus,
  } = useAppointments();

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<StatusFilter>(
    "TODOS",
  );

  const [dateFilter, setDateFilter] =
    useState("");

  const [
    appointmentModalOpen,
    setAppointmentModalOpen,
  ] = useState(false);

  const [
    editingAppointment,
    setEditingAppointment,
  ] = useState<Appointment | null>(
    null,
  );

  const filteredAppointments =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase();

      return appointments
        .filter((appointment) => {
          const matchesSearch =
            !normalizedSearch ||
            appointment.client
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            appointment.phone
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            appointment.service
              .toLowerCase()
              .includes(
                normalizedSearch,
              );

          const matchesStatus =
            statusFilter ===
              "TODOS" ||
            appointment.status ===
              statusFilter;

          const matchesDate =
            !dateFilter ||
            appointment.date ===
              dateFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesDate
          );
        })
        .sort((a, b) => {
          const first =
            `${a.date} ${a.time}`;

          const second =
            `${b.date} ${b.time}`;

          return first.localeCompare(
            second,
          );
        });
    }, [
      appointments,
      search,
      statusFilter,
      dateFilter,
    ]);

  const pendingCount =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "PENDIENTE",
    ).length;

  const confirmedCount =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "CONFIRMADO",
    ).length;

  const completedCount =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "COMPLETADO",
    ).length;

  const hasFilters =
    search !== "" ||
    statusFilter !== "TODOS" ||
    dateFilter !== "";

  const handleNewAppointment = () => {
    setEditingAppointment(null);
    setAppointmentModalOpen(true);
  };

  const handleEditAppointment = (
    appointment: Appointment,
  ) => {
    setEditingAppointment(
      appointment,
    );

    setAppointmentModalOpen(true);
  };

  const handleCloseModal = () => {
    setAppointmentModalOpen(false);
    setEditingAppointment(null);
  };

  const handleSaveAppointment = (
    data: AppointmentFormData,
  ) => {
    if (editingAppointment) {
      updateAppointment(
        editingAppointment.id,
        data,
      );

      Swal.fire({
        icon: "success",
        title: "Turno actualizado",
        text: "Los cambios fueron guardados correctamente.",
        timer: 1200,
        showConfirmButton: false,
      });
    } else {
      addAppointment(data);

      Swal.fire({
        icon: "success",
        title: "Turno creado",
        text: "El turno fue registrado correctamente.",
        timer: 1200,
        showConfirmButton: false,
      });
    }

    handleCloseModal();
  };

  const handleConfirm = async (
    appointment: Appointment,
  ) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Confirmar turno",
      text: `¿Confirmar el turno de ${appointment.client}?`,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Volver",
      confirmButtonColor:
        "var(--color-primary)",
    });

    if (!result.isConfirmed) {
      return;
    }

    updateAppointmentStatus(
      appointment.id,
      "CONFIRMADO",
    );
  };

  const handleComplete = async (
    appointment: Appointment,
  ) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Completar turno",
      text: `¿Marcar el turno de ${appointment.client} como completado?`,
      showCancelButton: true,
      confirmButtonText:
        "Marcar completado",
      cancelButtonText: "Volver",
      confirmButtonColor:
        "var(--color-primary)",
    });

    if (!result.isConfirmed) {
      return;
    }

    updateAppointmentStatus(
      appointment.id,
      "COMPLETADO",
    );
  };

  const handleCancel = async (
    appointment: Appointment,
  ) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Cancelar turno",
      text: `¿Seguro que querés cancelar el turno de ${appointment.client}?`,
      showCancelButton: true,
      confirmButtonText:
        "Cancelar turno",
      cancelButtonText: "Volver",
      confirmButtonColor:
        "var(--color-secondary)",
    });

    if (!result.isConfirmed) {
      return;
    }

    updateAppointmentStatus(
      appointment.id,
      "CANCELADO",
    );
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("TODOS");
    setDateFilter("");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 text-[var(--color-text)]">
      {/* HEADER */}
      <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5 sm:p-6 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            Administración
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Turnos
          </h2>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Consultá, buscá y administrá
            todos los turnos de la
            barbería.
          </p>
        </div>

        <button
          type="button"
          onClick={
            handleNewAppointment
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-[var(--color-background-light)] transition hover:bg-[var(--color-primary-hover)] sm:w-auto"
        >
          <Plus size={18} />

          Nuevo turno
        </button>
      </section>

      {/* RESUMEN */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Total
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {appointments.length}
          </p>

          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
            Turnos registrados
          </p>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Pendientes
          </p>

          <p className="mt-2 text-3xl font-semibold text-[var(--color-accent)]">
            {pendingCount}
          </p>

          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
            Esperando confirmación
          </p>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Confirmados
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {confirmedCount}
          </p>

          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
            Próximos a realizar
          </p>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Completados
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {completedCount}
          </p>

          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
            Trabajos realizados
          </p>
        </article>
      </section>

      {/* FILTROS */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_200px_200px_auto]">
          {/* BUSCADOR */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
            />

            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value,
                )
              }
              placeholder="Buscar cliente, teléfono o servicio..."
              className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] pl-12 pr-4 text-sm outline-none transition placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)]"
            />
          </div>

          {/* ESTADO */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target
                  .value as StatusFilter,
              )
            }
            className="h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] px-4 text-sm outline-none focus:border-[var(--color-primary)]"
          >
            <option value="TODOS">
              Todos los estados
            </option>

            <option value="PENDIENTE">
              Pendientes
            </option>

            <option value="CONFIRMADO">
              Confirmados
            </option>

            <option value="COMPLETADO">
              Completados
            </option>

            <option value="CANCELADO">
              Cancelados
            </option>
          </select>

          {/* FECHA */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) =>
              setDateFilter(
                e.target.value,
              )
            }
            className="h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] px-4 text-sm outline-none focus:border-[var(--color-primary)]"
          />

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-4 text-sm font-medium transition hover:bg-[var(--color-background)]"
            >
              <X size={17} />

              Limpiar
            </button>
          )}
        </div>

        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
          {filteredAppointments.length}{" "}
          {filteredAppointments.length ===
          1
            ? "resultado"
            : "resultados"}
        </p>
      </section>

      {/* RESULTADOS */}
      <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)]">
        {filteredAppointments.length ===
        0 ? (
          <div className="flex min-h-72 items-center justify-center p-8 text-center">
            <div className="max-w-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-background)] text-[var(--color-primary)]">
                <CalendarDays
                  size={25}
                />
              </div>

              <h3 className="mt-5 font-semibold">
                No encontramos turnos
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                Probá modificando los
                filtros o registrá un
                nuevo turno.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* DESKTOP */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <thead className="border-b border-[var(--color-border)] bg-[var(--color-background)] text-left">
                  <tr className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
                    <th className="px-6 py-4">
                      Fecha
                    </th>

                    <th className="px-6 py-4">
                      Cliente
                    </th>

                    <th className="px-6 py-4">
                      Servicio
                    </th>

                    <th className="px-6 py-4">
                      Estado
                    </th>

                    <th className="px-6 py-4">
                      Precio
                    </th>

                    <th className="px-6 py-4 text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--color-border)]">
                  {filteredAppointments.map(
                    (appointment) => (
                      <tr
                        key={
                          appointment.id
                        }
                        className="transition hover:bg-[var(--color-background)]"
                      >
                        <td className="px-6 py-5">
                          <p className="font-medium">
                            {formatDisplayDate(
                              appointment.date,
                            )}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                            <Clock3
                              size={13}
                            />

                            {
                              appointment.time
                            }
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-medium">
                            {
                              appointment.client
                            }
                          </p>

                          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                            {
                              appointment.phone
                            }
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <Scissors
                              size={15}
                              className="text-[var(--color-text-secondary)]"
                            />

                            <span className="text-sm">
                              {
                                appointment.service
                              }
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                            {
                              appointment.duration
                            }{" "}
                            min
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                              statusClasses[
                                appointment
                                  .status
                              ]
                            }`}
                          >
                            {
                              statusLabel[
                                appointment
                                  .status
                              ]
                            }
                          </span>
                        </td>

                        <td className="px-6 py-5 font-medium">
                          $
                          {appointment.price.toLocaleString(
                            "es-AR",
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleEditAppointment(
                                  appointment,
                                )
                              }
                              title="Editar turno"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] transition hover:bg-[var(--color-background)]"
                            >
                              <Pencil
                                size={
                                  15
                                }
                              />
                            </button>

                            {appointment.status ===
                              "PENDIENTE" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleConfirm(
                                    appointment,
                                  )
                                }
                                title="Confirmar"
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)] text-[var(--color-background-light)] transition hover:bg-[var(--color-secondary)]"
                              >
                                <Check
                                  size={
                                    16
                                  }
                                />
                              </button>
                            )}

                            {appointment.status ===
                              "CONFIRMADO" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleComplete(
                                    appointment,
                                  )
                                }
                                title="Completar"
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)] text-[var(--color-background-light)] transition hover:bg-[var(--color-primary-hover)]"
                              >
                                <Check
                                  size={
                                    16
                                  }
                                />
                              </button>
                            )}

                            {appointment.status !==
                              "COMPLETADO" &&
                              appointment.status !==
                                "CANCELADO" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCancel(
                                      appointment,
                                    )
                                  }
                                  title="Cancelar"
                                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-secondary)] text-[var(--color-secondary)] transition hover:bg-[var(--color-background)]"
                                >
                                  <X
                                    size={
                                      16
                                    }
                                  />
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            {/* MOBILE */}
            <div className="divide-y divide-[var(--color-border)] lg:hidden">
              {filteredAppointments.map(
                (appointment) => (
                  <article
                    key={
                      appointment.id
                    }
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">
                          {
                            appointment.client
                          }
                        </p>

                        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                          {
                            appointment.phone
                          }
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                          statusClasses[
                            appointment
                              .status
                          ]
                        }`}
                      >
                        {
                          statusLabel[
                            appointment
                              .status
                          ]
                        }
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 rounded-xl bg-[var(--color-background)] p-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={16}
                        />

                        {formatDisplayDate(
                          appointment.date,
                        )}

                        <span>•</span>

                        {
                          appointment.time
                        }
                      </div>

                      <div className="flex items-center gap-2">
                        <Scissors
                          size={16}
                        />

                        {
                          appointment.service
                        }
                      </div>

                      <div className="flex items-center gap-2">
                        <UserRound
                          size={16}
                        />

                        {
                          appointment.duration
                        }{" "}
                        min
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <p className="font-semibold">
                        $
                        {appointment.price.toLocaleString(
                          "es-AR",
                        )}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          handleEditAppointment(
                            appointment,
                          )
                        }
                        className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm font-medium"
                      >
                        <Pencil
                          size={15}
                        />

                        Editar
                      </button>
                    </div>

                    {(appointment.status ===
                      "PENDIENTE" ||
                      appointment.status ===
                        "CONFIRMADO") && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {appointment.status ===
                          "PENDIENTE" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleConfirm(
                                appointment,
                              )
                            }
                            className="rounded-xl bg-[var(--color-accent)] px-3 py-2.5 text-sm font-medium text-[var(--color-background-light)]"
                          >
                            Confirmar
                          </button>
                        )}

                        {appointment.status ===
                          "CONFIRMADO" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleComplete(
                                appointment,
                              )
                            }
                            className="rounded-xl bg-[var(--color-primary)] px-3 py-2.5 text-sm font-medium text-[var(--color-background-light)]"
                          >
                            Completar
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleCancel(
                              appointment,
                            )
                          }
                          className="rounded-xl border border-[var(--color-secondary)] px-3 py-2.5 text-sm font-medium text-[var(--color-secondary)]"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </article>
                ),
              )}
            </div>
          </>
        )}
      </section>

      <AppointmentFormModal
        isOpen={
          appointmentModalOpen
        }
        initialDate={formatDateKey(
          new Date(),
        )}
        appointment={
          editingAppointment
        }
        onClose={handleCloseModal}
        onSubmit={
          handleSaveAppointment
        }
      />
    </div>
  );
};

export default AdminAppointments;
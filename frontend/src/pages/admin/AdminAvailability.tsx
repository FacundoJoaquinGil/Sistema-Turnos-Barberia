import {
  Ban,
  CalendarOff,
  Clock3,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

import { useAvailability } from "../../context/AvailabilityContext";

import type {
  BlockedPeriodFormData,
  DayAvailability,
  WeekDay,
} from "../../types/availability";

const formatDate = (date: string) => {
  return new Date(
    `${date}T00:00:00`,
  ).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const emptyBlockedPeriod: BlockedPeriodFormData = {
  date: "",
  startTime: "",
  endTime: "",
  reason: "",
};

type DayAvailabilityUpdate = Partial<
  Omit<DayAvailability, "day" | "label">
>;

const AdminAvailability = () => {
  const {
    weeklySchedule,
    slotInterval,
    blockedDates,
    blockedPeriods,
    loading,
    error,
    updateDayAvailability,
    updateSlotInterval,
    blockDate,
    unblockDate,
    addBlockedPeriod,
    removeBlockedPeriod,
    refreshAvailability,
  } = useAvailability();

  const [newBlockedDate, setNewBlockedDate] =
    useState("");

  const [
    newBlockedPeriod,
    setNewBlockedPeriod,
  ] = useState<BlockedPeriodFormData>(
    emptyBlockedPeriod,
  );

  const executeAvailabilityAction = async (
    action: () => Promise<void>,
    errorTitle: string,
  ): Promise<boolean> => {
    try {
      await action();
      return true;
    } catch (actionError) {
      console.error(
        errorTitle,
        actionError,
      );

      const message =
        actionError instanceof Error
          ? actionError.message
          : "Ocurrió un error inesperado. Intentá nuevamente.";

      await Swal.fire({
        icon: "error",
        title: errorTitle,
        text: message,
        confirmButtonText: "Entendido",
        confirmButtonColor:
          "var(--color-primary)",
      });

      return false;
    }
  };

  const handleSlotIntervalChange = async (
    interval: number,
  ) => {
    await executeAvailabilityAction(
      () => updateSlotInterval(interval),
      "No se pudo actualizar el intervalo",
    );
  };

  const handleDayAvailabilityChange = async (
    day: WeekDay,
    data: DayAvailabilityUpdate,
  ) => {
    await executeAvailabilityAction(
      () =>
        updateDayAvailability(
          day,
          data,
        ),
      "No se pudo actualizar el horario",
    );
  };

  const handleBlockDate = async () => {
    if (!newBlockedDate) {
      await Swal.fire({
        icon: "warning",
        title: "Seleccioná una fecha",
        text: "Debés elegir el día que querés bloquear.",
        confirmButtonColor:
          "var(--color-primary)",
      });

      return;
    }

    if (
      blockedDates.includes(
        newBlockedDate,
      )
    ) {
      await Swal.fire({
        icon: "info",
        title: "Fecha ya bloqueada",
        text: "Ese día ya se encuentra marcado como no disponible.",
        confirmButtonColor:
          "var(--color-primary)",
      });

      return;
    }

    const success =
      await executeAvailabilityAction(
        () =>
          blockDate(newBlockedDate),
        "No se pudo bloquear la fecha",
      );

    if (success) {
      setNewBlockedDate("");
    }
  };

  const handleUnblockDate = async (
    date: string,
  ) => {
    const result = await Swal.fire({
      icon: "question",
      title: "¿Desbloquear fecha?",
      text: `${formatDate(date)} volverá a estar disponible.`,
      showCancelButton: true,
      confirmButtonText: "Desbloquear",
      cancelButtonText: "Cancelar",
      confirmButtonColor:
        "var(--color-primary)",
    });

    if (!result.isConfirmed) {
      return;
    }

    await executeAvailabilityAction(
      () => unblockDate(date),
      "No se pudo desbloquear la fecha",
    );
  };

  const handleAddBlockedPeriod =
    async () => {
      const {
        date,
        startTime,
        endTime,
      } = newBlockedPeriod;

      if (
        !date ||
        !startTime ||
        !endTime
      ) {
        await Swal.fire({
          icon: "warning",
          title: "Datos incompletos",
          text: "Seleccioná fecha, horario inicial y horario final.",
          confirmButtonColor:
            "var(--color-primary)",
        });

        return;
      }

      if (startTime >= endTime) {
        await Swal.fire({
          icon: "warning",
          title: "Horario inválido",
          text: "La hora final debe ser posterior a la hora inicial.",
          confirmButtonColor:
            "var(--color-primary)",
        });

        return;
      }

      const success =
        await executeAvailabilityAction(
          () =>
            addBlockedPeriod(
              newBlockedPeriod,
            ),
          "No se pudo agregar el bloqueo",
        );

      if (success) {
        setNewBlockedPeriod(
          emptyBlockedPeriod,
        );
      }
    };

  const handleRemoveBlockedPeriod =
    async (periodId: number) => {
      const result = await Swal.fire({
        icon: "question",
        title: "¿Eliminar bloqueo?",
        text: "Este horario volverá a estar disponible para recibir turnos.",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor:
          "var(--color-primary)",
      });

      if (!result.isConfirmed) {
        return;
      }

      await executeAvailabilityAction(
        () =>
          removeBlockedPeriod(
            periodId,
          ),
        "No se pudo eliminar el bloqueo",
      );
    };

  const handleRefresh = async () => {
    await executeAvailabilityAction(
      refreshAvailability,
      "No se pudo recargar la disponibilidad",
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-6">
        <div className="text-center">
          <RefreshCw className="mx-auto animate-spin text-[var(--color-primary)]" />

          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            Cargando disponibilidad...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 text-[var(--color-text)]">
      {/* HEADER */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5 sm:p-6">
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">
          Configuración
        </p>

        <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">
          Disponibilidad
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-secondary)]">
          Definí tus días y horarios de
          trabajo y bloqueá momentos en
          los que no aceptarás turnos.
        </p>
      </section>

      {/* ERROR */}
      {error && (
        <section className="flex flex-col gap-3 rounded-2xl border border-[var(--color-secondary)] bg-[var(--color-background-light)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-[var(--color-secondary)]">
              No se pudo cargar toda la
              disponibilidad
            </p>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void handleRefresh();
            }}
            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-4 text-sm font-medium transition hover:bg-[var(--color-background)]"
          >
            <RefreshCw size={16} />
            Reintentar
          </button>
        </section>
      )}

      {/* INTERVALOS */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">
              Intervalo de horarios
            </h3>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Define cada cuánto puede
              comenzar un nuevo turno.
            </p>
          </div>

          <select
            value={slotInterval}
            onChange={(event) => {
              void handleSlotIntervalChange(
                Number(
                  event.target.value,
                ),
              );
            }}
            className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] px-4 text-sm outline-none focus:border-[var(--color-primary)]"
          >
            <option value={15}>
              Cada 15 minutos
            </option>

            <option value={30}>
              Cada 30 minutos
            </option>

            <option value={45}>
              Cada 45 minutos
            </option>

            <option value={60}>
              Cada 60 minutos
            </option>
          </select>
        </div>
      </section>

      {/* HORARIO SEMANAL */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)]">
        <div className="border-b border-[var(--color-border)] p-5 sm:p-6">
          <h3 className="font-semibold">
            Horarios semanales
          </h3>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Configurá los días habituales
            de atención.
          </p>
        </div>

        <div className="divide-y divide-[var(--color-border)]">
          {weeklySchedule.map(
            (day) => {
              const invalidSchedule =
                day.isOpen &&
                day.startTime >=
                  day.endTime;

              return (
                <article
                  key={day.day}
                  className="p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        aria-pressed={
                          day.isOpen
                        }
                        aria-label={
                          day.isOpen
                            ? `Cerrar ${day.label}`
                            : `Abrir ${day.label}`
                        }
                        onClick={() => {
                          void handleDayAvailabilityChange(
                            day.day,
                            {
                              isOpen:
                                !day.isOpen,
                            },
                          );
                        }}
                        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                          day.isOpen
                            ? "bg-[var(--color-primary)]"
                            : "bg-[var(--color-border)]"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-5 w-5 rounded-full bg-[var(--color-background-light)] transition-all ${
                            day.isOpen
                              ? "left-6"
                              : "left-1"
                          }`}
                        />
                      </button>

                      <div>
                        <p className="font-medium">
                          {day.label}
                        </p>

                        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                          {day.isOpen
                            ? "Día de atención"
                            : "Cerrado"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="time"
                        disabled={
                          !day.isOpen
                        }
                        value={
                          day.startTime
                        }
                        onChange={(
                          event,
                        ) => {
                          void handleDayAvailabilityChange(
                            day.day,
                            {
                              startTime:
                                event
                                  .target
                                  .value,
                            },
                          );
                        }}
                        className="h-11 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] px-3 text-sm outline-none disabled:opacity-40 sm:w-36 sm:flex-none"
                      />

                      <span className="text-sm text-[var(--color-text-secondary)]">
                        a
                      </span>

                      <input
                        type="time"
                        disabled={
                          !day.isOpen
                        }
                        value={
                          day.endTime
                        }
                        onChange={(
                          event,
                        ) => {
                          void handleDayAvailabilityChange(
                            day.day,
                            {
                              endTime:
                                event
                                  .target
                                  .value,
                            },
                          );
                        }}
                        className="h-11 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] px-3 text-sm outline-none disabled:opacity-40 sm:w-36 sm:flex-none"
                      />
                    </div>
                  </div>

                  {invalidSchedule && (
                    <p className="mt-3 text-sm text-[var(--color-secondary)]">
                      El horario de cierre
                      debe ser posterior al
                      horario de apertura.
                    </p>
                  )}
                </article>
              );
            },
          )}
        </div>
      </section>

      {/* BLOQUEAR DÍAS */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-background)]">
            <CalendarOff size={20} />
          </div>

          <div>
            <h3 className="font-semibold">
              Días bloqueados
            </h3>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Ideal para feriados,
              vacaciones o días en los
              que no trabajarás.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="date"
            value={newBlockedDate}
            onChange={(event) =>
              setNewBlockedDate(
                event.target.value,
              )
            }
            className="h-11 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] px-4 text-sm outline-none focus:border-[var(--color-primary)]"
          />

          <button
            type="button"
            onClick={() => {
              void handleBlockDate();
            }}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 text-sm font-medium text-[var(--color-background-light)] transition hover:bg-[var(--color-primary-hover)]"
          >
            <Plus size={17} />
            Bloquear día
          </button>
        </div>

        {blockedDates.length > 0 ? (
          <div className="mt-5 space-y-2">
            {blockedDates
              .slice()
              .sort()
              .map((date) => (
                <div
                  key={date}
                  className="flex items-center justify-between rounded-xl bg-[var(--color-background)] p-3"
                >
                  <div className="flex items-center gap-2">
                    <Ban size={16} />

                    <span className="text-sm font-medium">
                      {formatDate(date)}
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label={`Desbloquear ${formatDate(date)}`}
                    onClick={() => {
                      void handleUnblockDate(
                        date,
                      );
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-secondary)] transition hover:bg-[var(--color-background-light)]"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-[var(--color-text-secondary)]">
            No hay días bloqueados.
          </p>
        )}
      </section>

      {/* BLOQUEAR HORARIOS */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5 sm:p-6">
        <div>
          <h3 className="font-semibold">
            Bloqueos de horario
          </h3>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Bloqueá períodos específicos,
            por ejemplo un descanso o
            trámite personal.
          </p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <input
            type="date"
            value={
              newBlockedPeriod.date
            }
            onChange={(event) =>
              setNewBlockedPeriod(
                (current) => ({
                  ...current,
                  date: event.target
                    .value,
                }),
              )
            }
            className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] px-3 text-sm outline-none focus:border-[var(--color-primary)]"
          />

          <input
            type="time"
            value={
              newBlockedPeriod.startTime
            }
            onChange={(event) =>
              setNewBlockedPeriod(
                (current) => ({
                  ...current,
                  startTime:
                    event.target.value,
                }),
              )
            }
            className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] px-3 text-sm outline-none focus:border-[var(--color-primary)]"
          />

          <input
            type="time"
            value={
              newBlockedPeriod.endTime
            }
            onChange={(event) =>
              setNewBlockedPeriod(
                (current) => ({
                  ...current,
                  endTime:
                    event.target.value,
                }),
              )
            }
            className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] px-3 text-sm outline-none focus:border-[var(--color-primary)]"
          />

          <button
            type="button"
            onClick={() => {
              void handleAddBlockedPeriod();
            }}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 text-sm font-medium text-[var(--color-background-light)] transition hover:bg-[var(--color-primary-hover)]"
          >
            <Plus size={17} />
            Agregar
          </button>
        </div>

        <input
          type="text"
          value={
            newBlockedPeriod.reason
          }
          onChange={(event) =>
            setNewBlockedPeriod(
              (current) => ({
                ...current,
                reason:
                  event.target.value,
              }),
            )
          }
          placeholder="Motivo opcional: almuerzo, trámite..."
          className="mt-3 h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] px-4 text-sm outline-none focus:border-[var(--color-primary)]"
        />

        {blockedPeriods.length > 0 ? (
          <div className="mt-5 space-y-3">
            {blockedPeriods.map(
              (period) => (
                <article
                  key={period.id}
                  className="flex flex-col justify-between gap-3 rounded-xl bg-[var(--color-background)] p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="font-medium">
                      {formatDate(
                        period.date,
                      )}
                    </p>

                    <p className="mt-1 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <Clock3 size={14} />

                      {period.startTime} -{" "}
                      {period.endTime}
                    </p>

                    {period.reason && (
                      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                        {period.reason}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      void handleRemoveBlockedPeriod(
                        period.id,
                      );
                    }}
                    className="flex h-9 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-3 text-sm text-[var(--color-secondary)] transition hover:bg-[var(--color-background-light)]"
                  >
                    <Trash2 size={15} />
                    Eliminar
                  </button>
                </article>
              ),
            )}
          </div>
        ) : (
          <p className="mt-5 text-sm text-[var(--color-text-secondary)]">
            No hay horarios bloqueados.
          </p>
        )}
      </section>
    </div>
  );
};

export default AdminAvailability;
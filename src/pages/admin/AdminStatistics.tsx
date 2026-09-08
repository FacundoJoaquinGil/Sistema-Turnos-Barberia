import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  ReceiptText,
  Scissors,
  TrendingDown,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

import { useAppointments } from "../../context/AppointmentsContext";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseDate = (date: string) => {
  return new Date(`${date}T00:00:00`);
};

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
}: StatCardProps) => {
  return (
    <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-[var(--color-primary)]">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-background)] text-[var(--color-primary)]">
          <Icon size={21} />
        </div>
      </div>

      <p className="text-xs text-[var(--color-text-secondary)]">
        {description}
      </p>
    </article>
  );
};

const AdminStatistics = () => {
  const { appointments } = useAppointments();

  const statistics = useMemo(() => {
    const today = new Date();

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const previousMonthDate = new Date(
      currentYear,
      currentMonth - 1,
      1,
    );

    const previousYear =
      previousMonthDate.getFullYear();

    const previousMonth =
      previousMonthDate.getMonth();

    const currentMonthAppointments =
      appointments.filter((appointment) => {
        const appointmentDate = parseDate(
          appointment.date,
        );

        return (
          appointmentDate.getFullYear() ===
            currentYear &&
          appointmentDate.getMonth() ===
            currentMonth
        );
      });

    const previousMonthAppointments =
      appointments.filter((appointment) => {
        const appointmentDate = parseDate(
          appointment.date,
        );

        return (
          appointmentDate.getFullYear() ===
            previousYear &&
          appointmentDate.getMonth() ===
            previousMonth
        );
      });

    const completedCurrentMonth =
      currentMonthAppointments.filter(
        (appointment) =>
          appointment.status === "COMPLETADO",
      );

    const completedPreviousMonth =
      previousMonthAppointments.filter(
        (appointment) =>
          appointment.status === "COMPLETADO",
      );

    const currentRevenue =
      completedCurrentMonth.reduce(
        (total, appointment) =>
          total + appointment.price,
        0,
      );

    const previousRevenue =
      completedPreviousMonth.reduce(
        (total, appointment) =>
          total + appointment.price,
        0,
      );

    const averageTicket =
      completedCurrentMonth.length > 0
        ? currentRevenue /
          completedCurrentMonth.length
        : 0;

    const uniqueClients = new Set(
      completedCurrentMonth.map(
        (appointment) => appointment.client,
      ),
    ).size;

    let revenueVariation = 0;

    if (previousRevenue > 0) {
      revenueVariation =
        ((currentRevenue - previousRevenue) /
          previousRevenue) *
        100;
    } else if (currentRevenue > 0) {
      revenueVariation = 100;
    }

    const lastSevenDays = Array.from(
      { length: 7 },
      (_, index) => {
        const date = new Date(today);

        date.setDate(
          today.getDate() - (6 - index),
        );

        const dateKey = formatDateKey(date);

        const revenue = appointments
          .filter(
            (appointment) =>
              appointment.date === dateKey &&
              appointment.status ===
                "COMPLETADO",
          )
          .reduce(
            (total, appointment) =>
              total + appointment.price,
            0,
          );

        return {
          date: dateKey,

          label: date
            .toLocaleDateString("es-AR", {
              weekday: "short",
            })
            .replace(".", ""),

          day: date.getDate(),

          revenue,
        };
      },
    );

    const maxDailyRevenue = Math.max(
      ...lastSevenDays.map(
        (day) => day.revenue,
      ),
      1,
    );

    const statusData = [
      {
        label: "Completados",
        status: "COMPLETADO",
        icon: CheckCircle2,
      },
      {
        label: "Confirmados",
        status: "CONFIRMADO",
        icon: CalendarDays,
      },
      {
        label: "Pendientes",
        status: "PENDIENTE",
        icon: Clock3,
      },
      {
        label: "Cancelados",
        status: "CANCELADO",
        icon: XCircle,
      },
    ].map((item) => {
      const amount =
        currentMonthAppointments.filter(
          (appointment) =>
            appointment.status === item.status,
        ).length;

      const percentage =
        currentMonthAppointments.length > 0
          ? (amount /
              currentMonthAppointments.length) *
            100
          : 0;

      return {
        ...item,
        amount,
        percentage,
      };
    });

    const servicesMap =
      completedCurrentMonth.reduce<
        Record<
          string,
          {
            quantity: number;
            revenue: number;
          }
        >
      >((accumulator, appointment) => {
        if (!accumulator[appointment.service]) {
          accumulator[appointment.service] = {
            quantity: 0,
            revenue: 0,
          };
        }

        accumulator[
          appointment.service
        ].quantity += 1;

        accumulator[
          appointment.service
        ].revenue += appointment.price;

        return accumulator;
      }, {});

    const topServices = Object.entries(
      servicesMap,
    )
      .map(([service, data]) => ({
        service,
        ...data,
      }))
      .sort(
        (a, b) => b.quantity - a.quantity,
      )
      .slice(0, 5);

    return {
      currentMonthAppointments,
      completedCurrentMonth,
      currentRevenue,
      previousRevenue,
      averageTicket,
      uniqueClients,
      revenueVariation,
      lastSevenDays,
      maxDailyRevenue,
      statusData,
      topServices,
    };
  }, [appointments]);

  const monthName = new Date().toLocaleDateString(
    "es-AR",
    {
      month: "long",
      year: "numeric",
    },
  );

  const revenueVariationIsPositive =
    statistics.revenueVariation >= 0;

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary)] text-[var(--color-background-light)]">
            <BarChart3 size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
              Estadísticas
            </h1>

            <p className="text-sm capitalize text-[var(--color-text-secondary)]">
              Resumen de {monthName}
            </p>
          </div>
        </div>
      </header>

      {/* CARDS */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Facturación del mes"
          value={currencyFormatter.format(
            statistics.currentRevenue,
          )}
          description="Ingresos de turnos completados"
          icon={CircleDollarSign}
        />

        <StatCard
          title="Turnos del mes"
          value={String(
            statistics
              .currentMonthAppointments.length,
          )}
          description={`${statistics.completedCurrentMonth.length} turnos completados`}
          icon={CalendarDays}
        />

        <StatCard
          title="Clientes atendidos"
          value={String(
            statistics.uniqueClients,
          )}
          description="Clientes únicos este mes"
          icon={Users}
        />

        <StatCard
          title="Ticket promedio"
          value={currencyFormatter.format(
            statistics.averageTicket,
          )}
          description="Promedio por turno completado"
          icon={ReceiptText}
        />
      </section>

      {/* COMPARACIÓN */}

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-primary)]">
              Rendimiento mensual
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Comparación de facturación con el
              mes anterior
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-[var(--color-background)] px-4 py-3">
            {revenueVariationIsPositive ? (
              <TrendingUp
                size={20}
                className="text-[var(--color-accent)]"
              />
            ) : (
              <TrendingDown
                size={20}
                className="text-[var(--color-accent)]"
              />
            )}

            <div>
              <p className="text-lg font-bold text-[var(--color-primary)]">
                {revenueVariationIsPositive
                  ? "+"
                  : ""}
                {statistics.revenueVariation.toFixed(
                  1,
                )}
                %
              </p>

              <p className="text-xs text-[var(--color-text-secondary)]">
                respecto al mes anterior
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--color-border)] p-4">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Mes actual
            </p>

            <p className="mt-2 text-xl font-bold text-[var(--color-primary)]">
              {currencyFormatter.format(
                statistics.currentRevenue,
              )}
            </p>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] p-4">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Mes anterior
            </p>

            <p className="mt-2 text-xl font-bold text-[var(--color-primary)]">
              {currencyFormatter.format(
                statistics.previousRevenue,
              )}
            </p>
          </div>
        </div>
      </section>

      {/* GRÁFICO 7 DÍAS */}

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5 sm:p-6">
        <div className="mb-7">
          <h2 className="text-lg font-bold text-[var(--color-primary)]">
            Facturación de los últimos 7 días
          </h2>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Ingresos generados por turnos
            completados
          </p>
        </div>

        <div className="flex h-64 items-end justify-between gap-2 sm:gap-4">
          {statistics.lastSevenDays.map(
            (day) => {
              const height =
                day.revenue === 0
                  ? 4
                  : Math.max(
                      (day.revenue /
                        statistics.maxDailyRevenue) *
                        100,
                      8,
                    );

              return (
                <div
                  key={day.date}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >
                  <div className="mb-2 hidden text-center text-xs font-medium text-[var(--color-text-secondary)] sm:block">
                    {day.revenue > 0
                      ? currencyFormatter.format(
                          day.revenue,
                        )
                      : "-"}
                  </div>

                  <div className="flex h-44 w-full items-end justify-center rounded-lg bg-[var(--color-background)] px-1">
                    <div
                      className="w-full max-w-12 rounded-t-lg bg-[var(--color-accent)] transition-all duration-300"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>

                  <div className="mt-3 text-center">
                    <p className="text-xs font-semibold capitalize text-[var(--color-primary)] sm:text-sm">
                      {day.label}
                    </p>

                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {day.day}
                    </p>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* ESTADOS */}

        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[var(--color-primary)]">
              Estado de los turnos
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Distribución durante el mes actual
            </p>
          </div>

          <div className="space-y-5">
            {statistics.statusData.map(
              ({
                label,
                amount,
                percentage,
                icon: Icon,
              }) => (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]">
                      <Icon size={17} />

                      {label}
                    </div>

                    <span className="text-sm font-semibold text-[var(--color-primary)]">
                      {amount}
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-[var(--color-background)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-accent)] transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-right text-xs text-[var(--color-text-secondary)]">
                    {percentage.toFixed(0)}%
                  </p>
                </div>
              ),
            )}
          </div>
        </section>

        {/* SERVICIOS */}

        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--color-primary)]">
              <Scissors size={19} />

              Servicios más realizados
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Ranking del mes actual
            </p>
          </div>

          {statistics.topServices.length === 0 ? (
            <div className="flex min-h-52 flex-col items-center justify-center text-center">
              <Scissors
                size={36}
                className="mb-3 text-[var(--color-text-secondary)]"
              />

              <p className="font-medium text-[var(--color-primary)]">
                Todavía no hay datos
              </p>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Los servicios aparecerán cuando
                existan turnos completados.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {statistics.topServices.map(
                (service, index) => (
                  <div
                    key={service.service}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-background)] text-sm font-bold text-[var(--color-primary)]">
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[var(--color-primary)]">
                          {service.service}
                        </p>

                        <p className="text-xs text-[var(--color-text-secondary)]">
                          {service.quantity}{" "}
                          {service.quantity === 1
                            ? "turno"
                            : "turnos"}
                        </p>
                      </div>
                    </div>

                    <p className="shrink-0 text-sm font-bold text-[var(--color-primary)]">
                      {currencyFormatter.format(
                        service.revenue,
                      )}
                    </p>
                  </div>
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminStatistics;
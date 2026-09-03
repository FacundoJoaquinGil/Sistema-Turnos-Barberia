import {
  ArrowRight,
  CalendarCheck2,
  CalendarPlus,
  CircleDollarSign,
  Clock3,
  Scissors,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router";

const stats = [
  {
    label: "Turnos de hoy",
    value: "8",
    helper: "6 confirmados",
    icon: CalendarCheck2,
  },
  {
    label: "Ingresos del día",
    value: "$68.000",
    helper: "Estimado",
    icon: CircleDollarSign,
  },
  {
    label: "Clientes atendidos",
    value: "5",
    helper: "3 pendientes",
    icon: UsersRound,
  },
  {
    label: "Próximo turno",
    value: "10:30",
    helper: "Martín Pérez",
    icon: Clock3,
  },
];

const appointments = [
  {
    id: 1,
    time: "10:30",
    client: "Martín Pérez",
    service: "Corte clásico",
    duration: "45 min",
    status: "Confirmado",
  },
  {
    id: 2,
    time: "11:30",
    client: "Lautaro Gómez",
    service: "Corte + Barba",
    duration: "60 min",
    status: "Pendiente",
  },
  {
    id: 3,
    time: "13:00",
    client: "Nicolás Ruiz",
    service: "Barba",
    duration: "30 min",
    status: "Confirmado",
  },
  {
    id: 4,
    time: "15:00",
    client: "Franco Díaz",
    service: "Corte degradado",
    duration: "45 min",
    status: "Confirmado",
  },
];

const AdminDashboard = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* BIENVENIDA */}
      <section className="rounded-2xl bg-[var(--color-primary)] p-6 text-white sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm text-zinc-400">
              Jueves, 3 de septiembre
            </p>

            <h2 className="text-2xl font-semibold sm:text-3xl">
              Buenos días 👋
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
              Tenés 8 turnos
              programados para hoy.
              Revisá tu agenda y prepará
              tu jornada.
            </p>
          </div>

          <Link
            to="/admin/agenda"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-[var(--color-text)] transition hover:bg-zinc-200 md:w-auto"
          >
            <CalendarCheck2
              size={18}
            />

            Ver agenda
          </Link>
        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(
          ({
            label,
            value,
            helper,
            icon: Icon,
          }) => (
            <article
              key={label}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-zinc-500">
                    {label}
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text)]">
                    {value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                  <Icon size={20} />
                </div>
              </div>

              <p className="mt-4 text-xs text-zinc-400">
                {helper}
              </p>
            </article>
          ),
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* PRÓXIMOS TURNOS */}
        <section className="rounded-2xl border border-[var(--color-border)] bg-white">
          <div className="flex items-center justify-between border-b border-zinc-100 p-5 sm:p-6">
            <div>
              <h3 className="font-semibold text-[var(--color-text)]">
                Próximos turnos
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Turnos restantes para
                hoy.
              </p>
            </div>

            <Link
              to="/admin/turnos"
              className="hidden items-center gap-1 text-sm font-medium text-zinc-700 hover:text-[var(--color-text)] sm:flex"
            >
              Ver todos

              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100">
            {appointments.map(
              (appointment) => (
                <article
                  key={appointment.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-[var(--color-background)] sm:flex-row sm:items-center sm:justify-between sm:p-6"
                >
                  <div className="flex gap-4">
                    <div className="flex h-12 min-w-16 items-center justify-center rounded-xl bg-zinc-100 text-sm font-semibold text-[var(--color-secondary)]">
                      {appointment.time}
                    </div>

                    <div>
                      <p className="font-medium text-[var(--color-text)]">
                        {
                          appointment.client
                        }
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                        <span>
                          {
                            appointment.service
                          }
                        </span>

                        <span>•</span>

                        <span>
                          {
                            appointment.duration
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                      appointment.status ===
                      "Confirmado"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </article>
              ),
            )}
          </div>
        </section>

        {/* COLUMNA DERECHA */}
        <div className="space-y-6">
          {/* ACCESOS RÁPIDOS */}
          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:p-6">
            <h3 className="font-semibold text-[var(--color-text)]">
              Accesos rápidos
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Acciones frecuentes.
            </p>

            <div className="mt-5 space-y-3">
              <Link
                to="/admin/turnos"
                className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] p-4 transition hover:bg-[var(--color-background)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
                  <CalendarPlus
                    size={18}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-[var(--color-secondary)]">
                    Nuevo turno
                  </p>

                  <p className="text-xs text-zinc-500">
                    Reservar manualmente
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/clientes"
                className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] p-4 transition hover:bg-[var(--color-background)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                  <UserPlus size={18} />
                </div>

                <div>
                  <p className="text-sm font-medium text-[var(--color-secondary)]">
                    Nuevo cliente
                  </p>

                  <p className="text-xs text-zinc-500">
                    Registrar cliente
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/servicios"
                className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] p-4 transition hover:bg-[var(--color-background)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                  <Scissors size={18} />
                </div>

                <div>
                  <p className="text-sm font-medium text-[var(--color-secondary)]">
                    Servicios
                  </p>

                  <p className="text-xs text-zinc-500">
                    Precios y duración
                  </p>
                </div>
              </Link>
            </div>
          </section>

          {/* RESUMEN */}
          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:p-6">
            <h3 className="font-semibold text-[var(--color-text)]">
              Jornada de hoy
            </h3>

            <div className="mt-5">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-zinc-500">
                  Turnos completados
                </span>

                <span className="font-medium text-[var(--color-secondary)]">
                  5 / 8
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                <div className="h-full w-[62.5%] rounded-full bg-[var(--color-primary)]" />
              </div>

              <p className="mt-4 text-sm leading-6 text-zinc-500">
                Te quedan{" "}
                <span className="font-medium text-[var(--color-secondary)]">
                  3 turnos
                </span>{" "}
                para finalizar la
                jornada.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
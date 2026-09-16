import {
  CalendarDays,
  Clock3,
  History,
  Pencil,
  Phone,
  Plus,
  Search,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import Swal from "sweetalert2";

import {
  useMemo,
  useState,
} from "react";

import ClientFormModal from "../../components/admin/clients/ClientFormModal";

import { useAppointments } from "../../context/AppointmentsContext";
import { useClients } from "../../context/ClientsContext";

import type {
  Client,
  ClientFormData,
} from "../../types/client";

const formatDate = (
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

const AdminClients = () => {
  const {
  clients,
  createClient,
  updateClient,
  isPhoneInUse,
} = useClients();

  const {
    appointments,
    updateAppointmentsClientSnapshot,
  } = useAppointments();

  const [search, setSearch] =
    useState("");

  const [
    clientModalOpen,
    setClientModalOpen,
  ] = useState(false);

  const [
    editingClient,
    setEditingClient,
  ] = useState<Client | null>(
    null,
  );

  const [
    historyClient,
    setHistoryClient,
  ] = useState<Client | null>(
    null,
  );

  const filteredClients =
    useMemo(() => {
      const normalized =
        search.trim().toLowerCase();

      if (!normalized) {
        return clients;
      }

      return clients.filter(
        (client) =>
          client.name
            .toLowerCase()
            .includes(normalized) ||
          client.phone
            .toLowerCase()
            .includes(normalized),
      );
    }, [clients, search]);

  const getClientAppointments = (
    clientId: number,
  ) => {
    return appointments
      .filter(
        (appointment) =>
          appointment.clientId ===
          clientId,
      )
      .sort((a, b) =>
        `${b.date}${b.time}`.localeCompare(
          `${a.date}${a.time}`,
        ),
      );
  };

  const getLastVisit = (
    clientId: number,
  ) => {
    const completed =
      getClientAppointments(
        clientId,
      ).filter(
        (appointment) =>
          appointment.status ===
          "COMPLETADO",
      );

    return completed[0]?.date ?? null;
  };

  const handleNewClient = () => {
    setEditingClient(null);
    setClientModalOpen(true);
  };

  const handleEditClient = (
    client: Client,
  ) => {
    setEditingClient(client);
    setClientModalOpen(true);
  };

  const handleCloseModal = () => {
    setClientModalOpen(false);
    setEditingClient(null);
  };

  const handleSaveClient = async (
  data: ClientFormData,
) => {
  if (
    isPhoneInUse(
      data.phone,
      editingClient?.id,
    )
  ) {
    await Swal.fire({
      icon: "warning",
      title: "Teléfono existente",
      text: "Ya existe un cliente con ese teléfono.",
      confirmButtonText: "Entendido",
      confirmButtonColor:
        "var(--color-primary)",
    });

    return;
  }

  try {
    if (editingClient) {
      const updatedClient =
        await updateClient(
          editingClient.id,
          data,
        );

      /*
       * Mientras AppointmentsContext continúe
       * trabajando con mocks, conservamos sus
       * datos duplicados actualizados.
       */
      updateAppointmentsClientSnapshot(
        updatedClient.id,
        updatedClient.name,
        updatedClient.phone,
      );

      await Swal.fire({
        icon: "success",
        title: "Cliente actualizado",
        timer: 1200,
        showConfirmButton: false,
      });
    } else {
      await createClient(data);

      await Swal.fire({
        icon: "success",
        title: "Cliente creado",
        timer: 1200,
        showConfirmButton: false,
      });
    }

    handleCloseModal();
  } catch (error) {
    await Swal.fire({
      icon: "error",
      title: "No se pudo guardar",
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

  return (
    <div className="mx-auto max-w-7xl space-y-6 text-[var(--color-text)]">
      {/* HEADER */}
      <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5 sm:p-6 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            Administración
          </p>

          <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">
            Clientes
          </h2>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Administrá los clientes y
            consultá su historial de
            turnos.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNewClient}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-[var(--color-background-light)] transition hover:bg-[var(--color-primary-hover)] sm:w-auto"
        >
          <Plus size={18} />

          Nuevo cliente
        </button>
      </section>

      {/* RESUMEN */}
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Clientes
              </p>

              <p className="mt-2 text-3xl font-semibold">
                {clients.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-background)]">
              <UsersRound size={20} />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Con turnos
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {
              clients.filter(
                (client) =>
                  getClientAppointments(
                    client.id,
                  ).length > 0,
              ).length
            }
          </p>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Atendidos
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {
              clients.filter(
                (client) =>
                  getLastVisit(
                    client.id,
                  ) !== null,
              ).length
            }
          </p>
        </article>
      </section>

      {/* BUSCADOR */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-4 sm:p-5">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
          />

          <input
            type="search"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Buscar por nombre o teléfono..."
            className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] pl-12 pr-12 text-sm outline-none transition focus:border-[var(--color-primary)]"
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg hover:bg-[var(--color-background)]"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
          {filteredClients.length}{" "}
          {filteredClients.length === 1
            ? "cliente"
            : "clientes"}
        </p>
      </section>

      {/* CLIENTES */}
      <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)]">
        {filteredClients.length === 0 ? (
          <div className="flex min-h-72 items-center justify-center p-8 text-center">
            <div>
              <UserRound
                size={30}
                className="mx-auto text-[var(--color-text-secondary)]"
              />

              <h3 className="mt-4 font-semibold">
                No encontramos clientes
              </h3>

              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                Probá modificando la
                búsqueda.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filteredClients.map(
              (client) => {
                const clientAppointments =
                  getClientAppointments(
                    client.id,
                  );

                const lastVisit =
                  getLastVisit(
                    client.id,
                  );

                return (
                  <article
                    key={client.id}
                    className="p-5 transition hover:bg-[var(--color-background)] sm:p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-background-light)]">
                          <UserRound
                            size={19}
                          />
                        </div>

                        <div>
                          <h3 className="font-semibold">
                            {client.name}
                          </h3>

                          <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
                            <Phone
                              size={14}
                            />

                            {
                              client.phone
                            }
                          </p>

                          {client.notes && (
                            <p className="mt-2 max-w-xl text-sm text-[var(--color-text-secondary)]">
                              {
                                client.notes
                              }
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[430px]">
                        <div className="rounded-xl bg-[var(--color-background)] p-3">
                          <p className="text-xs text-[var(--color-text-secondary)]">
                            Turnos
                          </p>

                          <p className="mt-1 font-semibold">
                            {
                              clientAppointments.length
                            }
                          </p>
                        </div>

                        <div className="rounded-xl bg-[var(--color-background)] p-3">
                          <p className="text-xs text-[var(--color-text-secondary)]">
                            Última visita
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            {lastVisit
                              ? formatDate(
                                  lastVisit,
                                )
                              : "Sin visitas"}
                          </p>
                        </div>

                        <div className="col-span-2 flex gap-2 sm:col-span-1 sm:justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setHistoryClient(
                                client,
                              )
                            }
                            title="Ver historial"
                            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-3 text-sm transition hover:bg-[var(--color-background)] sm:flex-none"
                          >
                            <History
                              size={16}
                            />

                            <span className="sm:hidden">
                              Historial
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleEditClient(
                                client,
                              )
                            }
                            title="Editar"
                            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-3 text-sm text-[var(--color-background-light)] transition hover:bg-[var(--color-primary-hover)] sm:flex-none"
                          >
                            <Pencil
                              size={15}
                            />

                            <span className="sm:hidden">
                              Editar
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        )}
      </section>

      {/* FORMULARIO */}
      <ClientFormModal
        isOpen={clientModalOpen}
        client={editingClient}
        onClose={handleCloseModal}
        onSubmit={handleSaveClient}
      />

      {/* HISTORIAL */}
      {historyClient && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-5"
          style={{
            background:
              "color-mix(in srgb, var(--color-primary) 45%, transparent)",
          }}
        >
          <button
            type="button"
            aria-label="Cerrar historial"
            onClick={() =>
              setHistoryClient(null)
            }
            className="absolute inset-0"
          />

          <section className="relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-3xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5 sm:max-w-2xl sm:rounded-3xl sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Historial
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {historyClient.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setHistoryClient(
                    null,
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {getClientAppointments(
                historyClient.id,
              ).length === 0 ? (
                <div className="rounded-2xl bg-[var(--color-background)] p-6 text-center">
                  <CalendarDays
                    size={25}
                    className="mx-auto"
                  />

                  <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                    Este cliente todavía
                    no tiene turnos.
                  </p>
                </div>
              ) : (
                getClientAppointments(
                  historyClient.id,
                ).map(
                  (appointment) => (
                    <article
                      key={
                        appointment.id
                      }
                      className="rounded-2xl border border-[var(--color-border)] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium">
                            {
                              appointment.service
                            }
                          </p>

                          <p className="mt-2 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                            <CalendarDays
                              size={14}
                            />

                            {formatDate(
                              appointment.date,
                            )}

                            <Clock3
                              size={14}
                            />

                            {
                              appointment.time
                            }
                          </p>
                        </div>

                        <p className="font-semibold">
                          $
                          {appointment.price.toLocaleString(
                            "es-AR",
                          )}
                        </p>
                      </div>
                    </article>
                  ),
                )
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminClients;
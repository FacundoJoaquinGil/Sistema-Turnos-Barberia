import {
  Clock3,
  DollarSign,
  Pencil,
  Plus,
  Power,
  Search,
  Scissors,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import Swal from "sweetalert2";

import ServiceFormModal from "../../components/admin/services/ServiceFormModal";

import {
  useServices,
} from "../../context/ServicesContext";

import type {
  Service,
  ServiceFormData,
} from "../../types/service";

const AdminServices = () => {
  const {
    services,
    loading,
    error,
    createService,
    updateService,
    toggleServiceStatus,
  } = useServices();

  const [search, setSearch] =
    useState("");

  const [
    serviceModalOpen,
    setServiceModalOpen,
  ] = useState(false);

  const [
    editingService,
    setEditingService,
  ] = useState<Service | null>(
    null,
  );

  const [
    savingService,
    setSavingService,
  ] = useState(false);

  const [
    togglingServiceId,
    setTogglingServiceId,
  ] = useState<number | null>(
    null,
  );

  /*
   * FILTRO DE SERVICIOS
   */
  const filteredServices =
    useMemo(() => {
      const normalized =
        search
          .trim()
          .toLowerCase();

      if (!normalized) {
        return services;
      }

      return services.filter(
        (service) =>
          service.name
            .toLowerCase()
            .includes(
              normalized,
            ) ||
          service.description
            ?.toLowerCase()
            .includes(
              normalized,
            ),
      );
    }, [services, search]);

  /*
   * ESTADÍSTICAS
   */
  const activeServices =
    services.filter(
      (service) =>
        service.active,
    ).length;

  const inactiveServices =
    services.length -
    activeServices;

  const averagePrice =
    services.length > 0
      ? Math.round(
          services.reduce(
            (
              total,
              service,
            ) =>
              total +
              service.price,
            0,
          ) /
            services.length,
        )
      : 0;

  /*
   * ABRIR MODAL PARA CREAR
   */
  const handleNewService = () => {
    setEditingService(null);
    setServiceModalOpen(true);
  };

  /*
   * ABRIR MODAL PARA EDITAR
   */
  const handleEditService = (
    service: Service,
  ) => {
    setEditingService(service);
    setServiceModalOpen(true);
  };

  /*
   * CERRAR MODAL
   */
  const handleCloseModal = () => {
    if (savingService) {
      return;
    }

    setServiceModalOpen(false);
    setEditingService(null);
  };

  /*
   * VERIFICAR NOMBRE REPETIDO
   *
   * Excluimos el servicio que se está
   * editando para permitir mantener
   * su mismo nombre.
   */
  const isServiceNameInUse = (
    name: string,
    ignoredServiceId?: number,
  ) => {
    const normalizedName =
      name
        .trim()
        .toLowerCase();

    return services.some(
      (service) =>
        service.id !==
          ignoredServiceId &&
        service.name
          .trim()
          .toLowerCase() ===
          normalizedName,
    );
  };

  /*
   * CREAR / EDITAR SERVICIO
   */
  const handleSaveService =
    async (
      data: ServiceFormData,
    ) => {
      if (
        isServiceNameInUse(
          data.name,
          editingService?.id,
        )
      ) {
        await Swal.fire({
          icon: "warning",
          title:
            "Servicio existente",
          text: "Ya existe un servicio con ese nombre.",
          confirmButtonText:
            "Entendido",
          confirmButtonColor:
            "var(--color-primary)",
        });

        return;
      }

      try {
        setSavingService(true);

        if (editingService) {
          await updateService(
            editingService.id,
            data,
          );

          await Swal.fire({
            icon: "success",
            title:
              "Servicio actualizado",
            text: "Los cambios se guardaron correctamente.",
            timer: 1400,
            showConfirmButton:
              false,
          });
        } else {
          await createService(
            data,
          );

          await Swal.fire({
            icon: "success",
            title:
              "Servicio creado",
            text: "El servicio se creó correctamente.",
            timer: 1400,
            showConfirmButton:
              false,
          });
        }

        setServiceModalOpen(
          false,
        );

        setEditingService(
          null,
        );
      } catch (error) {
        console.error(
          "Error al guardar servicio:",
          error,
        );

        await Swal.fire({
          icon: "error",
          title:
            "No se pudo guardar",
          text: editingService
            ? "Ocurrió un error al actualizar el servicio."
            : "Ocurrió un error al crear el servicio.",
          confirmButtonText:
            "Entendido",
          confirmButtonColor:
            "var(--color-primary)",
        });
      } finally {
        setSavingService(
          false,
        );
      }
    };

  /*
   * ACTIVAR / DESACTIVAR
   */
  const handleToggleStatus =
    async (
      service: Service,
    ) => {
      const action =
        service.active
          ? "desactivar"
          : "activar";

      const result =
        await Swal.fire({
          icon: "question",
          title: `${
            service.active
              ? "Desactivar"
              : "Activar"
          } servicio`,
          text: `¿Querés ${action} "${service.name}"?`,
          showCancelButton:
            true,
          confirmButtonText:
            service.active
              ? "Desactivar"
              : "Activar",
          cancelButtonText:
            "Cancelar",
          confirmButtonColor:
            "var(--color-primary)",
        });

      if (
        !result.isConfirmed
      ) {
        return;
      }

      try {
        setTogglingServiceId(
          service.id,
        );

        await toggleServiceStatus(
          service.id,
        );

        await Swal.fire({
          icon: "success",
          title: service.active
            ? "Servicio desactivado"
            : "Servicio activado",
          timer: 1200,
          showConfirmButton:
            false,
        });
      } catch (error) {
        console.error(
          "Error al cambiar estado del servicio:",
          error,
        );

        await Swal.fire({
          icon: "error",
          title:
            "No se pudo cambiar el estado",
          text: "Ocurrió un error. Intentá nuevamente.",
          confirmButtonText:
            "Entendido",
          confirmButtonColor:
            "var(--color-primary)",
        });
      } finally {
        setTogglingServiceId(
          null,
        );
      }
    };

  /*
   * CARGANDO DATOS
   */
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Cargando servicios...
        </p>
      </div>
    );
  }

  /*
   * ERROR AL CARGAR
   */
  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-6 text-center">
          <Scissors
            size={30}
            className="mx-auto text-[var(--color-text-secondary)]"
          />

          <h3 className="mt-4 font-semibold">
            No se pudieron cargar
            los servicios
          </h3>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 text-[var(--color-text)]">
      {/* HEADER */}
      <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5 sm:p-6 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            Administración
          </p>

          <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">
            Servicios
          </h2>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Configurá los
            servicios, precios y
            duración de cada
            atención.
          </p>
        </div>

        <button
          type="button"
          onClick={
            handleNewService
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-[var(--color-background-light)] transition hover:bg-[var(--color-primary-hover)] sm:w-auto"
        >
          <Plus size={18} />

          Nuevo servicio
        </button>
      </section>

      {/* RESUMEN */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Servicios
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {services.length}
          </p>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Activos
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {activeServices}
          </p>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Inactivos
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {inactiveServices}
          </p>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Precio promedio
          </p>

          <p className="mt-2 text-3xl font-semibold">
            $
            {averagePrice.toLocaleString(
              "es-AR",
            )}
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
            onChange={(event) =>
              setSearch(
                event.target
                  .value,
              )
            }
            placeholder="Buscar servicio..."
            className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] pl-12 pr-12 text-sm outline-none focus:border-[var(--color-primary)]"
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
          {
            filteredServices.length
          }{" "}
          {filteredServices.length ===
          1
            ? "servicio"
            : "servicios"}
        </p>
      </section>

      {/* LISTADO */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredServices.map(
          (service) => {
            const isToggling =
              togglingServiceId ===
              service.id;

            return (
              <article
                key={
                  service.id
                }
                className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-5 transition ${
                  !service.active
                    ? "opacity-60"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-background)] text-[var(--color-primary)]">
                    <Scissors
                      size={20}
                    />
                  </div>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                      service.active
                        ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                        : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {service.active
                      ? "Activo"
                      : "Inactivo"}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  {
                    service.name
                  }
                </h3>

                <p className="mt-2 min-h-10 text-sm leading-5 text-[var(--color-text-secondary)]">
                  {service.description ||
                    "Sin descripción."}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[var(--color-background)] p-3">
                    <p className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                      <Clock3
                        size={
                          14
                        }
                      />

                      Duración
                    </p>

                    <p className="mt-2 font-semibold">
                      {
                        service.duration
                      }{" "}
                      min
                    </p>
                  </div>

                  <div className="rounded-xl bg-[var(--color-background)] p-3">
                    <p className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                      <DollarSign
                        size={
                          14
                        }
                      />

                      Precio
                    </p>

                    <p className="mt-2 font-semibold">
                      $
                      {service.price.toLocaleString(
                        "es-AR",
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex gap-2 border-t border-[var(--color-border)] pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleEditService(
                        service,
                      )
                    }
                    disabled={
                      isToggling
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-3 py-2.5 text-sm font-medium transition hover:bg-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Pencil
                      size={
                        15
                      }
                    />

                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void handleToggleStatus(
                        service,
                      )
                    }
                    disabled={
                      isToggling
                    }
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      service.active
                        ? "border border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-background)]"
                        : "bg-[var(--color-primary)] text-[var(--color-background-light)] hover:bg-[var(--color-primary-hover)]"
                    }`}
                  >
                    <Power
                      size={
                        15
                      }
                    />

                    {isToggling
                      ? "Guardando..."
                      : service.active
                        ? "Desactivar"
                        : "Activar"}
                  </button>
                </div>
              </article>
            );
          },
        )}
      </section>

      {filteredServices.length ===
        0 && (
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-light)] p-10 text-center">
          <Scissors
            size={30}
            className="mx-auto text-[var(--color-text-secondary)]"
          />

          <h3 className="mt-4 font-semibold">
            No encontramos
            servicios
          </h3>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {search
              ? "Probá modificando la búsqueda."
              : "Todavía no hay servicios registrados."}
          </p>
        </section>
      )}

      <ServiceFormModal
        isOpen={
          serviceModalOpen
        }
        service={
          editingService
        }
        onClose={
          handleCloseModal
        }
        onSubmit={
          handleSaveService
        }
      />
    </div>
  );
};

export default AdminServices;
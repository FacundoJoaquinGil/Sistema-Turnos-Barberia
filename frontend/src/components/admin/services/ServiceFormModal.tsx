import {
  Clock3,
  DollarSign,
  FileText,
  Scissors,
  X,
} from "lucide-react";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import type {
  Service,
  ServiceFormData,
} from "../../../types/service";

interface ServiceFormModalProps {
  isOpen: boolean;

  service?: Service | null;

  onClose: () => void;

  onSubmit: (
    data: ServiceFormData,
  ) => void;
}

const emptyForm: ServiceFormData = {
  name: "",
  description: "",
  duration: 45,
  price: 0,
  isActive: true,
};

const ServiceFormModal = ({
  isOpen,
  service,
  onClose,
  onSubmit,
}: ServiceFormModalProps) => {
  const [form, setForm] =
    useState<ServiceFormData>(
      emptyForm,
    );

  const isEditing = Boolean(service);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (service) {
      setForm({
        name: service.name,
        description:
          service.description,
        duration: service.duration,
        price: service.price,
        isActive:
          service.isActive,
      });

      return;
    }

    setForm(emptyForm);
  }, [isOpen, service]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const name = form.name.trim();

    if (
      !name ||
      form.duration <= 0 ||
      form.price < 0
    ) {
      return;
    }

    onSubmit({
      ...form,
      name,
      description:
        form.description.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-5"
      style={{
        background:
          "color-mix(in srgb, var(--color-primary) 45%, transparent)",
      }}
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-[var(--color-border)] bg-[var(--color-background-light)] sm:max-w-xl sm:rounded-3xl">
        <header className="flex items-start justify-between border-b border-[var(--color-border)] p-5 sm:p-6">
          <div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Gestión de servicios
            </p>

            <h2 className="mt-1 text-xl font-semibold text-[var(--color-text)]">
              {isEditing
                ? "Editar servicio"
                : "Nuevo servicio"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-background)]"
          >
            <X size={19} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5 sm:p-6"
        >
          {/* NOMBRE */}
          <div>
            <label
              htmlFor="service-name"
              className="mb-2 block text-sm font-medium"
            >
              Nombre del servicio
            </label>

            <div className="relative">
              <Scissors
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
              />

              <input
                id="service-name"
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    name: e.target.value,
                  }))
                }
                placeholder="Ej. Corte clásico"
                className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] pl-12 pr-4 text-sm outline-none transition focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label
              htmlFor="service-description"
              className="mb-2 block text-sm font-medium"
            >
              Descripción
            </label>

            <div className="relative">
              <FileText
                size={18}
                className="absolute left-4 top-4 text-[var(--color-text-secondary)]"
              />

              <textarea
                id="service-description"
                rows={4}
                value={
                  form.description
                }
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    description:
                      e.target.value,
                  }))
                }
                placeholder="Descripción breve del servicio..."
                className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] py-3 pl-12 pr-4 text-sm outline-none transition focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          {/* DURACIÓN / PRECIO */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="service-duration"
                className="mb-2 block text-sm font-medium"
              >
                Duración
              </label>

              <div className="relative">
                <Clock3
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
                />

                <input
                  id="service-duration"
                  type="number"
                  min="5"
                  step="5"
                  required
                  value={form.duration}
                  onChange={(e) =>
                    setForm(
                      (current) => ({
                        ...current,
                        duration:
                          Number(
                            e.target
                              .value,
                          ),
                      }),
                    )
                  }
                  className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] pl-12 pr-14 text-sm outline-none focus:border-[var(--color-primary)]"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-secondary)]">
                  min
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="service-price"
                className="mb-2 block text-sm font-medium"
              >
                Precio
              </label>

              <div className="relative">
                <DollarSign
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
                />

                <input
                  id="service-price"
                  type="number"
                  min="0"
                  step="100"
                  required
                  value={form.price}
                  onChange={(e) =>
                    setForm(
                      (current) => ({
                        ...current,
                        price:
                          Number(
                            e.target
                              .value,
                          ),
                      }),
                    )
                  }
                  className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] pl-12 pr-4 text-sm outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>
          </div>

          {/* ESTADO */}
          <div className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
            <div>
              <p className="text-sm font-medium">
                Servicio activo
              </p>

              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                Los servicios inactivos
                no podrán seleccionarse
                para nuevos turnos.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setForm(
                  (current) => ({
                    ...current,
                    isActive:
                      !current.isActive,
                  }),
                )
              }
              className={`relative h-7 w-12 rounded-full transition ${
                form.isActive
                  ? "bg-[var(--color-primary)]"
                  : "bg-[var(--color-border)]"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-[var(--color-background-light)] transition-all ${
                  form.isActive
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>

          {/* BOTONES */}
          <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[var(--color-border)] px-5 py-3 text-sm font-medium transition hover:bg-[var(--color-background)]"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-[var(--color-background-light)] transition hover:bg-[var(--color-primary-hover)]"
            >
              {isEditing
                ? "Guardar cambios"
                : "Crear servicio"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ServiceFormModal;
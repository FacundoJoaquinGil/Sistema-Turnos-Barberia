import {
  Clock3,
  DollarSign,
  FileText,
  Scissors,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
  type FormEvent,
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
  ) => Promise<void>;
}

const emptyForm: ServiceFormData = {
  name: "",
  description: "",
  duration: 45,
  price: 0,
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

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const isEditing =
    Boolean(service);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (service) {
      setForm({
        name: service.name,
        description:
          service.description ?? "",
        duration:
          service.duration,
        price: service.price,
      });

      return;
    }

    setForm({
      ...emptyForm,
    });
  }, [isOpen, service]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const name =
      form.name.trim();

    const description =
      form.description?.trim() ?? "";

    if (
      !name ||
      form.duration <= 0 ||
      form.price < 0
    ) {
      return;
    }

    try {
      setSubmitting(true);

      await onSubmit({
        ...form,
        name,
        description,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-5"
      style={{
        background:
          "color-mix(in srgb, var(--color-primary) 45%, transparent)",
      }}
    >
      {/* OVERLAY */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={
          submitting
            ? undefined
            : onClose
        }
        className="absolute inset-0"
      />

      <section className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-[var(--color-border)] bg-[var(--color-background-light)] sm:max-w-xl sm:rounded-3xl">
        {/* HEADER */}
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
            disabled={submitting}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50"
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
                disabled={submitting}
                value={form.name}
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      name:
                        event.target
                          .value,
                    }),
                  )
                }
                placeholder="Ej. Corte clásico"
                className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] pl-12 pr-4 text-sm outline-none transition focus:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
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
                disabled={submitting}
                value={
                  form.description ?? ""
                }
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      description:
                        event.target
                          .value,
                    }),
                  )
                }
                placeholder="Descripción breve del servicio..."
                className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] py-3 pl-12 pr-4 text-sm outline-none transition focus:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
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
                  disabled={
                    submitting
                  }
                  value={
                    form.duration
                  }
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        duration:
                          Number(
                            event
                              .target
                              .value,
                          ),
                      }),
                    )
                  }
                  className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] pl-12 pr-14 text-sm outline-none focus:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
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
                  disabled={
                    submitting
                  }
                  value={
                    form.price
                  }
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        price:
                          Number(
                            event
                              .target
                              .value,
                          ),
                      }),
                    )
                  }
                  className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] pl-12 pr-4 text-sm outline-none focus:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* BOTONES */}
          <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-[var(--color-border)] px-5 py-3 text-sm font-medium transition hover:bg-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-[var(--color-background-light)] transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Guardando..."
                : isEditing
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
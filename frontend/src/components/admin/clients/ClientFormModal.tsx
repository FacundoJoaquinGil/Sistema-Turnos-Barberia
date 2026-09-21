import {
  FileText,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import type {
  Client,
  ClientFormData,
} from "../../../types/client";

interface ClientFormModalProps {
  isOpen: boolean;

  client?: Client | null;

  onClose: () => void;

  onSubmit: (
    data: ClientFormData,
  ) => void;
}

const emptyForm: ClientFormData = {
  name: "",
  phone: "",
  notes: "",
};

const ClientFormModal = ({
  isOpen,
  client,
  onClose,
  onSubmit,
}: ClientFormModalProps) => {
  const [form, setForm] =
    useState<ClientFormData>(
      emptyForm,
    );

  const isEditing = Boolean(client);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (client) {
      setForm({
        name: client.name,
        phone: client.phone,
        notes: client.notes,
      });

      return;
    }

    setForm(emptyForm);
  }, [isOpen, client]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const name = form.name.trim();
    const phone = form.phone.trim();

    if (!name || !phone) {
      return;
    }

    onSubmit({
      name,
      phone,
      notes: form.notes.trim(),
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
              Gestión de clientes
            </p>

            <h2 className="mt-1 text-xl font-semibold text-[var(--color-text)]">
              {isEditing
                ? "Editar cliente"
                : "Nuevo cliente"}
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
          <div>
            <label
              htmlFor="client-name"
              className="mb-2 block text-sm font-medium"
            >
              Nombre y apellido
            </label>

            <div className="relative">
              <UserRound
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
              />

              <input
                id="client-name"
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    name: e.target.value,
                  }))
                }
                placeholder="Ej. Juan Pérez"
                className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] pl-12 pr-4 text-sm outline-none transition focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="client-phone"
              className="mb-2 block text-sm font-medium"
            >
              Teléfono
            </label>

            <div className="relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
              />

              <input
                id="client-phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    phone: e.target.value,
                  }))
                }
                placeholder="381 555-1234"
                className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] pl-12 pr-4 text-sm outline-none transition focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="client-notes"
              className="mb-2 block text-sm font-medium"
            >
              Notas
            </label>

            <div className="relative">
              <FileText
                size={18}
                className="absolute left-4 top-4 text-[var(--color-text-secondary)]"
              />

              <textarea
                id="client-notes"
                rows={4}
                value={form.notes}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    notes: e.target.value,
                  }))
                }
                placeholder="Preferencias, observaciones..."
                className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-background-light)] py-3 pl-12 pr-4 text-sm outline-none transition focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

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
                : "Crear cliente"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ClientFormModal;
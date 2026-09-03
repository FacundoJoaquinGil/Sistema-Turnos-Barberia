import type {
  BookingClientData,
} from "../../../types/booking.types";
import type { BarberService } from "../../../types/public.types";

import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDateLong } from "../../../utils/formatDate";

interface BookingReviewStepProps {
  service: BarberService;
  date: string;
  time: string;
  client: BookingClientData;
  submitting: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

const BookingReviewStep = ({
  service,
  date,
  time,
  client,
  submitting,
  onBack,
  onConfirm,
}: BookingReviewStepProps) => {
  return (
    <div>
      <button
        type="button"
        disabled={submitting}
        onClick={onBack}
        className="mb-5 text-sm font-semibold text-zinc-500 hover:text-[var(--color-text)] disabled:opacity-50"
      >
        ← Modificar datos
      </button>

      <h2 className="text-2xl font-black text-[var(--color-text)]">
        Revisá tu turno
      </h2>

      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
        Comprobá que la información
        sea correcta antes de confirmar.
      </p>

      <div className="mt-7 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]">
        <div className="border-b border-[var(--color-border)] p-5">
          <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            Servicio
          </p>

          <div className="mt-2 flex items-start justify-between gap-4">
            <div>
              <p className="font-bold text-[var(--color-text)]">
                {service.name}
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                {
                  service.durationMinutes
                }{" "}
                minutos
              </p>
            </div>

            <p className="font-black text-[var(--color-text)]">
              {formatCurrency(
                service.price,
              )}
            </p>
          </div>
        </div>

        <div className="grid border-b border-[var(--color-border)] sm:grid-cols-2">
          <div className="border-b border-[var(--color-border)] p-5 sm:border-r sm:border-b-0">
            <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Fecha
            </p>

            <p className="mt-2 text-sm font-semibold text-[var(--color-text)] capitalize">
              {formatDateLong(date)}
            </p>
          </div>

          <div className="p-5">
            <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Horario
            </p>

            <p className="mt-2 text-lg font-black text-[var(--color-text)]">
              {time}
            </p>
          </div>
        </div>

        <div className="p-5">
          <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            Cliente
          </p>

          <p className="mt-2 font-bold text-[var(--color-text)]">
            {client.name}
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            {client.phone}
          </p>

          {client.comment && (
            <div className="mt-4 rounded-xl bg-white p-4">
              <p className="text-xs font-semibold text-zinc-500">
                Observación
              </p>

              <p className="mt-1 text-sm leading-6 text-zinc-700">
                {client.comment}
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        disabled={submitting}
        onClick={onConfirm}
        className="mt-7 flex min-h-14 w-full items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-4 font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-wait disabled:bg-zinc-500"
      >
        {submitting
          ? "Confirmando..."
          : "Confirmar turno"}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-zinc-500">
        Al confirmar, el horario quedará
        reservado a tu nombre.
      </p>
    </div>
  );
};

export default BookingReviewStep;
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
        className="mb-5 text-sm font-semibold text-zinc-500 hover:text-zinc-950 disabled:opacity-50"
      >
        ← Modificar datos
      </button>

      <h2 className="text-2xl font-black text-zinc-950">
        Revisá tu turno
      </h2>

      <p className="mt-2 text-sm leading-6 text-zinc-600">
        Comprobá que la información
        sea correcta antes de confirmar.
      </p>

      <div className="mt-7 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
        <div className="border-b border-zinc-200 p-5">
          <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            Servicio
          </p>

          <div className="mt-2 flex items-start justify-between gap-4">
            <div>
              <p className="font-bold text-zinc-950">
                {service.name}
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                {
                  service.durationMinutes
                }{" "}
                minutos
              </p>
            </div>

            <p className="font-black text-zinc-950">
              {formatCurrency(
                service.price,
              )}
            </p>
          </div>
        </div>

        <div className="grid border-b border-zinc-200 sm:grid-cols-2">
          <div className="border-b border-zinc-200 p-5 sm:border-r sm:border-b-0">
            <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Fecha
            </p>

            <p className="mt-2 text-sm font-semibold text-zinc-950 capitalize">
              {formatDateLong(date)}
            </p>
          </div>

          <div className="p-5">
            <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Horario
            </p>

            <p className="mt-2 text-lg font-black text-zinc-950">
              {time}
            </p>
          </div>
        </div>

        <div className="p-5">
          <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            Cliente
          </p>

          <p className="mt-2 font-bold text-zinc-950">
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
        className="mt-7 flex min-h-14 w-full items-center justify-center rounded-xl bg-zinc-950 px-6 py-4 font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-wait disabled:bg-zinc-500"
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
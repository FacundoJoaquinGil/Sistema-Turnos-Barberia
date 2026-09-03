import type { BookingClientData } from "../../../types/booking.types";

interface BookingDetailsStepProps {
  data: BookingClientData;
  onChange: (
    data: BookingClientData,
  ) => void;
  onContinue: () => void;
  onBack: () => void;
}

const BookingDetailsStep = ({
  data,
  onChange,
  onContinue,
  onBack,
}: BookingDetailsStepProps) => {
  const phoneDigits =
    data.phone.replace(/\D/g, "");

  const formIsValid =
    data.name.trim().length >= 2 &&
    phoneDigits.length >= 8;

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-5 text-sm font-semibold text-zinc-500 hover:text-[var(--color-text)]"
      >
        ← Cambiar horario
      </button>

      <h2 className="text-2xl font-black text-[var(--color-text)]">
        Tus datos
      </h2>

      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
        No necesitás crear una cuenta
        para reservar.
      </p>

      <div className="mt-7 space-y-5">
        <div>
          <label
            htmlFor="booking-name"
            className="mb-2 block text-sm font-semibold text-[var(--color-secondary)]"
          >
            Nombre y apellido
          </label>

          <input
            id="booking-name"
            type="text"
            value={data.name}
            autoComplete="name"
            onChange={(event) =>
              onChange({
                ...data,
                name: event.target.value,
              })
            }
            placeholder="Ej: Juan Pérez"
            className="min-h-13 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-zinc-950/10"
          />
        </div>

        <div>
          <label
            htmlFor="booking-phone"
            className="mb-2 block text-sm font-semibold text-[var(--color-secondary)]"
          >
            Teléfono
          </label>

          <input
            id="booking-phone"
            type="tel"
            value={data.phone}
            autoComplete="tel"
            inputMode="tel"
            onChange={(event) =>
              onChange({
                ...data,
                phone:
                  event.target.value,
              })
            }
            placeholder="Ej: 381 555 1234"
            className="min-h-13 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-zinc-950/10"
          />

          <p className="mt-2 text-xs text-zinc-500">
            Lo utilizaremos para
            identificar tu reserva.
          </p>
        </div>

        <div>
          <label
            htmlFor="booking-comment"
            className="mb-2 block text-sm font-semibold text-[var(--color-secondary)]"
          >
            Comentario{" "}
            <span className="font-normal text-zinc-400">
              (opcional)
            </span>
          </label>

          <textarea
            id="booking-comment"
            value={data.comment}
            rows={4}
            maxLength={250}
            onChange={(event) =>
              onChange({
                ...data,
                comment:
                  event.target.value,
              })
            }
            placeholder="Ej: Quiero mantener un poco de largo arriba..."
            className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-zinc-950/10"
          />

          <p className="mt-2 text-right text-xs text-zinc-400">
            {data.comment.length}/250
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={!formIsValid}
        onClick={onContinue}
        className="mt-8 flex min-h-13 w-full items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-3.5 font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        Revisar turno
      </button>
    </div>
  );
};

export default BookingDetailsStep;
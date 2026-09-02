import type { TimeSlot } from "../../../types/booking.types";

interface BookingTimeStepProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  loading: boolean;
  onSelect: (
    time: string,
  ) => void;
  onBack: () => void;
}

const BookingTimeStep = ({
  slots,
  selectedTime,
  loading,
  onSelect,
  onBack,
}: BookingTimeStepProps) => {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-5 text-sm font-semibold text-zinc-500 hover:text-zinc-950"
      >
        ← Cambiar fecha
      </button>

      <h2 className="text-2xl font-black text-zinc-950">
        Elegí un horario
      </h2>

      <p className="mt-2 text-sm leading-6 text-zinc-600">
        Los horarios ocupados aparecen
        deshabilitados.
      </p>

      {loading ? (
        <div className="py-14 text-center text-sm text-zinc-500">
          Consultando horarios...
        </div>
      ) : slots.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center">
          <p className="font-semibold text-zinc-950">
            No hay horarios
            disponibles.
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Probá seleccionando otra
            fecha.
          </p>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {slots.map((slot) => {
            const selected =
              selectedTime ===
              slot.time;

            return (
              <button
                key={slot.time}
                type="button"
                disabled={
                  !slot.available
                }
                onClick={() =>
                  onSelect(
                    slot.time,
                  )
                }
                className={[
                  "min-h-12 rounded-xl border px-3 py-3 text-sm font-semibold transition-all",
                  selected
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : slot.available
                      ? "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400"
                      : "cursor-not-allowed border-zinc-100 bg-zinc-100 text-zinc-400 line-through",
                ].join(" ")}
              >
                {slot.time}
              </button>
            );
          })}
        </div>
      )}

      {!loading &&
        slots.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-5 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded border border-zinc-300 bg-white" />

              Disponible
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-zinc-200" />

              Ocupado
            </div>
          </div>
        )}
    </div>
  );
};

export default BookingTimeStep;
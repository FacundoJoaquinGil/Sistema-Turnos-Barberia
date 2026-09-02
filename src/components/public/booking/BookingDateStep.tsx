import type { AvailableBookingDate } from "../../../types/booking.types";

interface BookingDateStepProps {
  dates: AvailableBookingDate[];
  selectedDate: string | null;
  loading: boolean;
  onSelect: (
    date: string,
  ) => void;
  onBack: () => void;
}

const BookingDateStep = ({
  dates,
  selectedDate,
  loading,
  onSelect,
  onBack,
}: BookingDateStepProps) => {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-5 text-sm font-semibold text-zinc-500 hover:text-zinc-950"
      >
        ← Cambiar servicio
      </button>

      <h2 className="text-2xl font-black text-zinc-950">
        Elegí una fecha
      </h2>

      <p className="mt-2 text-sm leading-6 text-zinc-600">
        Mostramos los próximos días
        disponibles.
      </p>

      {loading ? (
        <div className="py-14 text-center text-sm text-zinc-500">
          Consultando fechas...
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {dates.map((item) => {
            const selected =
              selectedDate ===
              item.date;

            return (
              <button
                key={item.date}
                type="button"
                disabled={
                  !item.available
                }
                onClick={() =>
                  onSelect(
                    item.date,
                  )
                }
                className={[
                  "min-h-28 rounded-2xl border p-4 text-center transition-all",
                  selected
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : item.available
                      ? "border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50"
                      : "cursor-not-allowed border-zinc-100 bg-zinc-100 text-zinc-400",
                ].join(" ")}
              >
                <p className="text-xs font-semibold uppercase">
                  {item.weekday}
                </p>

                <p className="mt-2 text-2xl font-black">
                  {item.dayNumber}
                </p>

                <p className="mt-1 text-xs uppercase">
                  {item.month}
                </p>

                {!item.available &&
                  item.reason && (
                    <p className="mt-2 text-[10px] font-medium">
                      {
                        item.reason
                      }
                    </p>
                  )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingDateStep;
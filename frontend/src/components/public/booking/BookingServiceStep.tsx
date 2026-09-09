import type { BarberService } from "../../../types/public.types";
import { formatCurrency } from "../../../utils/formatCurrency";

interface BookingServiceStepProps {
  services: BarberService[];
  selectedService:
    | BarberService
    | null;
  loading: boolean;
  onSelect: (
    service: BarberService,
  ) => void;
}

const BookingServiceStep = ({
  services,
  selectedService,
  loading,
  onSelect,
}: BookingServiceStepProps) => {
  if (loading) {
    return (
      <div className="py-14 text-center text-sm text-zinc-500">
        Cargando servicios...
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-black text-[var(--color-text)]">
        ¿Qué servicio querés?
      </h2>

      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
        Elegí una opción para consultar
        los horarios disponibles.
      </p>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {services.map((service) => {
          const selected =
            selectedService?.id ===
            service.id;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() =>
                onSelect(service)
              }
              className={[
                "rounded-2xl border p-5 text-left transition-all",
                selected
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-lg"
                  : "border-[var(--color-border)] bg-white hover:border-zinc-400 hover:bg-[var(--color-background)]",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold">
                    {service.name}
                  </p>

                  <p
                    className={[
                      "mt-2 text-sm leading-6",
                      selected
                        ? "text-zinc-300"
                        : "text-zinc-500",
                    ].join(" ")}
                  >
                    {
                      service.description
                    }
                  </p>
                </div>

                <div
                  className={[
                    "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                    selected
                      ? "border-white bg-white"
                      : "border-zinc-300",
                  ].join(" ")}
                >
                  {selected && (
                    <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                  )}
                </div>
              </div>

              <div
                className={[
                  "mt-5 flex items-center justify-between border-t pt-4",
                  selected
                    ? "border-white/10"
                    : "border-[var(--color-border)]",
                ].join(" ")}
              >
                <span className="font-bold">
                  {formatCurrency(
                    service.price,
                  )}
                </span>

                <span
                  className={[
                    "text-sm",
                    selected
                      ? "text-zinc-300"
                      : "text-zinc-500",
                  ].join(" ")}
                >
                  {
                    service.durationMinutes
                  }{" "}
                  min
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingServiceStep;
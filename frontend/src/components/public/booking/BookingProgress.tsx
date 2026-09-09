import type { BookingStep } from "../../../types/booking.types";

interface BookingProgressProps {
  currentStep: BookingStep;
}

interface StepItem {
  id: BookingStep;
  label: string;
}

const steps: StepItem[] = [
  {
    id: "service",
    label: "Servicio",
  },
  {
    id: "date",
    label: "Fecha",
  },
  {
    id: "time",
    label: "Horario",
  },
  {
    id: "details",
    label: "Datos",
  },
  {
    id: "review",
    label: "Confirmar",
  },
];

const BookingProgress = ({
  currentStep,
}: BookingProgressProps) => {
  const currentIndex =
    steps.findIndex(
      (step) =>
        step.id === currentStep,
    );

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-[520px] items-center">
        {steps.map((step, index) => {
          const completed =
            index < currentIndex;

          const active =
            index === currentIndex;

          return (
            <div
              key={step.id}
              className="flex flex-1 items-center last:flex-none"
            >
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors",
                    completed || active
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-zinc-200 text-zinc-500",
                  ].join(" ")}
                >
                  {completed
                    ? "✓"
                    : index + 1}
                </div>

                <span
                  className={[
                    "mt-2 text-xs font-medium",
                    active
                      ? "text-[var(--color-text)]"
                      : "text-zinc-500",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>

              {index <
                steps.length - 1 && (
                <div
                  className={[
                    "mx-3 h-px flex-1",
                    index <
                    currentIndex
                      ? "bg-[var(--color-primary)]"
                      : "bg-zinc-200",
                  ].join(" ")}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingProgress;
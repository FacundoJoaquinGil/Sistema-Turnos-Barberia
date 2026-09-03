import { Link } from "react-router";

interface BookingStep {
  number: string;
  title: string;
  description: string;
}

const bookingSteps: BookingStep[] = [
  {
    number: "01",
    title: "Elegí tu servicio",
    description:
      "Seleccioná el corte o servicio que mejor se adapte a lo que estás buscando.",
  },
  {
    number: "02",
    title: "Seleccioná fecha y horario",
    description:
      "Consultá los horarios disponibles y elegí el momento que te resulte más cómodo.",
  },
  {
    number: "03",
    title: "Confirmá tus datos",
    description:
      "Ingresá tu nombre y teléfono para que podamos identificar correctamente tu reserva.",
  },
  {
    number: "04",
    title: "Listo",
    description:
      "Tu turno queda reservado. Solo queda presentarte en la barbería a la hora indicada.",
  },
];

const HowToBookSection = () => {
  return (
    <section
      id="como-reservar"
      className="scroll-mt-24 bg-[var(--color-background)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div
          className="mx-auto max-w-2xl text-center"
          data-aos="fade-up"
        >
          <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold tracking-[0.14em] text-[var(--color-text-secondary)] uppercase shadow-sm ring-1 ring-zinc-200">
            Cómo reservar
          </span>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-[var(--color-text)] sm:text-4xl lg:text-5xl">
            Tu turno en pocos pasos
          </h2>

          <p className="mt-5 text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg">
            Reservar tu lugar va a llevarte solamente unos minutos.
            Sin llamadas y sin crear una cuenta.
          </p>
        </div>

        <div className="relative mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="absolute top-8 right-[12%] left-[12%] hidden h-px bg-zinc-200 lg:block" />

          {bookingSteps.map((step, index) => (
            <article
              key={step.number}
              className="relative rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7"
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-lg font-black text-white shadow-lg shadow-zinc-950/10">
                {step.number}
              </div>

              <h3 className="mt-6 text-xl font-bold text-[var(--color-text)]">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                {step.description}
              </p>
            </article>
          ))}
        </div>

        <div
          className="mt-12 flex justify-center"
          data-aos="fade-up"
        >
          <Link
            to="/reservar"
            className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-7 py-4 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--color-primary-hover)] active:translate-y-0"
          >
            Reservar ahora

            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowToBookSection;
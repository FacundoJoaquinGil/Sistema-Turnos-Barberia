import { Link } from "react-router";
import { barberShopMock } from "../../mocks/site.mock";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[var(--color-background)]">
      <div className="pointer-events-none absolute -top-36 -left-36 h-80 w-80 rounded-full bg-amber-100/50 blur-3xl" />

      <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-zinc-200/60 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100svh-72px)] max-w-7xl items-center gap-12 px-5 py-12 md:py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
        <div
          className="order-2 lg:order-1"
          data-aos="fade-up"
          data-aos-duration="650"
        >
          <h1 className="max-w-2xl text-4xl leading-[1.05] font-black tracking-tight text-[var(--color-text)] sm:text-5xl md:text-6xl lg:text-7xl">
            {barberShopMock.slogan}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg sm:leading-8">
            {barberShopMock.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/reservar"
              className="group flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-7 py-4 text-base font-semibold text-white shadow-lg shadow-zinc-950/10 transition-all hover:-translate-y-0.5 hover:bg-[var(--color-primary-hover)] hover:shadow-xl active:translate-y-0"
            >
              Reservar turno

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

            <Link
              to="/trabajos"
              className="flex min-h-14 items-center justify-center rounded-xl border border-zinc-300 bg-white px-7 py-4 text-base font-semibold text-[var(--color-secondary)] transition-all hover:border-zinc-400 hover:bg-zinc-100"
            >
              Ver trabajos
            </Link>
          </div>

          <div className="mt-10 grid max-w-lg grid-cols-3 border-t border-[var(--color-border)] pt-7">
            <div>
              <p className="text-lg font-bold text-[var(--color-text)] sm:text-xl">
                Fácil
              </p>

              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                Reservá online
              </p>
            </div>

            <div className="border-x border-[var(--color-border)] px-4">
              <p className="text-lg font-bold text-[var(--color-text)] sm:text-xl">
                Rápido
              </p>

              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                Elegí tu horario
              </p>
            </div>

            <div className="pl-4">
              <p className="text-lg font-bold text-[var(--color-text)] sm:text-xl">
                Simple
              </p>

              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                Sin registros
              </p>
            </div>
          </div>
        </div>

        <div
          className="order-1 lg:order-2"
          data-aos="fade-left"
          data-aos-duration="700"
        >
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div className="absolute -top-4 -right-4 hidden h-full w-full rounded-[2rem] border border-zinc-300 lg:block" />

            <div className="relative overflow-hidden rounded-[1.75rem] bg-[var(--color-primary)] shadow-2xl shadow-zinc-900/20">
              <img
                src={barberShopMock.heroImage}
                alt="Barbero realizando un corte de cabello"
                className="aspect-[4/4.7] w-full object-cover sm:aspect-[4/4.3] lg:aspect-[4/5]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute right-4 bottom-4 left-4 rounded-2xl border border-white/15 bg-black/35 p-4 text-white backdrop-blur-md sm:right-6 sm:bottom-6 sm:left-6 sm:p-5">
                <p className="text-xs font-semibold tracking-[0.15em] text-zinc-300 uppercase">
                  Distrito Barber
                </p>

                <p className="mt-1 text-lg font-semibold sm:text-xl">
                  Encontrá el corte que va con vos.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-xl sm:flex sm:items-center sm:gap-3 lg:-left-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 text-[var(--color-secondary)]"
                  aria-hidden="true"
                >
                  <path
                    d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <p className="text-xs text-zinc-500">
                  Reservá cuando quieras
                </p>

                <p className="text-sm font-semibold text-[var(--color-text)]">
                  Turnos online 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
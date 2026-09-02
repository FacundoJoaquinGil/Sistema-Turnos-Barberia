import { Link } from "react-router";
import { servicesMock } from "../../mocks/services.mock";
import { formatCurrency } from "../../utils/formatCurrency";

const ServicesSection = () => {
  const activeServices = servicesMock.filter(
    (service) => service.active,
  );

  return (
    <section
      id="servicios"
      className="scroll-mt-24 bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div
          className="mx-auto max-w-2xl text-center"
          data-aos="fade-up"
        >
          <span className="inline-flex rounded-full bg-zinc-100 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-zinc-600 uppercase">
            Servicios
          </span>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl">
            Elegí el servicio que va con vos
          </h2>

          <p className="mt-5 text-base leading-7 text-zinc-600 sm:text-lg">
            Encontrá el corte o servicio que necesitás y
            reservá tu horario de manera rápida y sencilla.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {activeServices.map((service, index) => (
            <article
              key={service.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:bg-white hover:shadow-xl hover:shadow-zinc-900/5 sm:p-7"
              data-aos="fade-up"
              data-aos-delay={index * 70}
            >
              {service.featured && (
                <span className="absolute top-5 right-5 rounded-full bg-zinc-950 px-3 py-1.5 text-[10px] font-bold tracking-wide text-white uppercase">
                  Popular
                </span>
              )}

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path
                    d="M7 4l10 16M17 4 7 20"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="5.5"
                    cy="5.5"
                    r="2.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <circle
                    cx="18.5"
                    cy="18.5"
                    r="2.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-zinc-950">
                  {service.name}
                </h3>

                <p className="mt-3 min-h-[72px] text-sm leading-6 text-zinc-600">
                  {service.description}
                </p>
              </div>

              <div className="mt-7 flex items-end justify-between gap-4 border-t border-zinc-200 pt-5">
                <div>
                  <p className="text-xs font-medium text-zinc-500">
                    Precio
                  </p>

                  <p className="mt-1 text-xl font-black text-zinc-950">
                    {formatCurrency(service.price)}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="8.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />

                    <path
                      d="M12 7.5V12l3 2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span>
                    {service.durationMinutes} min
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div
          className="mt-12 flex justify-center"
          data-aos="fade-up"
        >
          <Link
            to="/reservar"
            className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-7 py-3.5 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-zinc-800 active:translate-y-0"
          >
            Reservar mi turno

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

export default ServicesSection;
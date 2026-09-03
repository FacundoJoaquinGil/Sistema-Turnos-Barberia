import { Link } from "react-router";
import { barberShopMock } from "../../mocks/site.mock";

const ContactSection = () => {
  return (
    <section
      id="contacto"
      className="scroll-mt-24 bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid overflow-hidden rounded-[2rem] bg-[var(--color-primary)] text-white lg:grid-cols-[0.9fr_1.1fr]">
          <div
            className="p-7 sm:p-10 lg:p-14"
            data-aos="fade-right"
          >
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-zinc-300 uppercase">
              Contacto
            </span>

            <h2 className="mt-6 max-w-lg text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              ¿Listo para tu próximo corte?
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-zinc-400">
              Reservá tu turno online o comunicate directamente con la
              barbería si necesitás realizar alguna consulta.
            </p>

            <div className="mt-9 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />

                    <circle
                      cx="12"
                      cy="10"
                      r="2.3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Dirección
                  </p>

                  <p className="mt-1 text-sm text-zinc-400">
                    {barberShopMock.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 3h3l1.5 4-2 1.7a15 15 0 0 0 5.8 5.8l1.7-2 4 1.5v3a4 4 0 0 1-4 4C9.3 21 3 14.7 3 7a4 4 0 0 1 4-4Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Teléfono
                  </p>

                  <a
                    href={`tel:${barberShopMock.phone.replace(/\s/g, "")}`}
                    className="mt-1 inline-block text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {barberShopMock.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <rect
                      x="4"
                      y="4"
                      width="16"
                      height="16"
                      rx="5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="3.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />

                    <circle
                      cx="17.4"
                      cy="6.7"
                      r="0.8"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Instagram
                  </p>

                  <a
                    href={barberShopMock.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {barberShopMock.instagram}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/reservar"
                className="flex min-h-13 items-center justify-center rounded-xl bg-white px-6 py-3.5 font-semibold text-[var(--color-text)] transition-colors hover:bg-zinc-200"
              >
                Reservar mi turno
              </Link>

              <a
                href={barberShopMock.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-13 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div
            className="bg-[var(--color-primary)] p-7 sm:p-10 lg:p-14"
            data-aos="fade-left"
          >
            <p className="text-xs font-semibold tracking-[0.16em] text-zinc-500 uppercase">
              Horarios
            </p>

            <h3 className="mt-3 text-2xl font-bold text-white">
              Horarios de atención
            </h3>

            <div className="mt-8">
              {barberShopMock.businessHours.map((businessHour) => {
                const isClosed =
                  businessHour.hours === "Cerrado";

                return (
                  <div
                    key={businessHour.day}
                    className="flex items-center justify-between gap-5 border-b border-white/10 py-4 first:pt-0"
                  >
                    <span className="text-sm font-medium text-zinc-300">
                      {businessHour.day}
                    </span>

                    <span
                      className={[
                        "text-sm font-semibold",
                        isClosed
                          ? "text-[var(--color-text-secondary)]"
                          : "text-white",
                      ].join(" ")}
                    >
                      {businessHour.hours}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">
                ¿Necesitás otro horario?
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Comunicate por WhatsApp y consultá si existe alguna
                disponibilidad adicional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
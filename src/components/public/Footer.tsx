import { Link } from "react-router";
import { barberShopMock } from "../../mocks/site.mock";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-3"
              aria-label="Ir al inicio"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="m7 4 10 16M17 4 7 20"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <p className="text-sm font-black tracking-[0.16em] text-[var(--color-text)] uppercase">
                  Distrito
                </p>

                <p className="-mt-0.5 text-[10px] tracking-[0.32em] text-zinc-500 uppercase">
                  Barber
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-zinc-500">
              Cortes, barba y estilo en un espacio pensado para vos.
            </p>
          </div>

          <div>
            <p className="text-sm font-bold text-[var(--color-text)]">
              Navegación
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                to="/"
                className="text-sm text-zinc-500 transition-colors hover:text-[var(--color-text)]"
              >
                Inicio
              </Link>

              <Link
                to="/#servicios"
                className="text-sm text-zinc-500 transition-colors hover:text-[var(--color-text)]"
              >
                Servicios
              </Link>

              <Link
                to="/#trabajos"
                className="text-sm text-zinc-500 transition-colors hover:text-[var(--color-text)]"
              >
                Trabajos
              </Link>

              <Link
                to="/#contacto"
                className="text-sm text-zinc-500 transition-colors hover:text-[var(--color-text)]"
              >
                Contacto
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-[var(--color-text)]">
              Reservas
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                to="/reservar"
                className="text-sm text-zinc-500 transition-colors hover:text-[var(--color-text)]"
              >
                Reservar turno
              </Link>

              <a
                href={barberShopMock.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-zinc-500 transition-colors hover:text-[var(--color-text)]"
              >
                WhatsApp
              </a>

              <Link
                to="/login"
                className="text-sm text-zinc-500 transition-colors hover:text-[var(--color-text)]"
              >
                Acceso barbero
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-[var(--color-text)]">
              Encontranos
            </p>

            <div className="mt-5 space-y-3 text-sm text-zinc-500">
              <p>{barberShopMock.address}</p>

              <p>{barberShopMock.phone}</p>

              <a
                href={barberShopMock.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block transition-colors hover:text-[var(--color-text)]"
              >
                {barberShopMock.instagram}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[var(--color-border)] pt-7 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {barberShopMock.name}. Todos los derechos reservados.
          </p>

          <p>
            Barbería · Bella Vista, Tucumán
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
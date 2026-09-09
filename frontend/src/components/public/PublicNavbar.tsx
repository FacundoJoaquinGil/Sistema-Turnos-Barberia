import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  {
    label: "Inicio",
    path: "/",
  },
  {
    label: "Servicios",
    path: "/#servicios",
  },
  {
    label: "Trabajos",
    path: "/#trabajos",
  },
  {
    label: "Contacto",
    path: "/#contacto",
  },
];

const PublicNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  const isNavItemActive = (path: string) => {
    if (path.startsWith("/#")) {
      const hash = path.slice(1);

      return location.pathname === "/" && location.hash === hash;
    }

    if (path === "/") {
      return location.pathname === "/" && !location.hash;
    }

    return location.pathname === path;
  };

  const getNavItemClasses = (path: string) => {
    const isActive = isNavItemActive(path);

    return [
      "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-zinc-100 text-[var(--color-text)]"
        : "text-[var(--color-text-secondary)] hover:bg-zinc-100 hover:text-[var(--color-text)]",
    ].join(" ");
  };

  const getMobileNavItemClasses = (path: string) => {
    const isActive = isNavItemActive(path);

    return [
      "rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
      isActive
        ? "bg-zinc-100 text-[var(--color-text)]"
        : "text-[var(--color-text-secondary)] hover:bg-zinc-100 hover:text-[var(--color-text)]",
    ].join(" ");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)]/80 bg-white/90 backdrop-blur-md">
      <nav
        className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8"
        aria-label="Navegación principal"
      >
        <Link
          to="/"
          className="flex items-center gap-3"
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
                d="m7 4 10 16M17 4 7 20M5.5 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM18.5 15.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
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

            <p className="-mt-0.5 text-[10px] font-medium tracking-[0.32em] text-zinc-500 uppercase">
              Barber
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={getNavItemClasses(item.path)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="px-3 py-2 text-sm font-medium text-zinc-500 transition-colors hover:text-[var(--color-text)]"
          >
            Ingresar
          </Link>

          <Link
            to="/reservar"
            className="rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
          >
            Reservar turno
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-secondary)] transition-colors hover:bg-zinc-100 lg:hidden"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </nav>

      <div
        className={[
          "overflow-hidden border-[var(--color-border)] bg-white transition-all duration-300 lg:hidden",
          menuOpen
            ? "max-h-[500px] border-t opacity-100"
            : "max-h-0 border-t-0 opacity-0",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={getMobileNavItemClasses(item.path)}
            >
              {item.label}
            </Link>
          ))}

          <div className="my-3 h-px bg-zinc-200" />

          <Link
            to="/reservar"
            className="flex min-h-12 items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3 font-semibold text-white transition-colors active:bg-zinc-800"
          >
            Reservar turno
          </Link>

          <Link
            to="/login"
            className="flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-[var(--color-text)]"
          >
            Acceso barbero
          </Link>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;

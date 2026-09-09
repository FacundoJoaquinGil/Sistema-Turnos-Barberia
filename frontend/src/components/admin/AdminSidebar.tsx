import {
  BarChart3,
  CalendarDays,
  CalendarRange,
  Clock3,
  LayoutDashboard,
  LogOut,
  Scissors,
  UsersRound,
  X,
} from "lucide-react";
import { NavLink } from "react-router";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const navItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Agenda",
    path: "/admin/agenda",
    icon: CalendarDays,
  },
  {
    label: "Turnos",
    path: "/admin/turnos",
    icon: CalendarRange,
  },
  {
    label: "Clientes",
    path: "/admin/clientes",
    icon: UsersRound,
  },
  {
    label: "Servicios",
    path: "/admin/servicios",
    icon: Scissors,
  },
  {
    label: "Disponibilidad",
    path: "/admin/disponibilidad",
    icon: Clock3,
  },
  {
    label: "Estadísticas",
    path: "/admin/estadisticas",
    icon: BarChart3,
  },
];

const AdminSidebar = ({
  isOpen,
  onClose,
  onLogout,
}: AdminSidebarProps) => {
  return (
    <>
      {isOpen && (
        <button
          aria-label="Cerrar menú"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[var(--color-primary)] text-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[var(--color-text)]">
              <Scissors size={20} />
            </div>

            <div>
              <p className="font-semibold">
                Barbería
              </p>

              <p className="text-xs text-zinc-400">
                Administración
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Gestión
          </p>

          {navItems.map(
            ({
              label,
              path,
              icon: Icon,
              end,
            }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                onClick={onClose}
                className={({
                  isActive,
                }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-[var(--color-text)]"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />

                {label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={19} />

            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
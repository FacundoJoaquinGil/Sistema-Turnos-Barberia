import { Bell, Menu, UserRound } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import Swal from "sweetalert2";

import AdminSidebar from "../components/admin/AdminSidebar";
import { logoutMockAdmin } from "../lib/mockAuth";
import { useAuth } from "../context";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/agenda": "Agenda",
  "/admin/turnos": "Turnos",
  "/admin/clientes": "Clientes",
  "/admin/servicios": "Servicios",
  "/admin/disponibilidad": "Disponibilidad",
  "/admin/estadisticas": "Estadísticas",
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle = pageTitles[location.pathname] ?? "Administración";

  const { signOut } = useAuth();

 const handleLogout = async () => {
  const result = await Swal.fire({
    title: "¿Cerrar sesión?",
    text: "Tendrás que iniciar sesión nuevamente.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Cerrar sesión",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) {
    return;
  }

  await signOut();

  navigate(
    "/admin/login",
    {
      replace: true,
    },
  );
};

  return (
    <div className="min-h-screen bg-zinc-100">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[var(--color-border)] bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-[var(--color-border)] bg-white p-2.5 text-zinc-700 transition hover:bg-zinc-100 lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div>
              <h1 className="text-xl font-semibold text-[var(--color-text)] sm:text-2xl">
                {pageTitle}
              </h1>

              <p className="hidden text-sm text-zinc-500 sm:block">
                Gestioná tu barbería desde un solo lugar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="relative rounded-xl p-2.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-[var(--color-text)]">
              <Bell size={20} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="hidden h-8 w-px bg-zinc-200 sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                <UserRound size={19} />
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-medium text-[var(--color-secondary)]">
                  Administrador
                </p>

                <p className="text-xs text-zinc-500">Barbero</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

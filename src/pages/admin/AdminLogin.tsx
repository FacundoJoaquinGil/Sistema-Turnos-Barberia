import {
  ArrowRight,
  CalendarDays,
  LockKeyhole,
  Mail,
  Scissors,
} from "lucide-react";

import { Navigate, useNavigate } from "react-router";
import { FormEvent, useState } from "react";
import Swal from "sweetalert2";

import {
  isMockAdminAuthenticated,
  loginMockAdmin,
  MOCK_ADMIN_CREDENTIALS,
} from "../../lib/mockAuth";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (isMockAdminAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Ingresá tu correo y contraseña.",
        confirmButtonText: "Entendido",
      });

      return;
    }

    setLoading(true);

    const success = loginMockAdmin(email.trim(), password);

    if (!success) {
      setLoading(false);

      await Swal.fire({
        icon: "error",
        title: "Credenciales incorrectas",
        text: "Revisá el correo y la contraseña.",
        confirmButtonText: "Intentar nuevamente",
      });

      return;
    }

    await Swal.fire({
      icon: "success",
      title: "Bienvenido",
      text: "Acceso administrativo iniciado.",
      timer: 1200,
      showConfirmButton: false,
    });

    navigate("/admin", {
      replace: true,
    });
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* PANEL VISUAL */}
        <section className="relative hidden overflow-hidden bg-[var(--color-primary)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />

          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[var(--color-text)]">
                <Scissors size={22} />
              </div>

              <div>
                <p className="text-lg font-semibold">Barbería</p>

                <p className="text-sm text-zinc-400">Panel administrativo</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
              <CalendarDays size={16} />
              Gestión de turnos
            </span>

            <h1 className="text-5xl font-semibold leading-tight">
              Todo tu negocio,
              <br />
              en un solo lugar.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-400">
              Administrá tus turnos, clientes, servicios y disponibilidad desde
              una interfaz simple y rápida.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-2xl font-semibold">8</p>

                <p className="mt-1 text-sm text-zinc-400">Turnos hoy</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-2xl font-semibold">6</p>

                <p className="mt-1 text-sm text-zinc-400">Confirmados</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-2xl font-semibold">24</p>

                <p className="mt-1 text-sm text-zinc-400">Clientes</p>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-sm text-zinc-500">
            Sistema de gestión para barbería
          </p>
        </section>

        {/* LOGIN */}
        <section className="flex items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
                  <Scissors size={22} />
                </div>

                <div>
                  <p className="font-semibold text-[var(--color-text)]">Barbería</p>

                  <p className="text-sm text-zinc-500">Administración</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-2 text-sm font-medium text-zinc-500">
                Área privada
              </p>

              <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-text)]">
                Iniciar sesión
              </h2>

              <p className="mt-3 text-zinc-500">
                Ingresá tus credenciales para administrar la barbería.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Correo electrónico
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@barberia.com"
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-white pl-12 pr-4 text-[var(--color-text)] outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Contraseña
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-white pl-12 pr-4 text-[var(--color-text)] outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] font-medium text-white transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Ingresando..." : "Ingresar"}

                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* SOLO DESARROLLO */}
            <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-zinc-100 p-4 text-sm">
              <p className="font-medium text-zinc-700">
                Credenciales temporales
              </p>

              <p className="mt-2 text-zinc-500">
                Correo: {MOCK_ADMIN_CREDENTIALS.email}
              </p>

              <p className="text-zinc-500">
                Contraseña: {MOCK_ADMIN_CREDENTIALS.password}
              </p>

              <p className="mt-2 text-xs text-zinc-400">
                Esta sección se eliminará cuando integremos Supabase Auth.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminLogin;

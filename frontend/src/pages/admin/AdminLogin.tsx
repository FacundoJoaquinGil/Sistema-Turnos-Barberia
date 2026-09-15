import {
  ArrowRight,
  CalendarDays,
  LockKeyhole,
  Mail,
  Scissors,
} from "lucide-react";

import {
  Navigate,
  useNavigate,
} from "react-router";

import type { FormEvent } from "react";

import { useState } from "react";

import Swal from "sweetalert2";

import { useAuth } from "../../context";

const AdminLogin = () => {
  const navigate = useNavigate();

  const {
    user,
    loading: authLoading,
    signIn,
  } = useAuth();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // ---------------------------------------------------------
  // CARGANDO SESIÓN
  // ---------------------------------------------------------

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Cargando...
        </p>
      </main>
    );
  }

  // ---------------------------------------------------------
  // USUARIO YA AUTENTICADO
  // ---------------------------------------------------------

  if (user) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  // ---------------------------------------------------------
  // LOGIN
  // ---------------------------------------------------------

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      await Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Ingresá tu correo y contraseña.",
      });

      return;
    }

    try {
      setLoading(true);

      await signIn(
        email.trim(),
        password,
      );

      await Swal.fire({
        icon: "success",
        title: "Sesión iniciada",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/admin", {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      await Swal.fire({
        icon: "error",
        title: "No se pudo iniciar sesión",
        text: "Correo o contraseña incorrectos.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =====================================================
            PANEL VISUAL
        ===================================================== */}

        <section className="relative hidden overflow-hidden bg-[var(--color-primary)] p-10 text-white lg:flex lg:flex-col lg:justify-between">

          {/* Decoración */}

          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />

          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/5" />

          {/* Logo */}

          <div className="relative z-10">
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[var(--color-text)]">
                <Scissors size={22} />
              </div>

              <div>
                <p className="text-lg font-semibold">
                  Barbería
                </p>

                <p className="text-sm text-white/60">
                  Panel administrativo
                </p>
              </div>

            </div>
          </div>

          {/* Información */}

          <div className="relative z-10 max-w-xl">

            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              <CalendarDays size={16} />
              Gestión de turnos
            </span>

            <h1 className="text-5xl font-semibold leading-tight">
              Todo tu negocio,
              <br />
              en un solo lugar.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-white/60">
              Administrá tus turnos, clientes,
              servicios y disponibilidad desde
              una interfaz simple y rápida.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-2xl font-semibold">
                  8
                </p>

                <p className="mt-1 text-sm text-white/60">
                  Turnos hoy
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-2xl font-semibold">
                  6
                </p>

                <p className="mt-1 text-sm text-white/60">
                  Confirmados
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-2xl font-semibold">
                  24
                </p>

                <p className="mt-1 text-sm text-white/60">
                  Clientes
                </p>
              </div>

            </div>
          </div>

          <p className="relative z-10 text-sm text-white/40">
            Sistema de gestión para barbería
          </p>
        </section>

        {/* =====================================================
            LOGIN
        ===================================================== */}

        <section className="flex items-center justify-center px-5 py-12 sm:px-8">

          <div className="w-full max-w-md">

            {/* Logo mobile */}

            <div className="mb-10 lg:hidden">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
                  <Scissors size={22} />
                </div>

                <div>
                  <p className="font-semibold text-[var(--color-text)]">
                    Barbería
                  </p>

                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Administración
                  </p>
                </div>

              </div>
            </div>

            {/* Encabezado */}

            <div className="mb-8">

              <p className="mb-2 text-sm font-medium text-[var(--color-text-secondary)]">
                Área privada
              </p>

              <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-text)]">
                Iniciar sesión
              </h2>

              <p className="mt-3 text-[var(--color-text-secondary)]">
                Ingresá tus credenciales para
                administrar la barbería.
              </p>

            </div>

            {/* Formulario */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* EMAIL */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[var(--color-text)]"
                >
                  Correo electrónico
                </label>

                <div className="relative">

                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="admin@barberia.com"
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-white pl-12 pr-4 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[var(--color-text)]"
                >
                  Contraseña
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
                  />

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-white pl-12 pr-4 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10"
                  />

                </div>

              </div>

              {/* BOTÓN */}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] font-medium text-white transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Ingresando..."
                  : "Ingresar"}

                {!loading && (
                  <ArrowRight size={18} />
                )}
              </button>

            </form>

          </div>

        </section>
      </div>
    </main>
  );
};

export default AdminLogin;
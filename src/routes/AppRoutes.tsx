import { Navigate, Route, Routes } from "react-router";

import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

import { Booking, ComingSoon, Home } from "../pages/public";

import {
  AdminAgenda,
  AdminDashboard,
  AdminLogin,
  AdminPlaceholder,
} from "../pages/admin";

import ProtectedAdminRoute from "./ProtectedAdminRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* =========================
          ÁREA PÚBLICA
      ========================== */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />

        <Route
          path="servicios"
          element={<Navigate to="/#servicios" replace />}
        />

        <Route path="trabajos" element={<Navigate to="/#trabajos" replace />} />

        <Route path="contacto" element={<Navigate to="/#contacto" replace />} />

        <Route path="reservar" element={<Booking />} />

        {/* 
          Conservamos /login para no romper
          enlaces existentes del navbar.
        */}
        <Route path="login" element={<Navigate to="/admin/login" replace />} />
      </Route>

      {/* =========================
          LOGIN ADMINISTRATIVO
      ========================== */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* =========================
          ÁREA PRIVADA
      ========================== */}
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          {/* Dashboard */}
          <Route index element={<AdminDashboard />} />

          {/* Agenda */}
          <Route path="agenda" element={<AdminAgenda />} />

          {/* Turnos */}
          <Route
            path="turnos"
            element={
              <AdminPlaceholder
                title="Turnos"
                description="Desde aquí podremos crear, confirmar, cancelar y consultar turnos."
              />
            }
          />

          {/* Clientes */}
          <Route
            path="clientes"
            element={
              <AdminPlaceholder
                title="Clientes"
                description="Aquí administraremos el historial y los datos de los clientes."
              />
            }
          />

          {/* Servicios */}
          <Route
            path="servicios"
            element={
              <AdminPlaceholder
                title="Servicios"
                description="Aquí configuraremos los servicios ofrecidos, sus precios y duración estimada."
              />
            }
          />

          {/* Disponibilidad */}
          <Route
            path="disponibilidad"
            element={
              <AdminPlaceholder
                title="Disponibilidad"
                description="Aquí definiremos los días y horarios disponibles para recibir reservas."
              />
            }
          />

          {/* Estadísticas */}
          <Route
            path="estadisticas"
            element={
              <AdminPlaceholder
                title="Estadísticas"
                description="Aquí analizaremos turnos, clientes e ingresos de la barbería."
              />
            }
          />
        </Route>
      </Route>

      {/* =========================
          404
      ========================== */}
      <Route element={<PublicLayout />}>
        <Route
          path="*"
          element={
            <ComingSoon
              title="Página no encontrada"
              description="La dirección que intentaste visitar no existe."
            />
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

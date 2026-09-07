import { Navigate, Route, Routes } from "react-router";

import BarbershopDataProvider from "../context/BarbershopDataProvider";

import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

import { Booking, ComingSoon, Home } from "../pages/public";

import {
  AdminAgenda,
  AdminAppointments,
  AdminAvailability,
  AdminClients,
  AdminDashboard,
  AdminLogin,
  AdminPlaceholder,
  AdminServices,
} from "../pages/admin";

import ProtectedAdminRoute from "./ProtectedAdminRoute";

const AppRoutes = () => {
  return (
    <BarbershopDataProvider>
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

          <Route
            path="trabajos"
            element={<Navigate to="/#trabajos" replace />}
          />

          <Route
            path="contacto"
            element={<Navigate to="/#contacto" replace />}
          />

          <Route path="reservar" element={<Booking />} />

          {/* 
            Conservamos /login para no romper
            enlaces existentes del navbar.
          */}
          <Route
            path="login"
            element={<Navigate to="/admin/login" replace />}
          />
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
            <Route path="turnos" element={<AdminAppointments />} />

            {/* Clientes */}
            <Route path="clientes" element={<AdminClients />} />

            {/* Servicios */}
            <Route path="servicios" element={<AdminServices />} />

            {/* Disponibilidad */}
            <Route path="disponibilidad" element={<AdminAvailability />} />

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
    </BarbershopDataProvider>
  );
};

export default AppRoutes;

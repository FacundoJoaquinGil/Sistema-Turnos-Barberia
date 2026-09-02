import { Navigate, Route, Routes } from "react-router";
import PublicLayout from "../layouts/PublicLayout";
import ComingSoon from "../pages/public/ComingSoon";
import Home from "../pages/public/Home";
import Booking from "../pages/public/Booking";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />

        <Route
          path="servicios"
          element={<Navigate to="/#servicios" replace />}
        />

        <Route path="trabajos" element={<Navigate to="/#trabajos" replace />} />

        <Route path="contacto" element={<Navigate to="/#contacto" replace />} />

        <Route path="reservar" element={<Booking />} />

        <Route
          path="login"
          element={
            <ComingSoon
              title="Acceso del barbero"
              description="El acceso privado será implementado posteriormente junto con el área administrativa."
            />
          }
        />

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

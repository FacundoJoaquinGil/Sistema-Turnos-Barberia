import { Navigate, Outlet } from "react-router";

import { useAuth } from "../context";

const ProtectedAdminRoute = () => {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Cargando...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
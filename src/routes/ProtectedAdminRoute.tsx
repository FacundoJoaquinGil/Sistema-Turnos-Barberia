import {
  Navigate,
  Outlet,
} from "react-router";

import { isMockAdminAuthenticated } from "../lib/mockAuth";

const ProtectedAdminRoute = () => {
  if (!isMockAdminAuthenticated()) {
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
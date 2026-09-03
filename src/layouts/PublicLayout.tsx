import { Outlet } from "react-router";
import Footer from "../components/public/Footer";
import PublicNavbar from "../components/public/PublicNavbar";
import useScrollToHash from "../hooks/useScrollToHash";

const PublicLayout = () => {
  useScrollToHash();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <PublicNavbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;
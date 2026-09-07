import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--text)]">
      {/* ONE Navbar */}
      <Navbar />

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ONE Footer */}
      <Footer />
    </div>
  );
}

export default Layout;
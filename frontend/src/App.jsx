import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import Swaps from "./pages/MySwaps";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Layout from "./components/Layout";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-[15px] bg-[var(--purple)] text-lg text-white shadow-[var(--shadow-md)]">
            ✦
          </div>

          <p className="mt-4 text-[11px] font-medium tracking-wide text-[var(--text-secondary)]">
            Loading TimeSwap...
          </p>

          <div className="mt-3 flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--purple)]" />

            <span
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--purple)]"
              style={{ animationDelay: "0.15s" }}
            />

            <span
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--purple)]"
              style={{ animationDelay: "0.3s" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route
          path="/"
          element={
            <Navigate
              to={user ? "/dashboard" : "/login"}
              replace
            />
          }
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register />
            )
          }
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* =========================
            PROTECTED ROUTES

            Navbar + Footer ONLY
            come from Layout.jsx
        ========================= */}

        <Route
          element={
            user ? (
              <Layout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/explore"
            element={<Explore />}
          />

          <Route
            path="/swaps"
            element={<Swaps />}
          />

          <Route
            path="/messages"
            element={<Messages />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />
        </Route>

        {/* =========================
            UNKNOWN URL
        ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to={user ? "/dashboard" : "/login"}
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
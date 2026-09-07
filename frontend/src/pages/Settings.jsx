import { useState } from "react";
import {
  ArrowLeft,
  Moon,
  Sun,
  Bell,
  Lock,
  User,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Settings() {
  const { user, logout } = useAuth();

  // Your ThemeContext uses "theme", not "darkMode"
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-card)]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-[1200px] items-center justify-between px-5 lg:px-8">

          {/* LOGO */}

          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-sm">
              <Sparkles size={16} />
            </div>

            <div>
              <span className="block text-[16px] font-bold tracking-[-0.03em]">
                TimeSwap
              </span>

              <span className="hidden text-[8px] uppercase tracking-[0.16em] text-[var(--text-muted)] sm:block">
                Give an hour. Gain a skill.
              </span>
            </div>
          </Link>

          {/* PROFILE */}

          <Link
            to="/profile"
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#fec5bb] text-sm font-bold text-[#561206] transition hover:scale-105"
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </Link>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto w-full max-w-[900px] px-5 py-8 lg:px-8">

        {/* BACK */}

        <Link
          to="/dashboard"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text-main)]"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        {/* HEADING */}

        <div className="mb-8">

          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
            TimeSwap
          </p>

          <h1 className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
            Settings
          </h1>

          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Manage your account and personalize your TimeSwap experience.
          </p>

        </div>

        {/* =====================================================
            ACCOUNT
        ===================================================== */}

        <section className="mb-6 overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

          <div className="border-b border-[var(--border)] px-6 py-5">

            <h2 className="text-base font-bold">
              Account
            </h2>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Manage your personal information.
            </p>

          </div>

          <Link
            to="/profile"
            className="flex items-center justify-between px-6 py-5 transition hover:bg-[var(--bg-hover)]"
          >

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffe5d9] text-[#be3c00]">
                <User size={18} />
              </div>

              <div>

                <p className="text-sm font-semibold">
                  Edit profile
                </p>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Change your name, bio and skills
                </p>

              </div>

            </div>

            <ChevronRight
              size={17}
              className="text-[var(--text-muted)]"
            />

          </Link>

        </section>

        {/* =====================================================
            APPEARANCE
        ===================================================== */}

        <section className="mb-6 overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

          <div className="border-b border-[var(--border)] px-6 py-5">

            <h2 className="text-base font-bold">
              Appearance
            </h2>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Choose how TimeSwap looks for you.
            </p>

          </div>

          <div className="flex items-center justify-between gap-4 px-6 py-5">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fcd5ce] text-[#ad230b]">

                {isDark ? (
                  <Moon size={18} />
                ) : (
                  <Sun size={18} />
                )}

              </div>

              <div>

                <p className="text-sm font-semibold">
                  {isDark ? "Dark mode" : "Light mode"}
                </p>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {isDark
                    ? "A darker interface that's easier on the eyes."
                    : "A bright and clean TimeSwap interface."}
                </p>

              </div>

            </div>

            {/* THEME TOGGLE */}

            <button
              type="button"
              onClick={toggleTheme}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                isDark
                  ? "bg-[var(--accent)]"
                  : "bg-[#c8c3bb]"
              }`}
              aria-label="Toggle theme"
            >

              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                  isDark
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />

            </button>

          </div>

        </section>

        {/* =====================================================
            NOTIFICATIONS
        ===================================================== */}

        <section className="mb-6 overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

          <div className="border-b border-[var(--border)] px-6 py-5">

            <h2 className="text-base font-bold">
              Notifications
            </h2>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Control how TimeSwap keeps you updated.
            </p>

          </div>

          <div className="flex items-center justify-between gap-4 px-6 py-5">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d8e2dc] text-[#4b6656]">
                <Bell size={18} />
              </div>

              <div>

                <p className="text-sm font-semibold">
                  Push notifications
                </p>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Get notified about requests and messages.
                </p>

              </div>

            </div>

            {/* NOTIFICATION TOGGLE */}

            <button
              type="button"
              onClick={() =>
                setNotifications(!notifications)
              }
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                notifications
                  ? "bg-[var(--accent)]"
                  : "bg-[#c8c3bb]"
              }`}
              aria-label="Toggle notifications"
            >

              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                  notifications
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />

            </button>

          </div>

        </section>

        {/* =====================================================
            SECURITY
        ===================================================== */}

        <section className="mb-6 overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

          <div className="border-b border-[var(--border)] px-6 py-5">

            <h2 className="text-base font-bold">
              Privacy & Security
            </h2>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Keep your TimeSwap account secure.
            </p>

          </div>

          <div className="flex items-center justify-between px-6 py-5">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fae1dd] text-[#e14f38]">
                <Lock size={18} />
              </div>

              <div>

                <p className="text-sm font-semibold">
                  Account security
                </p>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Your account is protected with authentication.
                </p>

              </div>

            </div>

            <ChevronRight
              size={17}
              className="text-[var(--text-muted)]"
            />

          </div>

        </section>

        {/* =====================================================
            LOGOUT
        ===================================================== */}

        <section className="overflow-hidden rounded-[24px] border border-red-200 bg-[var(--bg-card)] shadow-sm dark:border-red-900/50">

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-red-50 dark:hover:bg-red-950/20"
          >

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                <LogOut size={18} />
              </div>

              <div>

                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                  Log out
                </p>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Sign out from this TimeSwap account.
                </p>

              </div>

            </div>

            <ChevronRight
              size={17}
              className="text-red-400"
            />

          </button>

        </section>

        {/* FOOTER */}

        <div className="py-8 text-center">

          <p className="text-[10px] text-[var(--text-muted)]">
            TimeSwap ✦ Give an hour. Gain a skill.
          </p>

        </div>

      </main>
    </div>
  );
}

export default Settings;
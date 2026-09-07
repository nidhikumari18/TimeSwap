import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Lock,
  Sparkles,
} from "lucide-react";
import api from "../services/api"

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        `/auth/reset-password/${token}`,
        {
          password,
        }
      );

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4eee6] px-5 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)] md:grid-cols-2">

          {/* LEFT */}

          <div className="hidden bg-[#dcd2e4] p-12 md:flex md:flex-col md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#292722] text-white">
                  <Sparkles size={18} />
                </div>

                <span className="text-lg font-semibold tracking-tight">
                  TimeSwap
                </span>
              </div>

              <div className="mt-24">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#777269]">
                  Almost there
                </p>

                <h1 className="max-w-md text-5xl font-semibold leading-[1.05] tracking-tight text-[#292722]">
                  Choose a new password.
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-[#777269]">
                  Create a new password for your TimeSwap
                  account and continue your journey.
                </p>
              </div>
            </div>

            <p className="text-sm text-[#777269]">
              ✦ Learn something. Teach something. Grow together.
            </p>
          </div>

          {/* RIGHT */}

          <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
            <div className="w-full max-w-md">

              <div className="mb-10 md:hidden">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#292722] text-white">
                    <Sparkles size={18} />
                  </div>

                  <span className="text-lg font-semibold">
                    TimeSwap
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-[#9a948a]">
                  Secure your account 🔐
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#292722]">
                  New password
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#777269]">
                  Choose a new password for your account.
                </p>
              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* SUCCESS */}

              {message && (
                <div className="mt-6 flex items-start gap-2 rounded-2xl bg-[#d6dec4] px-4 py-3 text-sm text-[#596c3e]">
                  <CheckCircle
                    size={17}
                    className="mt-0.5 shrink-0"
                  />
                  <span>{message}</span>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                {/* PASSWORD */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#49453f]">
                    New password
                  </label>

                  <div className="relative">
                    <Lock
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a948a]"
                    />

                    <input
                      type="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Create a new password"
                      minLength={6}
                      required
                      className="w-full rounded-2xl border border-[#e5e1da] bg-[#faf9f7] py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#aaa49b] focus:border-[#725b80] focus:bg-white"
                    />
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#49453f]">
                    Confirm password
                  </label>

                  <div className="relative">
                    <Lock
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a948a]"
                    />

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      placeholder="Confirm your new password"
                      minLength={6}
                      required
                      className="w-full rounded-2xl border border-[#e5e1da] bg-[#faf9f7] py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#aaa49b] focus:border-[#725b80] focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !!message}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#725b80] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[#60476f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Updating password..."
                    : "Update password"}

                  {!loading && !message && (
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-[#777269]">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#725b80] underline underline-offset-4"
                >
                  Sign in
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
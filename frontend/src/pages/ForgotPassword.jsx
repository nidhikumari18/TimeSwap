import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail, Sparkles } from "lucide-react";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/forgot-password",
        {
          email,
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4eee6] px-5 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)] md:grid-cols-2">

          {/* LEFT SIDE */}

          <div className="hidden bg-[#ead0d6] p-12 md:flex md:flex-col md:justify-between">
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
                  Account recovery
                </p>

                <h1 className="max-w-md text-5xl font-semibold leading-[1.05] tracking-tight text-[#292722]">
                  We'll help you get back in.
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-[#777269]">
                  Enter your email and we'll send you a secure
                  link to create a new password.
                </p>
              </div>
            </div>

            <p className="text-sm text-[#777269]">
              ✦ Your skills are waiting for you.
            </p>
          </div>

          {/* RIGHT SIDE */}

          <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
            <div className="w-full max-w-md">

              {/* Mobile logo */}

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

              {/* Header */}

              <div>
                <p className="text-sm font-medium text-[#9a948a]">
                  Forgot your password? 🔐
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#292722]">
                  Reset password
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#777269]">
                  Enter your email and we'll send you a reset
                  link.
                </p>
              </div>

              {/* Error */}

              {error && (
                <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Success */}

              {message && (
                <div className="mt-6 rounded-2xl bg-[#d6dec4] px-4 py-3 text-sm text-[#596c3e]">
                  {message}
                </div>
              )}

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#49453f]">
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a948a]"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-2xl border border-[#e5e1da] bg-[#faf9f7] py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#aaa49b] focus:border-[#725b80] focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#725b80] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[#60476f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Sending..."
                    : "Send reset link"}

                  {!loading && (
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              {/* Back to login */}

              <div className="mt-8 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#725b80]"
                >
                  <ArrowLeft size={15} />
                  Back to sign in
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
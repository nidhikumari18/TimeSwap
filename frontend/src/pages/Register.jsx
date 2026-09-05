import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(
        formData.name,
        formData.username,
        formData.email,
        formData.password
      );

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] px-5 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)] md:grid-cols-2">

          <div className="hidden bg-[#e9e4da] p-12 md:flex md:flex-col md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#292722] text-white">
                  <Sparkles size={18} />
                </div>

                <span className="text-lg font-semibold tracking-tight">
                  SkillSwap
                </span>
              </div>

              <div className="mt-24">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#777269]">
                  Share your knowledge
                </p>

                <h1 className="max-w-md text-5xl font-semibold leading-[1.05] tracking-tight text-[#292722]">
                  Everyone knows something worth teaching.
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-[#777269]">
                  Create your profile, list your skills and discover
                  people who can teach you something new.
                </p>
              </div>
            </div>

            <p className="text-sm text-[#777269]">
              ✦ Your next skill swap starts here.
            </p>
          </div>

          <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
            <div className="w-full max-w-md">

              <div className="mb-8 md:hidden">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#292722] text-white">
                    <Sparkles size={18} />
                  </div>

                  <span className="text-lg font-semibold">
                    SkillSwap
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-[#9a948a]">
                  Start your journey ✨
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#292722]">
                  Create account
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#777269]">
                  Tell us a little about yourself.
                </p>
              </div>

              {error && (
                <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-4"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#49453f]">
                    Name
                  </label>

                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="w-full rounded-2xl border border-[#e5e1da] bg-[#faf9f7] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#aaa49b] focus:border-[#292722] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#49453f]">
                    Username
                  </label>

                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="@yourusername"
                    required
                    className="w-full rounded-2xl border border-[#e5e1da] bg-[#faf9f7] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#aaa49b] focus:border-[#292722] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#49453f]">
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-2xl border border-[#e5e1da] bg-[#faf9f7] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#aaa49b] focus:border-[#292722] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#49453f]">
                    Password
                  </label>

                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    minLength={6}
                    className="w-full rounded-2xl border border-[#e5e1da] bg-[#faf9f7] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#aaa49b] focus:border-[#292722] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#292722] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[#403d37] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Creating account..."
                    : "Create account"}

                  {!loading && (
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              <div className="mt-7 text-center text-sm text-[#777269]">
                Already have an account?{" "}

                <Link
                  to="/login"
                  className="font-semibold text-[#292722] underline underline-offset-4"
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

export default Register;
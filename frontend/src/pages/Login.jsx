import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(
        formData.email,
        formData.password
      );

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5eee8] px-5 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-[#e4d6cf] bg-[#fffdfb] shadow-[0_20px_60px_rgba(104,78,70,0.10)] md:grid-cols-2">

          {/* LEFT SIDE */}

          <div className="relative hidden overflow-hidden bg-[#ead8d3] p-12 md:flex md:flex-col md:justify-between">

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#e2c3c8] opacity-60" />

            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#d9c9df] opacity-60" />

            <div className="relative z-10">

              {/* LOGO */}

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6d5365] text-white shadow-sm">
                  <Sparkles size={18} />
                </div>

                <span className="text-lg font-semibold tracking-tight text-[#3c3037]">
                  TimeSwap
                </span>
              </div>

              {/* MAIN TEXT */}

              <div className="mt-28">

                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#806c72]">
                  Learn · Teach · Connect
                </p>

                <h1 className="max-w-md text-5xl font-semibold leading-[1.08] tracking-tight text-[#3b3036]">
                  Your skills have
                  <br />
                  a story to tell.
                </h1>

                <p className="mt-6 max-w-md text-[15px] leading-7 text-[#78666c]">
                  Connect with people, exchange knowledge,
                  and discover something new along the way.
                </p>

                <div className="mt-8 h-[2px] w-16 rounded-full bg-[#9f7c89]" />
              </div>
            </div>

            <p className="relative z-10 text-sm text-[#806c72]">
              A little place for sharing what you know.
            </p>
          </div>

          {/* RIGHT SIDE */}

          <div className="flex items-center justify-center bg-[#fffdfb] p-8 sm:p-12 lg:p-16">

            <div className="w-full max-w-md">

              {/* MOBILE LOGO */}

              <div className="mb-10 md:hidden">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6d5365] text-white">
                    <Sparkles size={18} />
                  </div>

                  <span className="text-lg font-semibold text-[#3c3037]">
                    TimeSwap
                  </span>

                </div>

              </div>

              {/* HEADING */}

              <div>

                <p className="text-sm font-medium text-[#947fa0]">
                  Welcome back
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#342b38]">
                  Sign in
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#897b8d]">
                  Continue your TimeSwap journey.
                </p>

              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-6 rounded-2xl border border-[#f0caca] bg-[#fff2f2] px-4 py-3 text-sm text-[#b45d62]">
                  {error}
                </div>
              )}

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >

                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-[#51434a]">
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-2xl border border-[#e5dcd7] bg-[#faf7f5] px-4 py-3.5 text-sm text-[#3d3439] outline-none transition-all duration-200 placeholder:text-[#b3a6aa] focus:border-[#947fa0] focus:bg-white focus:ring-4 focus:ring-[#e7dfea]"
                  />

                </div>

                {/* PASSWORD */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label className="block text-sm font-medium text-[#51434a]">
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-[#947fa0] hover:text-[#66506f]"
                    >
                      Forgot password?
                    </Link>

                  </div>

                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Your password"
                    required
                    className="w-full rounded-2xl border border-[#e5dcd7] bg-[#faf7f5] px-4 py-3.5 text-sm text-[#3d3439] outline-none transition-all duration-200 placeholder:text-[#b3a6aa] focus:border-[#947fa0] focus:bg-white focus:ring-4 focus:ring-[#e7dfea]"
                  />

                </div>

                {/* BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full cursor-pointer rounded-2xl bg-[#66506f] px-5 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#574360] hover:shadow-[0_10px_25px_rgba(102,80,111,0.22)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Signing in..."
                    : "Sign in"}
                </button>

              </form>

              {/* REGISTER */}

              <div className="mt-8 text-center text-sm text-[#8a797e]">

                Don't have an account?{" "}

                <Link
                  to="/register"
                  className="cursor-pointer font-semibold text-[#6d5365] underline decoration-[#c8aeb8] underline-offset-4 transition hover:text-[#9a7180]"
                >
                  Create one
                </Link>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
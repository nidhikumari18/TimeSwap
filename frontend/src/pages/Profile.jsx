import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    skillsToTeach: [],
    skillsToLearn: [],
  });

  const [newSkillTeach, setNewSkillTeach] = useState("");
  const [newSkillLearn, setNewSkillLearn] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load user profile on mount
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        skillsToTeach: user.skillsToTeach || [],
        skillsToLearn: user.skillsToLearn || [],
      });
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const addSkillToTeach = () => {
    if (
      newSkillTeach.trim() &&
      !formData.skillsToTeach.includes(
        newSkillTeach.trim()
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        skillsToTeach: [
          ...prev.skillsToTeach,
          newSkillTeach.trim(),
        ],
      }));
      setNewSkillTeach("");
    }
  };

  const addSkillToLearn = () => {
    if (
      newSkillLearn.trim() &&
      !formData.skillsToLearn.includes(
        newSkillLearn.trim()
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        skillsToLearn: [
          ...prev.skillsToLearn,
          newSkillLearn.trim(),
        ],
      }));
      setNewSkillLearn("");
    }
  };

  const removeSkillToTeach = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skillsToTeach: prev.skillsToTeach.filter(
        (s) => s !== skillToRemove
      ),
    }));
  };

  const removeSkillToLearn = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skillsToLearn: prev.skillsToLearn.filter(
        (s) => s !== skillToRemove
      ),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.username.trim()) {
      setError("Username is required");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.put("/users/me", {
        name: formData.name.trim(),
        username: formData.username.trim(),
        bio: formData.bio.trim(),
        skillsToTeach: formData.skillsToTeach,
        skillsToLearn: formData.skillsToLearn,
      });

      // Update AuthContext with new user data
      const updatedUser = response.data.user;
      setUser(updatedUser);

      setSuccess("Profile updated successfully! 🌷");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to update profile. Please try again.";
      setError(errorMsg);
      console.error("Profile update error:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f4ee] text-[#292722]">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#292722] text-white">
              ✦
            </div>
            <p className="mt-4 text-[11px] font-medium text-[#8e887f]">
              Loading your profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#292722]">
      {/* NAVBAR */}

      <header className="sticky top-0 z-50 border-b border-[#e5e0d8] bg-[#f7f4ee]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-[1320px] items-center justify-between px-5 lg:px-8">
          {/* LOGO */}

          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#292722] text-white">
              <Sparkles size={15} />
            </div>

            <div>
              <span className="block text-[16px] font-semibold tracking-[-0.03em]">
                SkillSwap
              </span>

              <span className="hidden text-[8px] uppercase tracking-[0.16em] text-[#aaa39a] sm:block">
                Give an hour. Gain a skill.
              </span>
            </div>
          </Link>

          {/* NAVIGATION */}

          <nav className="hidden items-center gap-8 md:flex">
            <NavItem to="/dashboard" text="Home" />

            <NavItem to="/explore" text="Explore" />

            <NavItem to="/swaps" text="My swaps" />

            <NavItem to="/messages" text="Messages" />
          </nav>

          {/* PROFILE */}

          <Link
            to="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ddd4e7] text-xs font-semibold transition hover:scale-105"
          >
            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </Link>
        </div>
      </header>

      {/* MAIN */}

      <main className="mx-auto max-w-[800px] px-5 py-8 sm:px-8 lg:py-10">
        {/* BACK */}

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-[10px] text-[#8e887f] transition hover:text-[#292722]"
        >
          <ArrowLeft size={13} />
          Back home
        </Link>

        {/* HERO */}

        <section className="mt-6 rounded-[28px] bg-[#ddd5e8] px-6 py-9 sm:px-10 sm:py-11">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eee9f2] px-3 py-1.5 text-[9px] font-medium text-[#6d6473]">
            <Sparkles size={11} />
            Your profile
          </div>

          <h1 className="mt-5 text-[38px] font-semibold leading-[0.98] tracking-[-0.06em] sm:text-[52px]">
            Edit your
            <br />
            SkillSwap profile.
          </h1>

          <p className="mt-5 max-w-[500px] text-[12px] leading-6 text-[#706974] sm:text-[13px]">
            Update your information, skills you can teach, and skills you want to learn.
          </p>
        </section>

        {/* ERROR */}

        {error && (
          <div className="mt-5 rounded-2xl border border-[#ead8d5] bg-[#f8eae7] px-5 py-4 text-[11px] text-[#8b625c]">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mt-5 rounded-2xl border border-[#d8dfca] bg-[#e9eedf] px-5 py-4 text-[11px] text-[#59624c]">
            {success}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSave}
          className="mt-8 space-y-6 rounded-[24px] border border-[#e2ddd5] bg-[#fffdf9] p-6 sm:p-8"
        >
          {/* NAME */}

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#aaa39a]">
              Full name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your full name"
              required
              className="mt-2 w-full rounded-[16px] border border-[#e1dcd4] bg-[#f8f6f1] px-4 py-3 text-[13px] outline-none transition placeholder:text-[#aaa39a] focus:border-[#292722] focus:bg-white"
            />
          </div>

          {/* USERNAME */}

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#aaa39a]">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Your username"
              required
              className="mt-2 w-full rounded-[16px] border border-[#e1dcd4] bg-[#f8f6f1] px-4 py-3 text-[13px] outline-none transition placeholder:text-[#aaa39a] focus:border-[#292722] focus:bg-white"
            />
          </div>

          {/* EMAIL (READ-ONLY) */}

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#aaa39a]">
              Email
            </label>

            <input
              type="email"
              value={formData.email}
              disabled
              className="mt-2 w-full rounded-[16px] border border-[#e1dcd4] bg-[#f1ede7] px-4 py-3 text-[13px] text-[#aaa39a] outline-none"
            />

            <p className="mt-1 text-[9px] text-[#aaa39a]">
              Email cannot be changed
            </p>
          </div>

          {/* BIO */}

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#aaa39a]">
              Bio
            </label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell others about yourself and your interests..."
              rows="4"
              className="mt-2 w-full rounded-[16px] border border-[#e1dcd4] bg-[#f8f6f1] px-4 py-3 text-[13px] outline-none transition placeholder:text-[#aaa39a] focus:border-[#292722] focus:bg-white"
            />

            <p className="mt-1 text-[9px] text-[#aaa39a]">
              {formData.bio.length} characters
            </p>
          </div>

          {/* SKILLS TO TEACH */}

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#aaa39a]">
              Skills you can teach
            </label>

            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newSkillTeach}
                onChange={(e) =>
                  setNewSkillTeach(e.target.value)
                }
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkillToTeach();
                  }
                }}
                placeholder="Add a skill..."
                className="flex-1 rounded-[16px] border border-[#e1dcd4] bg-[#f8f6f1] px-4 py-3 text-[13px] outline-none transition placeholder:text-[#aaa39a] focus:border-[#292722] focus:bg-white"
              />

              <button
                type="button"
                onClick={addSkillToTeach}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#292722] text-white transition hover:bg-[#3c3934]"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {formData.skillsToTeach.map((skill) => (
                <div
                  key={skill}
                  className="inline-flex items-center gap-2 rounded-full bg-[#f2d967] px-3 py-2 text-[11px] font-medium"
                >
                  {skill}

                  <button
                    type="button"
                    onClick={() =>
                      removeSkillToTeach(skill)
                    }
                    className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-white/50"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SKILLS TO LEARN */}

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#aaa39a]">
              Skills you want to learn
            </label>

            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newSkillLearn}
                onChange={(e) =>
                  setNewSkillLearn(e.target.value)
                }
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkillToLearn();
                  }
                }}
                placeholder="Add a skill..."
                className="flex-1 rounded-[16px] border border-[#e1dcd4] bg-[#f8f6f1] px-4 py-3 text-[13px] outline-none transition placeholder:text-[#aaa39a] focus:border-[#292722] focus:bg-white"
              />

              <button
                type="button"
                onClick={addSkillToLearn}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#292722] text-white transition hover:bg-[#3c3934]"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {formData.skillsToLearn.map((skill) => (
                <div
                  key={skill}
                  className="inline-flex items-center gap-2 rounded-full bg-[#e8b6d5] px-3 py-2 text-[11px] font-medium text-[#675d6d]"
                >
                  {skill}

                  <button
                    type="button"
                    onClick={() =>
                      removeSkillToLearn(skill)
                    }
                    className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-white/50"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT */}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-[16px] bg-[#292722] py-3 text-[12px] font-medium text-white transition hover:bg-[#3c3934] disabled:opacity-50"
            >
              {saving
                ? "Saving changes..."
                : "Save changes"}
            </button>

            <Link
              to="/dashboard"
              className="flex items-center justify-center rounded-[16px] border border-[#e1dcd4] py-3 px-5 text-[12px] font-medium transition hover:bg-[#f7f4ee]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

function NavItem({
  to,
  text,
  active,
}) {
  return (
    <Link
      to={to}
      className={`text-[12px] transition ${
        active
          ? "font-medium text-[#292722]"
          : "text-[#89837b] hover:text-[#292722]"
      }`}
    >
      {text}
    </Link>
  );
}

export default Profile;
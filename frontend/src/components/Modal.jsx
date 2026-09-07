import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Edit3,
  Save,
  X,
  Sparkles,
  Star,
  Clock3,
  BookOpen,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    username: "",
    bio: "",
    skillsToTeach: [],
    skillsToLearn: [],
  });

  const [teachInput, setTeachInput] = useState("");
  const [learnInput, setLearnInput] = useState("");

  // =====================================================
  // IMAGE URL HELPER
  // =====================================================

  const getImageUrl = (picture) => {
    if (!picture) return "";

    if (
      picture.startsWith("http://") ||
      picture.startsWith("https://") ||
      picture.startsWith("data:")
    ) {
      return picture;
    }

    try {
      return new URL(
        picture,
        api.defaults?.baseURL || window.location.origin
      ).href;
    } catch {
      return picture;
    }
  };

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users/profile");

      const currentUser = response.data.user || response.data;

      setProfile(currentUser);

      setForm({
        name: currentUser.name || "",
        username: currentUser.username || "",
        bio: currentUser.bio || "",
        skillsToTeach: currentUser.skillsToTeach || [],
        skillsToLearn: currentUser.skillsToLearn || [],
      });
    } catch (error) {
      console.error("Failed to load profile:", error);

      if (user) {
        setProfile(user);

        setForm({
          name: user.name || "",
          username: user.username || "",
          bio: user.bio || "",
          skillsToTeach: user.skillsToTeach || [],
          skillsToLearn: user.skillsToLearn || [],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORM
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // ADD TEACH SKILL
  // =====================================================

  const addTeachSkill = () => {
    const skill = teachInput.trim();

    if (!skill) return;

    const exists = form.skillsToTeach.some(
      (item) => item.toLowerCase() === skill.toLowerCase()
    );

    if (!exists) {
      setForm((previous) => ({
        ...previous,
        skillsToTeach: [...previous.skillsToTeach, skill],
      }));
    }

    setTeachInput("");
  };

  // =====================================================
  // ADD LEARN SKILL
  // =====================================================

  const addLearnSkill = () => {
    const skill = learnInput.trim();

    if (!skill) return;

    const exists = form.skillsToLearn.some(
      (item) => item.toLowerCase() === skill.toLowerCase()
    );

    if (!exists) {
      setForm((previous) => ({
        ...previous,
        skillsToLearn: [...previous.skillsToLearn, skill],
      }));
    }

    setLearnInput("");
  };

  // =====================================================
  // REMOVE SKILLS
  // =====================================================

  const removeTeachSkill = (skill) => {
    setForm((previous) => ({
      ...previous,
      skillsToTeach: previous.skillsToTeach.filter(
        (item) => item !== skill
      ),
    }));
  };

  const removeLearnSkill = (skill) => {
    setForm((previous) => ({
      ...previous,
      skillsToLearn: previous.skillsToLearn.filter(
        (item) => item !== skill
      ),
    }));
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const saveProfile = async () => {
    try {
      setSaving(true);

      const response = await api.put("/users/profile", form);

      const updatedUser = response.data.user || response.data;

      setProfile((previous) => ({
        ...previous,
        ...updatedUser,
      }));

      setEditing(false);

      await fetchProfile();
    } catch (error) {
      console.error("Failed to update profile:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("profilePicture", file);

      const response = await api.post(
        "/users/profile/picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedPicture = response.data.profilePicture;

      setProfile((previous) => ({
        ...previous,
        profilePicture: updatedPicture,
      }));

      await fetchProfile();
    } catch (error) {
      console.error(
        "Profile image upload failed:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to upload profile picture"
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =====================================================
  // INITIALS
  // =====================================================

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U"
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="page-background min-h-screen">
        <Navbar />

        <main className="mx-auto max-w-[1100px] px-5 py-10 lg:px-8">
          <div className="animate-pulse">

            <div className="h-3 w-40 rounded bg-[var(--surface-soft)]" />

            <div className="mt-3 h-9 w-48 rounded bg-[var(--surface-soft)]" />

            <div className="mt-2 h-4 w-96 max-w-full rounded bg-[var(--surface-soft)]" />

            <div className="mt-8 overflow-hidden rounded-[28px] border border-[var(--border-light)] bg-[var(--card)]">

              <div className="h-48 bg-[var(--lavender-soft)]" />

              <div className="p-8">
                <div className="h-24 w-24 rounded-[27px] bg-[var(--pink-soft)]" />

                <div className="mt-5 h-5 w-40 rounded bg-[var(--surface-soft)]" />
              </div>

            </div>
          </div>
        </main>
      </div>
    );
  }

  const credits = profile?.credits ?? 0;
  const earned = profile?.totalCreditsEarned ?? 0;
  const spent = profile?.totalCreditsSpent ?? 0;

  const profileImage = getImageUrl(profile?.profilePicture);

  return (
    <div className="page-background min-h-screen">

      <Navbar />

      <main className="mx-auto max-w-[1100px] px-5 py-8 lg:px-8 lg:py-10">

        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <div className="mb-7">

          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--purple-strong)]">
            Your TimeSwap identity
          </p>

          <h1 className="mt-1 text-[30px] font-bold tracking-[-0.045em] text-[var(--text)]">
            My profile
          </h1>

          <p className="mt-2 max-w-xl text-[11px] leading-5 text-[var(--text-secondary)]">
            Show people what you can teach, what you want
            to learn, and how many TimeSwap credits you've
            earned.
          </p>

        </div>

        {/* =================================================
            MAIN PROFILE
        ================================================= */}

        <section className="overflow-hidden rounded-[30px] border border-[var(--border-light)] bg-[var(--card)] shadow-[var(--shadow-md)]">

          {/* =================================================
              PROFILE HEADER
          ================================================= */}

          <div className="border-b border-[var(--border-light)] bg-[var(--lavender-soft)] px-6 py-9 sm:px-10">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              {/* USER */}

              <div className="flex items-center gap-5">

                {/* AVATAR */}

                <div className="relative">

                  {profileImage ? (

                    <img
                      src={profileImage}
                      alt="Profile"
                      className="h-24 w-24 rounded-[27px] border-2 border-[var(--surface)] object-cover shadow-[var(--shadow-md)]"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling.style.display =
                          "flex";
                      }}
                    />

                  ) : null}

                  <div
                    className={`${
                      profileImage ? "hidden" : "flex"
                    } h-24 w-24 items-center justify-center rounded-[27px] border-2 border-[var(--surface)] bg-[var(--pink-soft)] text-2xl font-bold text-[var(--pink-strong)] shadow-[var(--shadow-md)]`}
                  >
                    {getInitials(profile?.name)}
                  </div>

                  {/* CAMERA */}

                  <button
                    type="button"
                    onClick={handleImageClick}
                    disabled={uploading}
                    aria-label="Change profile picture"
                    className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-4 border-[var(--lavender-soft)] bg-[var(--purple-strong)] text-white shadow-[var(--shadow-sm)] transition-all duration-200 hover:scale-110 hover:bg-[var(--pink-strong)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploading ? (
                      <span className="text-[9px]">
                        ...
                      </span>
                    ) : (
                      <Camera size={14} />
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </div>

                {/* USER INFO */}

                <div>

                  <h2 className="text-[23px] font-bold tracking-[-0.04em] text-[var(--text)]">
                    {profile?.name || "Your name"}
                  </h2>

                  <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
                    @{profile?.username || "username"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--lavender)] bg-[var(--surface)] px-3 py-1.5 text-[9px] font-semibold text-[var(--purple-strong)]">
                      <Sparkles size={11} />
                      TimeSwap member
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--pink)] bg-[var(--pink-soft)] px-3 py-1.5 text-[9px] font-semibold text-[var(--pink-strong)]">
                      <Star size={11} />
                      {profile?.rating || "New"}
                    </span>

                  </div>

                </div>

              </div>

              {/* EDIT BUTTON */}

              {!editing ? (

                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--purple-strong)] px-5 py-3 text-[10px] font-bold text-white shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--pink-strong)] hover:shadow-[var(--shadow-md)]"
                >
                  <Edit3 size={13} />
                  Edit profile
                </button>

              ) : (

                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      fetchProfile();
                    }}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-[10px] font-semibold text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
                  >
                    <X size={13} />
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveProfile}
                    disabled={saving}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--pink-strong)] px-5 py-2.5 text-[10px] font-bold text-white transition hover:bg-[var(--purple-strong)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save size={13} />
                    {saving ? "Saving..." : "Save"}
                  </button>

                </div>

              )}

            </div>

          </div>

          {/* =================================================
              CREDIT CARDS
          ================================================= */}

          <div className="grid grid-cols-1 gap-4 border-b border-[var(--border-light)] bg-[var(--surface)] p-5 sm:grid-cols-3">

            {/* AVAILABLE */}

            <CreditCard
              icon={<Clock3 size={17} />}
              label="Available credits"
              value={credits}
              description="Ready to spend"
              cardClass="bg-[var(--lavender-soft)] border-[var(--lavender)]"
              iconClass="bg-[var(--lavender)] text-[var(--purple-strong)]"
            />

            {/* EARNED */}

            <CreditCard
              icon={<GraduationCap size={17} />}
              label="Credits earned"
              value={earned}
              description="From teaching"
              cardClass="bg-[var(--peach-soft)] border-[var(--peach)]"
              iconClass="bg-[var(--peach)] text-[var(--peach-dark)]"
            />

            {/* SPENT */}

            <CreditCard
              icon={<BookOpen size={17} />}
              label="Credits spent"
              value={spent}
              description="On learning"
              cardClass="bg-[var(--blue-soft)] border-[var(--blue)]"
              iconClass="bg-[var(--blue)] text-[var(--text)]"
            />

          </div>

          {/* =================================================
              DETAILS
          ================================================= */}

          <div className="grid gap-8 bg-[var(--surface)] p-6 sm:p-10 lg:grid-cols-2">

            {/* =================================================
                ABOUT
            ================================================= */}

            <div>

              <SectionTitle
                title="About you"
                accent="pink"
              />

              {editing ? (

                <div className="rounded-[22px] border border-[var(--pink)] bg-[var(--pink-soft)] p-5">

                  <div className="space-y-4">

                    <Input
                      label="Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />

                    <Input
                      label="Username"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                    />

                    <div>

                      <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--pink-strong)]">
                        Bio
                      </label>

                      <textarea
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell people a little about yourself..."
                        className="w-full resize-none rounded-[16px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[11px] text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--pink-strong)]"
                      />

                    </div>

                  </div>

                </div>

              ) : (

                <div className="rounded-[22px] border border-[var(--pink)] bg-[var(--pink-soft)] p-6 shadow-[var(--shadow-sm)]">

                  <p className="text-[11px] leading-6 text-[var(--text-secondary)]">
                    {profile?.bio ||
                      "You haven't added a bio yet. Tell the TimeSwap community a little about yourself."}
                  </p>

                </div>

              )}

            </div>

            {/* =================================================
                SKILLS
            ================================================= */}

            <div>

              <SectionTitle
                title="Skill exchange"
                accent="purple"
              />

              {/* CAN TEACH */}

              <div className="rounded-[22px] border border-[var(--lavender)] bg-[var(--lavender-soft)] p-5">

                <SkillGroup
                  title="I can teach"
                  icon={<GraduationCap size={14} />}
                  skills={
                    editing
                      ? form.skillsToTeach
                      : profile?.skillsToTeach || []
                  }
                  editing={editing}
                  inputValue={teachInput}
                  setInputValue={setTeachInput}
                  onAdd={addTeachSkill}
                  onRemove={removeTeachSkill}
                />

              </div>

              {/* WANT TO LEARN */}

              <div className="mt-5 rounded-[22px] border border-[var(--blue)] bg-[var(--blue-soft)] p-5">

                <SkillGroup
                  title="I want to learn"
                  icon={<BookOpen size={14} />}
                  skills={
                    editing
                      ? form.skillsToLearn
                      : profile?.skillsToLearn || []
                  }
                  editing={editing}
                  inputValue={learnInput}
                  setInputValue={setLearnInput}
                  onAdd={addLearnSkill}
                  onRemove={removeLearnSkill}
                />

              </div>

            </div>

          </div>

          {/* =================================================
              FOOTER STATS
          ================================================= */}

          <div className="border-t border-[var(--border-light)] bg-[var(--mint-soft)] px-6 py-7 sm:px-10">

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">

              <Stat
                label="Completed swaps"
                value={profile?.totalSwaps || 0}
              />

              <Stat
                label="Rating"
                value={
                  profile?.rating
                    ? `${profile.rating} ★`
                    : "New"
                }
              />

              <Stat
                label="Available credits"
                value={credits}
              />

            </div>

          </div>

        </section>

        {/* =================================================
            LOGOUT
        ================================================= */}

        <div className="mt-6 flex justify-end">

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-[10px] font-semibold text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--pink)] hover:bg-[var(--pink-soft)] hover:text-[var(--pink-strong)]"
          >
            <LogOut size={13} />
            Logout
          </button>

        </div>

      </main>
    </div>
  );
}

// =====================================================
// SECTION TITLE
// =====================================================

function SectionTitle({ title, accent = "purple" }) {
  const accentClass =
    accent === "pink"
      ? "text-[var(--pink-strong)]"
      : "text-[var(--purple-strong)]";

  return (
    <h3
      className={`mb-4 text-[14px] font-bold tracking-[-0.02em] ${accentClass}`}
    >
      {title}
    </h3>
  );
}

// =====================================================
// INPUT
// =====================================================

function Input({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div>

      <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-4 text-[11px] text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--pink-strong)]"
      />

    </div>
  );
}

// =====================================================
// SKILL GROUP
// =====================================================

function SkillGroup({
  title,
  icon,
  skills,
  editing,
  inputValue,
  setInputValue,
  onAdd,
  onRemove,
}) {
  return (
    <div>

      <div className="mb-4 flex items-center gap-2">

        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--purple-strong)] shadow-[var(--shadow-sm)]">
          {icon}
        </div>

        <span className="text-[10px] font-bold text-[var(--text)]">
          {title}
        </span>

      </div>

      <div className="flex flex-wrap gap-2">

        {skills?.length > 0 ? (

          skills.map((skill) => (

            <span
              key={skill}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--surface)] px-3 py-2 text-[9px] font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-sm)]"
            >

              {skill}

              {editing && (
                <button
                  type="button"
                  onClick={() => onRemove(skill)}
                  className="cursor-pointer text-[var(--text-muted)] transition hover:text-[var(--pink-strong)]"
                >
                  <X size={11} />
                </button>
              )}

            </span>

          ))

        ) : (

          <span className="text-[10px] text-[var(--text-muted)]">
            No skills added yet.
          </span>

        )}

      </div>

      {editing && (

        <div className="mt-4 flex gap-2">

          <input
            value={inputValue}
            onChange={(e) =>
              setInputValue(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAdd();
              }
            }}
            placeholder="Add a skill..."
            className="h-10 min-w-0 flex-1 rounded-[13px] border border-[var(--border)] bg-[var(--surface)] px-3 text-[10px] text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--purple-strong)]"
          />

          <button
            type="button"
            onClick={onAdd}
            className="cursor-pointer rounded-[13px] bg-[var(--purple-strong)] px-4 text-[10px] font-bold text-white transition hover:bg-[var(--pink-strong)]"
          >
            Add
          </button>

        </div>

      )}

    </div>
  );
}

// =====================================================
// CREDIT CARD
// =====================================================

function CreditCard({
  icon,
  label,
  value,
  description,
  cardClass,
  iconClass,
}) {
  return (
    <div
      className={`rounded-[22px] border p-5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] ${cardClass}`}
    >

      <div className="flex items-center justify-between">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <span className="text-[28px] font-bold tracking-[-0.05em] text-[var(--text)]">
          {value}
        </span>

      </div>

      <p className="mt-4 text-[10px] font-bold text-[var(--text)]">
        {label}
      </p>

      <p className="mt-1 text-[8px] text-[var(--text-secondary)]">
        {description}
      </p>

    </div>
  );
}

// =====================================================
// STAT
// =====================================================

function Stat({ label, value }) {
  return (
    <div>

      <p className="text-[20px] font-bold tracking-[-0.03em] text-[var(--text)]">
        {value}
      </p>

      <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
        {label}
      </p>

    </div>
  );
}

export default Profile;
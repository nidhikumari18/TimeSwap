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
  Heart,
  Zap,
  Users,
  Repeat2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import SkillCard from "../components/SkillCard";

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
  // IMAGE URL
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

      const currentUser =
        response.data.user || response.data;

      setProfile(currentUser);

      setForm({
        name: currentUser.name || "",
        username: currentUser.username || "",
        bio: currentUser.bio || "",
        skillsToTeach:
          currentUser.skillsToTeach || [],
        skillsToLearn:
          currentUser.skillsToLearn || [],
      });
    } catch (error) {
      console.error(
        "Failed to load profile:",
        error
      );

      if (user) {
        setProfile(user);

        setForm({
          name: user.name || "",
          username: user.username || "",
          bio: user.bio || "",
          skillsToTeach:
            user.skillsToTeach || [],
          skillsToLearn:
            user.skillsToLearn || [],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORM CHANGE
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
      (item) =>
        item.toLowerCase() ===
        skill.toLowerCase()
    );

    if (!exists) {
      setForm((previous) => ({
        ...previous,
        skillsToTeach: [
          ...previous.skillsToTeach,
          skill,
        ],
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
      (item) =>
        item.toLowerCase() ===
        skill.toLowerCase()
    );

    if (!exists) {
      setForm((previous) => ({
        ...previous,
        skillsToLearn: [
          ...previous.skillsToLearn,
          skill,
        ],
      }));
    }

    setLearnInput("");
  };

  // =====================================================
  // REMOVE TEACH SKILL
  // =====================================================

  const removeTeachSkill = (skill) => {
    setForm((previous) => ({
      ...previous,
      skillsToTeach:
        previous.skillsToTeach.filter(
          (item) => item !== skill
        ),
    }));
  };

  // =====================================================
  // REMOVE LEARN SKILL
  // =====================================================

  const removeLearnSkill = (skill) => {
    setForm((previous) => ({
      ...previous,
      skillsToLearn:
        previous.skillsToLearn.filter(
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

      const response = await api.put(
        "/users/profile",
        form
      );

      const updatedUser =
        response.data.user ||
        response.data;

      setProfile((previous) => ({
        ...previous,
        ...updatedUser,
      }));

      setEditing(false);

      await fetchProfile();
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error
      );

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

      formData.append(
        "profilePicture",
        file
      );

      const response = await api.post(
        "/users/profile/picture",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      const updatedPicture =
        response.data.profilePicture;

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
      <div className="min-h-screen bg-[#160f1c] text-white">
        <main className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">

          <div className="animate-pulse">

            <div className="h-7 w-44 rounded-xl bg-[#2b192f]" />

            <div className="mt-2 h-3 w-72 rounded bg-[#251624]" />

            <div className="mt-5 h-52 rounded-[28px] bg-[#26152c]" />

            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">

              <div className="h-28 rounded-[22px] bg-[#2b192f]" />
              <div className="h-28 rounded-[22px] bg-[#2b192f]" />
              <div className="h-28 rounded-[22px] bg-[#2b192f]" />
              <div className="h-28 rounded-[22px] bg-[#2b192f]" />

            </div>

          </div>

        </main>
      </div>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const credits = profile?.credits ?? 0;
  const earned =
    profile?.totalCreditsEarned ?? 0;
  const spent =
    profile?.totalCreditsSpent ?? 0;

  const teachSkills =
    profile?.skillsToTeach || [];

  const learnSkills =
    profile?.skillsToLearn || [];

  const profileImage = getImageUrl(
    profile?.profilePicture
  );

  const rating = profile?.rating
    ? Number(profile.rating).toFixed(1)
    : "New";

  const totalSwaps =
    profile?.totalSwaps || 0;

  const connections =
    profile?.connections || 0;

  const profileProgress =
    teachSkills.length &&
    learnSkills.length
      ? 90
      : teachSkills.length ||
        learnSkills.length
      ? 65
      : 30;

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#160f1c] text-[#fff9fc]">

      <main className="mx-auto max-w-[1180px] px-4 py-5 sm:px-6 lg:px-8">

        {/* TOP TITLE */}

        <div className="mb-4 flex items-end justify-between gap-4">

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#F599C6]">
              Your TimeSwap identity
            </p>

            <h1 className="mt-1 text-[30px] font-extrabold tracking-[-0.05em] text-white sm:text-[34px]">

              My profile

              <span className="ml-2 text-[#FFBEFB]">
                <Sparkles
                  size={20}
                  className="inline"
                />
              </span>

            </h1>

            <p className="mt-1 max-w-xl text-[10px] leading-5 text-[#bdaabd]">
              Show people what you can teach,
              what you want to learn, and your
              TimeSwap journey.
            </p>

          </div>

          <div className="hidden text-right sm:block">

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8f728f]">
              Profile progress
            </p>

            <p className="mt-1 text-[18px] font-extrabold text-[#FFEA88]">
              {profileProgress}%
            </p>

          </div>

        </div>

        {/* PROFILE HERO */}

        <section className="relative overflow-hidden rounded-[28px] border border-[#4a2946] bg-[#21131f] shadow-[0_18px_50px_rgba(0,0,0,0.38)]">

          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#CC3A63] opacity-20 blur-3xl" />

          <div className="absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-[#FFBEFB] opacity-10 blur-3xl" />

          <div className="relative grid lg:grid-cols-[1fr_260px]">

            {/* USER */}

            <div className="p-5 sm:p-7">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                {/* USER INFO */}

                <div className="flex items-center gap-4">

                  {/* AVATAR */}

                  <div className="relative shrink-0">

                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="h-[88px] w-[88px] rounded-[25px] border-2 border-[#7d405d] object-cover shadow-[0_12px_25px_rgba(0,0,0,0.35)]"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";

                          if (
                            e.currentTarget
                              .nextElementSibling
                          ) {
                            e.currentTarget.nextElementSibling.style.display =
                              "flex";
                          }
                        }}
                      />
                    ) : null}

                    <div
                      className={`${
                        profileImage
                          ? "hidden"
                          : "flex"
                      } h-[88px] w-[88px] items-center justify-center rounded-[25px] border-2 border-[#7d405d] bg-[#63283f] text-2xl font-extrabold text-[#F599C6] shadow-[0_12px_25px_rgba(0,0,0,0.35)]`}
                    >
                      {getInitials(profile?.name)}
                    </div>

                    {/* CAMERA */}

                    <button
                      type="button"
                      onClick={handleImageClick}
                      disabled={uploading}
                      className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#21131f] bg-[#CC3A63] text-white shadow-lg transition hover:scale-110 hover:bg-[#e04b73] disabled:opacity-50"
                    >
                      {uploading ? (
                        <span className="text-[8px]">
                          ...
                        </span>
                      ) : (
                        <Camera size={13} />
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

                  {/* INFO */}

                  <div className="min-w-0">

                    <h2 className="truncate text-[22px] font-extrabold tracking-[-0.04em] text-white">
                      {profile?.name ||
                        "Your name"}
                    </h2>

                    <p className="mt-0.5 text-[10px] text-[#bdaabd]">
                      @{profile?.username ||
                        "username"}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-1.5">

                      <span className="inline-flex items-center gap-1 rounded-full border border-[#684158] bg-[#39202f] px-2.5 py-1.5 text-[8px] font-bold text-[#FFBEFB]">
                        <Sparkles size={10} />
                        TimeSwap member
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-full border border-[#75404c] bg-[#4b222e] px-2.5 py-1.5 text-[8px] font-bold text-[#F599C6]">
                        <Star size={10} />
                        {rating}
                      </span>

                    </div>

                  </div>

                </div>

                {/* EDIT BUTTON */}

                {!editing ? (

                  <button
                    type="button"
                    onClick={() =>
                      setEditing(true)
                    }
                    className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#CC3A63] px-4 py-2.5 text-[9px] font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#e04b73]"
                  >
                    <Edit3 size={12} />
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
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#4c3048] bg-[#2c1a29] px-3.5 py-2.5 text-[9px] font-semibold text-[#d5bfd7]"
                    >
                      <X size={12} />
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={saveProfile}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#CC3A63] px-4 py-2.5 text-[9px] font-bold text-white transition hover:bg-[#e04b73] disabled:opacity-50"
                    >
                      <Save size={12} />
                      {saving
                        ? "Saving..."
                        : "Save"}
                    </button>

                  </div>

                )}

              </div>

              {/* PROGRESS */}

              <div className="mt-5">

                <div className="mb-1.5 flex items-center justify-between">

                  <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#8f728f]">
                    TimeSwap journey
                  </span>

                  <span className="text-[8px] font-bold text-[#FFEA88]">
                    {profileProgress}%
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#35202f]">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#CC3A63] via-[#F599C6] to-[#FFEA88]"
                    style={{
                      width: `${profileProgress}%`,
                    }}
                  />

                </div>

              </div>

            </div>

            {/* CUTE CHARACTER */}

            <div className="relative flex min-h-[145px] items-center justify-center overflow-hidden bg-[#2a1728]">

              <div className="absolute right-[-35px] top-[-30px] h-32 w-32 rounded-full bg-[#CC3A63] opacity-20 blur-2xl" />

              <div className="relative">

                <div className="absolute -left-9 top-5 rotate-[-15deg] text-[#FFEA88]">
                  <Sparkles size={18} />
                </div>

                <div className="absolute -right-8 top-7 rotate-[15deg] text-[#FFBEFB]">
                  <Sparkles size={13} />
                </div>

                <div className="relative flex h-[105px] w-[105px] rotate-[-4deg] items-center justify-center rounded-[38%] border-4 border-[#a94f68] bg-[#F599C6] shadow-[0_15px_30px_rgba(0,0,0,0.35)]">

                  <div className="absolute left-4 top-3 h-5 w-5 rounded-full bg-white/30" />

                  <div className="absolute left-[28px] top-[40px] h-2.5 w-2.5 rounded-full bg-[#3a1b2d]" />

                  <div className="absolute right-[28px] top-[40px] h-2.5 w-2.5 rounded-full bg-[#3a1b2d]" />

                  <div className="absolute left-[17px] top-[53px] h-2 w-4 rounded-full bg-[#CC3A63]/35" />

                  <div className="absolute right-[17px] top-[53px] h-2 w-4 rounded-full bg-[#CC3A63]/35" />

                  <div className="absolute left-[45px] top-[55px] h-2 w-4 rounded-b-full border-b-2 border-[#71394a]" />

                  <div className="absolute -top-5 left-5 h-7 w-7 rounded-full bg-[#FFEA88]" />

                  <div className="absolute -top-4 right-5 h-6 w-6 rounded-full bg-[#FFEA88]" />

                  <Heart
                    size={18}
                    className="absolute bottom-5 text-[#fff9fc]"
                    fill="currentColor"
                  />

                </div>

                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#74404f] bg-[#3b202e] px-3 py-1.5 text-[8px] font-bold text-[#FFEA88] shadow-lg">
                  Keep learning
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* STATS */}

        <section className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <ColorStatCard
            icon={<Clock3 size={17} />}
            label="Credits"
            value={credits}
            bg="bg-[#632d48]"
            iconBg="bg-[#8b4262]"
            iconColor="text-[#F599C6]"
          />

          <ColorStatCard
            icon={<Repeat2 size={17} />}
            label="Completed swaps"
            value={totalSwaps}
            bg="bg-[#46315b]"
            iconBg="bg-[#65427e]"
            iconColor="text-[#FFBEFB]"
          />

          <ColorStatCard
            icon={<Users size={17} />}
            label="Connections"
            value={connections}
            bg="bg-[#245442]"
            iconBg="bg-[#34765d]"
            iconColor="text-[#7DCCAD]"
          />

          <ColorStatCard
            icon={<Star size={17} />}
            label="Your rating"
            value={rating}
            bg="bg-[#625426]"
            iconBg="bg-[#806e30]"
            iconColor="text-[#FFEA88]"
          />

        </section>

        {/* TIME CREDITS */}

        <section className="mt-3">

          <div className="mb-2 flex items-center justify-between">

            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#F599C6]">
                Your time currency
              </p>

              <h2 className="mt-0.5 text-[19px] font-extrabold tracking-[-0.04em] text-white">
                Time credits
              </h2>

            </div>

            <div className="rounded-full border border-[#493044] bg-[#291827] px-3 py-1.5 text-[8px] font-bold text-[#c9adca]">
              1 hour = 1 credit
            </div>

          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

            <DarkCreditCard
              icon={<Clock3 size={16} />}
              label="Available"
              value={credits}
              description="Ready to spend"
              bg="bg-[#46315b]"
              iconBg="bg-[#65427e]"
              iconColor="text-[#FFBEFB]"
            />

            <DarkCreditCard
              icon={<Zap size={16} />}
              label="Earned"
              value={earned}
              description="From teaching"
              bg="bg-[#5c4d24]"
              iconBg="bg-[#806d30]"
              iconColor="text-[#FFEA88]"
            />

            <DarkCreditCard
              icon={<BookOpen size={16} />}
              label="Spent"
              value={spent}
              description="On learning"
              bg="bg-[#632d48]"
              iconBg="bg-[#8b4262]"
              iconColor="text-[#F599C6]"
            />

          </div>

        </section>

        {/* MAIN CONTENT */}

        <section className="mt-3 grid gap-3 lg:grid-cols-[1fr_350px]">

          {/* ABOUT */}

          <div className="rounded-[24px] border border-[#472d42] bg-[#21141f] p-5 shadow-[0_10px_28px_rgba(0,0,0,0.25)]">

            <SectionTitle
              title="About you"
              accent="pink"
            />

            {editing ? (

              <div className="rounded-[19px] border border-[#71405a] bg-[#321b2a] p-4">

                <div className="space-y-3">

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

                    <label className="mb-1.5 block text-[8px] font-bold uppercase tracking-[0.15em] text-[#F599C6]">
                      Bio
                    </label>

                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell people a little about yourself..."
                      className="w-full resize-none rounded-[14px] border border-[#54354d] bg-[#21141f] px-3.5 py-3 text-[10px] text-white outline-none placeholder:text-[#806b83] focus:border-[#F599C6]"
                    />

                  </div>

                </div>

              </div>

            ) : (

              <div className="relative overflow-hidden rounded-[20px] border border-[#71405a] bg-[#321b2a] p-5">

                <div className="absolute right-4 top-4 text-[#F599C6] opacity-20">

                  <Heart
                    size={35}
                    fill="currentColor"
                  />

                </div>

                <p className="relative pr-8 text-[10px] leading-5 text-[#d2becd]">
                  {profile?.bio ||
                    "You haven't added a bio yet. Tell the TimeSwap community a little about yourself."}
                </p>

              </div>

            )}

          </div>

          {/* SKILLS */}

          <div className="rounded-[24px] border border-[#472d42] bg-[#21141f] p-5 shadow-[0_10px_28px_rgba(0,0,0,0.25)]">

            <div className="mb-3 flex items-center justify-between">

              <SectionTitle
                title="Skill exchange"
                accent="purple"
              />

              <span className="rounded-full bg-[#3e294b] px-2.5 py-1 text-[8px] font-bold text-[#FFBEFB]">
                {teachSkills.length +
                  learnSkills.length}{" "}
                skills
              </span>

            </div>

            <SkillCard
              title="I can teach"
              icon={<GraduationCap size={14} />}
              skills={
                editing
                  ? form.skillsToTeach
                  : teachSkills
              }
              editing={editing}
              inputValue={teachInput}
              setInputValue={setTeachInput}
              onAdd={addTeachSkill}
              onRemove={removeTeachSkill}
              variant="purple"
            />

            <div className="mt-3">

              <SkillCard
                title="I want to learn"
                icon={<BookOpen size={14} />}
                skills={
                  editing
                    ? form.skillsToLearn
                    : learnSkills
                }
                editing={editing}
                inputValue={learnInput}
                setInputValue={setLearnInput}
                onAdd={addLearnSkill}
                onRemove={removeLearnSkill}
                variant="blue"
              />

            </div>

          </div>

        </section>

        {/* MINI JOURNEY */}

        <section className="mt-3 grid gap-3 sm:grid-cols-3">

          <JourneyCard
            icon={<GraduationCap size={17} />}
            title="Keep growing"
            text="Add more skills to improve your matches."
            bg="bg-[#245442]"
            iconBg="bg-[#34765d]"
            iconColor="text-[#7DCCAD]"
          />

          <JourneyCard
            icon={<Clock3 size={17} />}
            title="Share your time"
            text="Teach someone and earn more credits."
            bg="bg-[#632d48]"
            iconBg="bg-[#8b4262]"
            iconColor="text-[#F599C6]"
          />

          <JourneyCard
            icon={<Users size={17} />}
            title="Meet people"
            text="Find curious people with skills to exchange."
            bg="bg-[#46315b]"
            iconBg="bg-[#65427e]"
            iconColor="text-[#FFBEFB]"
          />

        </section>

        {/* LOGOUT */}

        <div className="mt-3 flex justify-end">

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-[#4a3046] bg-[#21141f] px-4 py-2.5 text-[9px] font-semibold text-[#a993a9] transition hover:border-[#CC3A63] hover:bg-[#321b2a] hover:text-[#F599C6]"
          >
            <LogOut size={12} />
            Logout
          </button>

        </div>

      </main>
    </div>
  );
}

// =====================================================
// COLOR STAT CARD
// =====================================================

function ColorStatCard({
  icon,
  label,
  value,
  bg,
  iconBg,
  iconColor,
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[21px] border border-white/10 ${bg} p-4 shadow-[0_10px_25px_rgba(0,0,0,0.25)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.35)]`}
    >

      <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/5" />

      <div className="relative flex items-start justify-between">

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-[12px] ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

        <Sparkles
          size={12}
          className="text-white/20 transition group-hover:text-white/50"
        />

      </div>

      <p className="relative mt-4 text-[8px] font-bold uppercase tracking-[0.15em] text-white/55">
        {label}
      </p>

      <p className="relative mt-0.5 text-[24px] font-extrabold tracking-[-0.05em] text-white">
        {value}
      </p>

    </div>
  );
}

// =====================================================
// DARK CREDIT CARD
// =====================================================

function DarkCreditCard({
  icon,
  label,
  value,
  description,
  bg,
  iconBg,
  iconColor,
}) {
  return (
    <div
      className={`rounded-[21px] border border-white/10 ${bg} p-4 shadow-[0_10px_25px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5`}
    >

      <div className="flex items-center gap-3">

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-[12px] ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

        <div>

          <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/55">
            {label}
          </p>

          <p className="text-[20px] font-extrabold text-white">
            {value}
          </p>

        </div>

      </div>

      <p className="mt-3 text-[8px] text-white/45">
        {description}
      </p>

    </div>
  );
}

// =====================================================
// JOURNEY CARD
// =====================================================

function JourneyCard({
  icon,
  title,
  text,
  bg,
  iconBg,
  iconColor,
}) {
  return (
    <div
      className={`rounded-[20px] border border-white/10 ${bg} p-4 transition hover:-translate-y-0.5`}
    >

      <div className="flex items-start gap-3">

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

        <div>

          <h3 className="text-[11px] font-bold text-white">
            {title}
          </h3>

          <p className="mt-1 text-[8px] leading-4 text-white/55">
            {text}
          </p>

        </div>

      </div>

    </div>
  );
}

// =====================================================
// SECTION TITLE
// =====================================================

function SectionTitle({
  title,
  accent = "purple",
}) {
  const accentClass =
    accent === "pink"
      ? "text-[#F599C6]"
      : "text-[#FFBEFB]";

  return (
    <h3
      className={`mb-3 text-[14px] font-extrabold tracking-[-0.03em] ${accentClass}`}
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

      <label className="mb-1.5 block text-[8px] font-bold uppercase tracking-[0.15em] text-[#a993a9]">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        className="h-10 w-full rounded-[13px] border border-[#54354d] bg-[#21141f] px-3.5 text-[10px] text-white outline-none placeholder:text-[#806b83] focus:border-[#F599C6]"
      />

    </div>
  );
}

export default Profile;
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Send,
  X,
  Users,
  Star,
  Heart,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Explore() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All");

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [skillTheyTeach, setSkillTheyTeach] = useState("");
  const [skillTheyWant, setSkillTheyWant] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  /* =========================================================
     LOAD USERS
  ========================================================= */

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users/explore");
      const peopleList = response.data.users || [];

      setUsers(
        Array.isArray(peopleList)
          ? peopleList.filter(
              (person) => person._id !== user?._id
            )
          : []
      );
    } catch (error) {
      console.error("Failed to load users:", error);

      try {
        const response = await api.get("/users");
        const peopleList = response.data.users || [];

        setUsers(
          Array.isArray(peopleList)
            ? peopleList.filter(
                (person) => person._id !== user?._id
              )
            : []
        );
      } catch (secondError) {
        console.error("Users fallback failed:", secondError);
        setUsers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     ALL SKILLS
  ========================================================= */

  const allSkills = useMemo(() => {
    const skills = new Set();

    users.forEach((person) => {
      person.skillsToTeach?.forEach((skill) => {
        if (skill) skills.add(skill);
      });

      person.skillsToLearn?.forEach((skill) => {
        if (skill) skills.add(skill);
      });
    });

    return ["All", ...Array.from(skills).sort()];
  }, [users]);

  /* =========================================================
     FILTER USERS
  ========================================================= */

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return users.filter((person) => {
      const name = person.name?.toLowerCase() || "";
      const username = person.username?.toLowerCase() || "";

      const teachSkills =
        person.skillsToTeach?.map((skill) =>
          skill.toLowerCase()
        ) || [];

      const learnSkills =
        person.skillsToLearn?.map((skill) =>
          skill.toLowerCase()
        ) || [];

      const matchesSearch =
        !query ||
        name.includes(query) ||
        username.includes(query) ||
        teachSkills.some((skill) =>
          skill.includes(query)
        ) ||
        learnSkills.some((skill) =>
          skill.includes(query)
        );

      const matchesSkill =
        selectedSkill === "All" ||
        person.skillsToTeach?.some(
          (skill) =>
            skill.toLowerCase() ===
            selectedSkill.toLowerCase()
        ) ||
        person.skillsToLearn?.some(
          (skill) =>
            skill.toLowerCase() ===
            selectedSkill.toLowerCase()
        );

      return matchesSearch && matchesSkill;
    });
  }, [users, search, selectedSkill]);

  /* =========================================================
     INITIALS
  ========================================================= */

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  /* =========================================================
     REQUEST MODAL
  ========================================================= */

  const openRequestModal = (person) => {
    setSelectedUser(person);

    setSkillTheyTeach(
      person.skillsToTeach?.[0] || ""
    );

    setSkillTheyWant(
      person.skillsToLearn?.[0] || ""
    );

    setMessage(
      `Hi ${
        person.name?.split(" ")[0] || ""
      }! I'd love to exchange skills with you.`
    );

    setShowRequestModal(true);
  };

  const closeRequestModal = () => {
    setShowRequestModal(false);
    setSelectedUser(null);
    setSkillTheyTeach("");
    setSkillTheyWant("");
    setMessage("");
  };

  /* =========================================================
     SEND REQUEST
  ========================================================= */

  const sendSwapRequest = async (e) => {
    e.preventDefault();

    if (!selectedUser?._id) return;

    if (!skillTheyTeach || !skillTheyWant) {
      alert("Please select both skills.");
      return;
    }

    try {
      setSending(true);

      await api.post("/swaps/request", {
        receiverId: selectedUser._id,
        skillTheyTeach,
        skillTheyWant,
        message,
      });

      alert("Swap request sent successfully ✨");

      closeRequestModal();
    } catch (error) {
      console.error(
        "Send request error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Could not send swap request."
      );
    } finally {
      setSending(false);
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="
        min-h-screen
        bg-[var(--background)]
        text-[var(--text)]
        transition-colors
        duration-300
      "
    >
      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          mx-auto
          max-w-[1380px]
          px-4
          pb-12
          pt-6
          sm:px-6
          lg:px-8
        "
      >
        {/* =====================================================
            HERO
        ===================================================== */}

        <section
          className="
            relative
            mb-6
            overflow-hidden
            rounded-[30px]
            border
            border-[var(--border)]
            bg-[var(--surface)]
            shadow-[var(--shadow-md)]
          "
        >
          {/* COLORFUL BACKGROUND SHAPES */}

          <div
            className="
              absolute
              -right-16
              -top-20
              h-64
              w-64
              rounded-full
              bg-[var(--pink)]
              opacity-60
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -bottom-20
              right-[28%]
              h-52
              w-52
              rounded-full
              bg-[var(--lavender)]
              opacity-60
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -left-16
              bottom-0
              h-40
              w-40
              rounded-full
              bg-[var(--mint)]
              opacity-50
              blur-3xl
            "
          />

          <div
            className="
              relative
              grid
              gap-8
              p-7
              sm:p-9
              lg:grid-cols-[1fr_230px]
              lg:p-11
            "
          >
            {/* LEFT */}

            <div>
              {/* LABEL */}

              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[var(--pink)]
                  bg-[var(--pink-soft)]
                  px-4
                  py-2
                "
              >
                <Sparkles
                  size={14}
                  className="text-[var(--pink-strong)]"
                />

                <span
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-[var(--pink-strong)]
                  "
                >
                  Discover your next exchange
                </span>
              </div>

              {/* HEADING */}

              <h1
                className="
                  max-w-[700px]
                  text-[36px]
                  font-extrabold
                  leading-[1.06]
                  tracking-[-0.055em]
                  sm:text-[48px]
                  lg:text-[56px]
                "
              >
                Find people who{" "}
                <span
                  className="
                    text-[var(--pink-strong)]
                  "
                >
                  know what you want to learn.
                </span>
              </h1>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-5
                  max-w-[600px]
                  text-[12px]
                  leading-6
                  text-[var(--text-secondary)]
                  sm:text-[13px]
                "
              >
                Discover people with interesting skills,
                exchange your time, and learn something
                new without spending money. ✨
              </p>
            </div>

            {/* RIGHT COLORFUL ICON */}

            <div
              className="
                hidden
                items-center
                justify-center
                lg:flex
              "
            >
              <div
                className="
                  relative
                  flex
                  h-40
                  w-40
                  items-center
                  justify-center
                  rounded-[38px]
                  bg-[var(--lavender)]
                  shadow-[var(--shadow-sm)]
                "
              >
                <div
                  className="
                    absolute
                    -right-3
                    -top-3
                    h-12
                    w-12
                    rounded-full
                    bg-[var(--yellow)]
                  "
                />

                <div
                  className="
                    absolute
                    -bottom-4
                    -left-4
                    h-14
                    w-14
                    rounded-full
                    bg-[var(--mint)]
                  "
                />

                <Sparkles
                  size={55}
                  strokeWidth={1.4}
                  className="
                    relative
                    text-[var(--purple-strong)]
                  "
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <section className="mb-7">
          <div
            className="
              flex
              min-h-[56px]
              items-center
              gap-3
              rounded-[19px]
              border
              border-[var(--border)]
              bg-[var(--surface)]
              px-4
              shadow-[var(--shadow-sm)]
              transition
              focus-within:border-[var(--pink-strong)]
              focus-within:shadow-[var(--shadow-md)]
            "
          >
            <Search
              size={18}
              className="shrink-0 text-[var(--text-muted)]"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search people, usernames or skills..."
              className="
                w-full
                bg-transparent
                text-[12px]
                text-[var(--text)]
                outline-none
                placeholder:text-[var(--text-muted)]
              "
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  bg-[var(--pink-soft)]
                  text-[var(--text-muted)]
                  transition
                  hover:bg-[var(--pink)]
                  hover:text-[var(--pink-strong)]
                "
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* SKILL FILTERS */}

          <div
            className="
              mt-4
              flex
              gap-2
              overflow-x-auto
              pb-1
            "
          >
            {allSkills
              .slice(0, 12)
              .map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() =>
                    setSelectedSkill(skill)
                  }
                  className={`
                    whitespace-nowrap
                    rounded-full
                    border
                    px-4
                    py-2
                    text-[9px]
                    font-bold
                    transition

                    ${
                      selectedSkill === skill
                        ? `
                          border-[var(--purple)]
                          bg-[var(--purple)]
                          text-white
                          shadow-[var(--shadow-sm)]
                        `
                        : `
                          border-[var(--border)]
                          bg-[var(--surface)]
                          text-[var(--text-secondary)]
                          hover:-translate-y-0.5
                          hover:border-[var(--pink)]
                          hover:bg-[var(--pink-soft)]
                          hover:text-[var(--pink-strong)]
                        `
                    }
                  `}
                >
                  {skill}
                </button>
              ))}
          </div>
        </section>

        {/* =====================================================
            COMMUNITY HEADER
        ===================================================== */}

        <section
          className="
            relative
            mb-5
            overflow-hidden
            rounded-[25px]
            border
            border-[var(--border)]
            bg-[var(--surface)]
            p-5
            shadow-[var(--shadow-sm)]
            sm:p-6
          "
        >
          {/* COLOR BLOB */}

          <div
            className="
              absolute
              -right-8
              -top-14
              h-32
              w-32
              rounded-full
              bg-[var(--yellow)]
              opacity-45
              blur-2xl
            "
          />

          <div
            className="
              absolute
              -bottom-10
              right-[35%]
              h-24
              w-24
              rounded-full
              bg-[var(--pink)]
              opacity-35
              blur-2xl
            "
          />

          <div
            className="
              relative
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <div className="flex items-center gap-4">
              {/* ICON */}

              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-[15px]
                  bg-[var(--lavender)]
                  text-[var(--purple-strong)]
                "
              >
                <Users size={20} />
              </div>

              <div>
                <p
                  className="
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-[var(--pink-strong)]
                  "
                >
                  TimeSwap community
                </p>

                <h2
                  className="
                    mt-1
                    text-[20px]
                    font-bold
                    tracking-[-0.04em]
                  "
                >
                  People to swap with
                </h2>
              </div>
            </div>

            {/* COUNT */}

            <div
              className="
                flex
                shrink-0
                items-center
                gap-2
                rounded-full
                border
                border-[var(--mint)]
                bg-[var(--mint-soft)]
                px-3
                py-2
                text-[9px]
                font-bold
                text-[var(--green-strong)]
              "
            >
              <Users size={13} />
              {filteredUsers.length}
            </div>
          </div>
        </section>

        {/* =====================================================
            USERS
        ===================================================== */}

        {loading ? (
          <LoadingGrid />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            search={search}
            clearSearch={() => {
              setSearch("");
              setSelectedSkill("All");
            }}
          />
        ) : (
          <div
            className="
              grid
              gap-5
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {filteredUsers.map((person, index) => (
              <UserCard
                key={person._id}
                person={person}
                index={index}
                getInitials={getInitials}
                onRequest={() =>
                  openRequestModal(person)
                }
                onMessage={() =>
                  navigate(
                    `/messages?user=${person._id}`
                  )
                }
              />
            ))}
          </div>
        )}
      </main>

      {/* =====================================================
          REQUEST MODAL
      ===================================================== */}

      {showRequestModal && selectedUser && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/60
            p-4
            backdrop-blur-sm
          "
        >
          <div
            className="
              max-h-[90vh]
              w-full
              max-w-lg
              overflow-y-auto
              rounded-[28px]
              border
              border-[var(--border)]
              bg-[var(--surface)]
              shadow-[var(--shadow-lg)]
            "
          >
            {/* MODAL HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-[var(--border-light)]
                px-6
                py-5
              "
            >
              <div>
                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-[var(--pink-strong)]
                  "
                >
                  TimeSwap connection
                </p>

                <h2
                  className="
                    mt-1
                    text-xl
                    font-bold
                  "
                >
                  Send swap request
                </h2>
              </div>

              <button
                type="button"
                onClick={closeRequestModal}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-[var(--pink-soft)]
                  text-[var(--text)]
                  transition
                  hover:bg-[var(--pink)]
                "
              >
                <X size={16} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={sendSwapRequest}
              className="space-y-5 p-6"
            >
              {/* USER */}

              <div
                className="
                  rounded-[20px]
                  border
                  border-[var(--border)]
                  bg-[var(--lavender-soft)]
                  p-4
                "
              >
                <div className="flex items-center gap-3">
                  {selectedUser.profilePicture ? (
                    <img
                      src={selectedUser.profilePicture}
                      alt=""
                      className="
                        h-12
                        w-12
                        rounded-[15px]
                        object-cover
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-[15px]
                        bg-[var(--purple)]
                        text-sm
                        font-bold
                        text-white
                      "
                    >
                      {getInitials(
                        selectedUser.name
                      )}
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-bold">
                      {selectedUser.name}
                    </p>

                    <p
                      className="
                        text-[10px]
                        text-[var(--text-muted)]
                      "
                    >
                      @{selectedUser.username}
                    </p>
                  </div>
                </div>
              </div>

              {/* TEACH */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-[var(--text-muted)]
                  "
                >
                  What they can teach you
                </label>

                <select
                  value={skillTheyTeach}
                  onChange={(e) =>
                    setSkillTheyTeach(
                      e.target.value
                    )
                  }
                  className="
                    h-12
                    w-full
                    rounded-[14px]
                    border
                    border-[var(--border)]
                    bg-[var(--surface-soft)]
                    px-3
                    text-[12px]
                    text-[var(--text)]
                    outline-none
                    focus:border-[var(--pink-strong)]
                  "
                  required
                >
                  <option value="">
                    Select a skill
                  </option>

                  {selectedUser.skillsToTeach?.map(
                    (skill) => (
                      <option
                        key={skill}
                        value={skill}
                      >
                        {skill}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* WANT */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-[var(--text-muted)]
                  "
                >
                  What you want to exchange
                </label>

                <select
                  value={skillTheyWant}
                  onChange={(e) =>
                    setSkillTheyWant(
                      e.target.value
                    )
                  }
                  className="
                    h-12
                    w-full
                    rounded-[14px]
                    border
                    border-[var(--border)]
                    bg-[var(--surface-soft)]
                    px-3
                    text-[12px]
                    text-[var(--text)]
                    outline-none
                    focus:border-[var(--pink-strong)]
                  "
                  required
                >
                  <option value="">
                    Select a skill
                  </option>

                  {selectedUser.skillsToLearn?.map(
                    (skill) => (
                      <option
                        key={skill}
                        value={skill}
                      >
                        {skill}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* MESSAGE */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-[var(--text-muted)]
                  "
                >
                  Message
                </label>

                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  rows={4}
                  placeholder="Write a short message..."
                  className="
                    w-full
                    resize-none
                    rounded-[14px]
                    border
                    border-[var(--border)]
                    bg-[var(--surface-soft)]
                    p-3
                    text-[12px]
                    text-[var(--text)]
                    outline-none
                    placeholder:text-[var(--text-muted)]
                    focus:border-[var(--pink-strong)]
                  "
                />
              </div>

              {/* SEND */}

              <button
                type="submit"
                disabled={sending}
                className="
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-[14px]
                  bg-[var(--purple)]
                  text-[11px]
                  font-bold
                  text-white
                  shadow-[var(--shadow-sm)]
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[var(--purple-strong)]
                  disabled:opacity-50
                "
              >
                {sending ? (
                  "Sending..."
                ) : (
                  <>
                    Send request
                    <Send size={15} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   USER CARD
========================================================= */

function UserCard({
  person,
  index,
  getInitials,
  onRequest,
  onMessage,
}) {
  const coverColors = [
    "bg-[var(--pink)]",
    "bg-[var(--lavender)]",
    "bg-[var(--mint)]",
    "bg-[var(--yellow)]",
    "bg-[var(--peach)]",
  ];

  const cover =
    coverColors[index % coverColors.length];

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-[var(--border)]
        bg-[var(--surface)]
        shadow-[var(--shadow-sm)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[var(--shadow-md)]
      "
    >
      {/* =================================================
          COLORFUL COVER
      ================================================= */}

      <div
        className={`
          relative
          h-[105px]
          overflow-hidden
          ${cover}
        `}
      >
        {/* DECORATIVE CIRCLES */}

        <div
          className="
            absolute
            -right-8
            -top-12
            h-32
            w-32
            rounded-full
            bg-white/30
            blur-sm
          "
        />

        <div
          className="
            absolute
            -bottom-10
            left-[35%]
            h-24
            w-24
            rounded-full
            bg-white/25
            blur-sm
          "
        />

        <div
          className="
            absolute
            left-8
            top-5
            h-3
            w-3
            rounded-full
            bg-white/60
          "
        />

        <div
          className="
            absolute
            left-14
            top-10
            h-2
            w-2
            rounded-full
            bg-white/50
          "
        />

        {/* AVAILABILITY */}

        <div
          className="
            absolute
            right-4
            top-4
            flex
            items-center
            gap-1.5
            rounded-full
            border
            border-white/50
            bg-white/85
            px-3
            py-1.5
            text-[8px]
            font-bold
            text-[#493d45]
            shadow-sm
            backdrop-blur
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-[var(--green)]
            "
          />

          Available
        </div>

        {/* PROFILE PHOTO */}

        <div
          className="
            absolute
            bottom-[-32px]
            left-5
            z-10
          "
        >
          <div
            className="
              flex
              h-[70px]
              w-[70px]
              items-center
              justify-center
              overflow-hidden
              rounded-[22px]
              border-[4px]
              border-[var(--surface)]
              bg-[var(--purple)]
              text-lg
              font-bold
              text-white
              shadow-[var(--shadow-md)]
            "
          >
            {person.profilePicture ? (
              <img
                src={person.profilePicture}
                alt=""
                className="
                  h-full
                  w-full
                  object-cover
                "
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />
            ) : (
              getInitials(person.name)
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          CARD CONTENT
      ================================================= */}

      <div className="p-5 pt-12">
        {/* NAME */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >
          <div className="min-w-0">
            <h3
              className="
                truncate
                text-[16px]
                font-bold
                tracking-[-0.025em]
              "
            >
              {person.name ||
                "TimeSwap member"}
            </h3>

            <p
              className="
                mt-1
                truncate
                text-[9px]
                text-[var(--text-muted)]
              "
            >
              @{person.username || "user"}
            </p>
          </div>

          {/* RATING */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-1
              rounded-full
              border
              border-[var(--yellow)]
              bg-[var(--yellow-soft)]
              px-2.5
              py-1.5
              text-[9px]
              font-bold
              text-[var(--yellow-dark)]
            "
          >
            <Star
              size={10}
              fill="currentColor"
            />

            {Number(
              person.rating || 0
            ).toFixed(1)}
          </div>
        </div>

        {/* BIO */}

        <p
          className="
            mt-3
            line-clamp-2
            min-h-[34px]
            text-[10px]
            leading-5
            text-[var(--text-secondary)]
          "
        >
          {person.bio ||
            "Ready to exchange knowledge, share skills and learn something new. ✨"}
        </p>

        {/* =================================================
            SKILL BOXES
        ================================================= */}

        <div
          className="
            mt-4
            grid
            grid-cols-2
            gap-3
          "
        >
          {/* CAN TEACH */}

          <div
            className="
              rounded-[19px]
              border
              border-[#efcfbf]
              bg-[var(--peach)]
              p-3
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-[11px]
                  bg-white/55
                  text-[#694941]
                "
              >
                <Heart size={13} />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[7px]
                    font-bold
                    uppercase
                    tracking-[0.08em]
                    text-[#694941]
                  "
                >
                  Can teach
                </p>

                <p
                  className="
                    mt-0.5
                    text-[8px]
                    text-[#76565e]
                  "
                >
                  {person.skillsToTeach?.length ||
                    0}{" "}
                  skills
                </p>
              </div>
            </div>

            <div
              className="
                mt-3
                flex
                flex-wrap
                gap-1
              "
            >
              {(person.skillsToTeach || [])
                .slice(0, 3)
                .map((skill) => (
                  <span
                    key={skill}
                    className="
                      rounded-full
                      bg-white/70
                      px-2
                      py-1
                      text-[7px]
                      font-semibold
                      text-[#5c4148]
                    "
                  >
                    {skill}
                  </span>
                ))}

              {(!person.skillsToTeach ||
                person.skillsToTeach.length ===
                  0) && (
                <span
                  className="
                    text-[8px]
                    text-[#76565e]
                  "
                >
                  No skills yet
                </span>
              )}
            </div>
          </div>

          {/* WANTS TO LEARN */}

          <div
            className="
              rounded-[19px]
              border
              border-[#c9ddca]
              bg-[var(--mint)]
              p-3
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-[11px]
                  bg-white/55
                  text-[#455e49]
                "
              >
                <BookOpen size={13} />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[7px]
                    font-bold
                    uppercase
                    tracking-[0.08em]
                    text-[#455e49]
                  "
                >
                  Wants to learn
                </p>

                <p
                  className="
                    mt-0.5
                    text-[8px]
                    text-[#59705d]
                  "
                >
                  {person.skillsToLearn?.length ||
                    0}{" "}
                  skills
                </p>
              </div>
            </div>

            <div
              className="
                mt-3
                flex
                flex-wrap
                gap-1
              "
            >
              {(person.skillsToLearn || [])
                .slice(0, 3)
                .map((skill) => (
                  <span
                    key={skill}
                    className="
                      rounded-full
                      bg-white/70
                      px-2
                      py-1
                      text-[7px]
                      font-semibold
                      text-[#455e49]
                    "
                  >
                    {skill}
                  </span>
                ))}

              {(!person.skillsToLearn ||
                person.skillsToLearn.length ===
                  0) && (
                <span
                  className="
                    text-[8px]
                    text-[#59705d]
                  "
                >
                  No skills yet
                </span>
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div
          className="
            mt-4
            grid
            grid-cols-[1fr_43px]
            gap-2
          "
        >
          {/* REQUEST */}

          <button
            type="button"
            onClick={onRequest}
            className="
              group/button
              flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-[13px]
              bg-[var(--purple)]
              px-3
              text-[9px]
              font-bold
              text-white
              shadow-[var(--shadow-sm)]
              transition
              hover:-translate-y-0.5
              hover:bg-[var(--purple-strong)]
              hover:shadow-[var(--shadow-md)]
            "
          >
            Request swap

            <ArrowRight
              size={12}
              className="
                transition
                group-hover/button:translate-x-1
              "
            />
          </button>

          {/* MESSAGE */}

          <button
            type="button"
            onClick={onMessage}
            title="Message"
            className="
              flex
              h-10
              w-[43px]
              items-center
              justify-center
              rounded-[13px]
              border
              border-[var(--border)]
              bg-[var(--surface-soft)]
              text-[var(--text)]
              transition
              hover:-translate-y-0.5
              hover:border-[var(--pink)]
              hover:bg-[var(--pink-soft)]
              hover:text-[var(--pink-strong)]
            "
          >
            <MessageCircle size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   LOADING
========================================================= */

function LoadingGrid() {
  return (
    <div
      className="
        grid
        gap-5
        sm:grid-cols-2
        xl:grid-cols-3
      "
    >
      {[1, 2, 3, 4, 5, 6].map(
        (item) => (
          <div
            key={item}
            className="
              overflow-hidden
              rounded-[28px]
              border
              border-[var(--border)]
              bg-[var(--surface)]
            "
          >
            <div
              className="
                h-[105px]
                animate-pulse
                bg-[var(--pink-soft)]
              "
            />

            <div
              className="
                space-y-4
                p-5
                pt-12
              "
            >
              <div
                className="
                  h-5
                  w-32
                  animate-pulse
                  rounded
                  bg-[var(--pink-soft)]
                "
              />

              <div
                className="
                  h-3
                  w-24
                  animate-pulse
                  rounded
                  bg-[var(--pink-soft)]
                "
              />

              <div
                className="
                  h-8
                  w-full
                  animate-pulse
                  rounded
                  bg-[var(--pink-soft)]
                "
              />

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                "
              >
                <div
                  className="
                    h-24
                    animate-pulse
                    rounded-[20px]
                    bg-[var(--peach-soft)]
                  "
                />

                <div
                  className="
                    h-24
                    animate-pulse
                    rounded-[20px]
                    bg-[var(--mint-soft)]
                  "
                />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  search,
  clearSearch,
}) {
  return (
    <div
      className="
        overflow-hidden
        rounded-[28px]
        border
        border-[var(--border)]
        bg-[var(--surface)]
        px-6
        py-20
        text-center
        shadow-[var(--shadow-sm)]
      "
    >
      <div
        className="
          mx-auto
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-[22px]
          bg-[var(--pink-soft)]
          text-[var(--pink-strong)]
        "
      >
        <Search size={25} />
      </div>

      <h3
        className="
          mt-5
          text-xl
          font-bold
        "
      >
        No matches found
      </h3>

      <p
        className="
          mx-auto
          mt-2
          max-w-sm
          text-[11px]
          leading-6
          text-[var(--text-secondary)]
        "
      >
        {search
          ? `We couldn't find anyone matching "${search}".`
          : "There aren't any people matching this filter yet."}
      </p>

      <button
        type="button"
        onClick={clearSearch}
        className="
          mt-6
          rounded-[13px]
          bg-[var(--purple)]
          px-5
          py-3
          text-[10px]
          font-bold
          text-white
          transition
          hover:bg-[var(--purple-strong)]
        "
      >
        Clear filters
      </button>
    </div>
  );
}

export default Explore;
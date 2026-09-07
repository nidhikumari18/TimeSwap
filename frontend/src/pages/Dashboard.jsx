import { useEffect, useState } from "react";

import {
  ArrowRight,
  BookOpen,
  Coins,
  Heart,
  MessageCircle,
  Repeat2,
  Sparkles,
  Star,
  Users,
  Zap,
  Plus,
  Compass,
  Clock3,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";


function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    activeSwaps: 0,
    completedSwaps: 0,
    peopleConnected: 0,
  });

  const [loading, setLoading] = useState(true);


  /* =========================================================
     LOAD DASHBOARD DATA
  ========================================================= */

  useEffect(() => {
    if (!user?._id) return;

    loadDashboard();
  }, [user?._id]);


  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get("/swaps/request/status");

      const requests = response.data.requests || [];

      const accepted = requests.filter(
        (request) => request.status === "accepted"
      );

      setStats({
        activeSwaps: accepted.length,
        completedSwaps: 0,

        peopleConnected: new Set(
          accepted.flatMap((request) => [
            request.sender?._id,
            request.receiver?._id,
          ])
        ).size,
      });

    } catch (error) {
      console.error("Dashboard loading error:", error);

    } finally {
      setLoading(false);
    }
  };


  /* =========================================================
     USER DATA
  ========================================================= */

  const firstName =
    user?.name?.split(" ")[0] || "there";

  const credits = user?.credits ?? 0;
  const earned = user?.totalCreditsEarned ?? 0;
  const spent = user?.totalCreditsSpent ?? 0;

  const teachSkills =
    user?.skillsToTeach || [];

  const learnSkills =
    user?.skillsToLearn || [];


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
     PROFILE PROGRESS
  ========================================================= */

  const profileProgress =
    teachSkills.length && learnSkills.length
      ? "85%"
      : teachSkills.length || learnSkills.length
      ? "55%"
      : "25%";


  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">

      


      <main className="mx-auto max-w-[1380px] px-4 py-6 sm:px-6 lg:px-8">


        {/* =====================================================
            HERO
        ===================================================== */}

        <section
          className="
            overflow-hidden
            rounded-[28px]
            border
            border-[var(--border)]
            bg-[var(--surface)]
            shadow-[var(--shadow-md)]
          "
        >

          <div className="grid lg:grid-cols-[1fr_360px]">


            {/* =================================================
                HERO LEFT
            ================================================= */}

            <div className="p-7 sm:p-9 lg:p-11">


              {/* SMALL LABEL */}

              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[var(--border)]
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
                  Welcome to TimeSwap
                </span>

              </div>


              {/* TITLE */}

              <h1
                className="
                  max-w-[650px]
                  text-[38px]
                  font-extrabold
                  leading-[1.05]
                  tracking-[-0.055em]
                  sm:text-[48px]
                  lg:text-[58px]
                "
              >

                Hey {firstName} 👋

                <br />

                <span className="text-[var(--pink-strong)]">
                  What will you
                </span>

                <br />

                <span className="relative inline-block">

                  learn today?

                  <span
                    className="
                      absolute
                      -bottom-1
                      left-0
                      h-[5px]
                      w-full
                      rounded-full
                      bg-[var(--yellow)]
                    "
                  />

                </span>

              </h1>


              {/* DESCRIPTION */}

              <p
                className="
                  mt-6
                  max-w-[570px]
                  text-[13px]
                  leading-6
                  text-[var(--text-secondary)]
                "
              >
                Exchange your time, share what you know,
                discover new skills and meet people who
                are just as curious as you.
              </p>


              {/* BUTTONS */}

              <div className="mt-7 flex flex-wrap gap-3">

                <Link
                  to="/explore"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-[var(--pink-strong)]
                    px-6
                    py-3
                    text-[11px]
                    font-bold
                    text-white
                    transition
                    hover:-translate-y-0.5
                    hover:bg-[var(--purple)]
                    hover:shadow-[var(--shadow-md)]
                  "
                >

                  Explore people

                  <ArrowRight
                    size={14}
                    className="transition group-hover:translate-x-1"
                  />

                </Link>


                <Link
                  to="/profile"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    px-6
                    py-3
                    text-[11px]
                    font-bold
                    text-[var(--text)]
                    transition
                    hover:-translate-y-0.5
                    hover:bg-[var(--surface-soft)]
                  "
                >

                  <Plus size={14} />

                  Complete profile

                </Link>

              </div>


              {/* TRUST ROW */}

              <div
                className="
                  mt-8
                  flex
                  flex-wrap
                  items-center
                  gap-5
                  text-[9px]
                  font-semibold
                  text-[var(--text-secondary)]
                "
              >

                <span className="flex items-center gap-2">

                  <span
                    className="
                      h-2.5
                      w-2.5
                      rounded-full
                      bg-[var(--green)]
                    "
                  />

                  Learn together

                </span>


                <span className="flex items-center gap-2">

                  <span
                    className="
                      h-2.5
                      w-2.5
                      rounded-full
                      bg-[var(--pink-strong)]
                    "
                  />

                  Give your time

                </span>


                <span className="flex items-center gap-2">

                  <span
                    className="
                      h-2.5
                      w-2.5
                      rounded-full
                      bg-[var(--yellow)]
                    "
                  />

                  Earn credits

                </span>

              </div>

            </div>


            {/* =================================================
                CREDIT PANEL
            ================================================= */}

            <div
              className="
                m-5
                rounded-[24px]
                bg-[var(--lavender)]
                p-6
                text-[#302832]
              "
            >

              {/* TOP */}

              <div className="flex items-start justify-between">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-[14px]
                    bg-[#eee7f3]
                    text-[var(--purple-strong)]
                  "
                >

                  <Coins size={21} />

                </div>


                <span
                  className="
                    rounded-full
                    bg-[#eee7f3]
                    px-3
                    py-1.5
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-[#493b52]
                  "
                >
                  Time Credits
                </span>

              </div>


              {/* BALANCE */}

              <p
                className="
                  mt-8
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[#584b5e]
                "
              >
                Available balance
              </p>


              <div className="mt-1 flex items-end gap-2">

                <span
                  className="
                    text-[55px]
                    font-extrabold
                    leading-none
                    tracking-[-0.07em]
                    text-[#302832]
                  "
                >
                  {credits}
                </span>

                <span
                  className="
                    mb-2
                    text-[10px]
                    font-semibold
                    text-[#584b5e]
                  "
                >
                  credits
                </span>

              </div>


              {/* MINI CARDS */}

              <div className="mt-7 grid grid-cols-2 gap-3">

                <CreditMini
                  label="Earned"
                  value={earned}
                  icon={<Zap size={12} />}
                  color="yellow"
                />

                <CreditMini
                  label="Spent"
                  value={spent}
                  icon={<BookOpen size={12} />}
                  color="pink"
                />

              </div>


              {/* TIP */}

              <div
                className="
                  mt-5
                  rounded-[17px]
                  bg-[#e9dfed]
                  p-4
                "
              >

                <p
                  className="
                    text-[9px]
                    leading-4
                    text-[#554a59]
                  "
                >
                  Teach someone for an hour and earn
                  a credit. Use your credits to learn
                  from someone else. ✨
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            STATS
        ===================================================== */}

        <section
          className="
            mt-5
            grid
            grid-cols-2
            gap-3
            lg:grid-cols-4
          "
        >

          <StatCard
            icon={<Coins size={18} />}
            label="Credits"
            value={credits}
            accent="pink"
          />

          <StatCard
            icon={<Repeat2 size={18} />}
            label="Active swaps"
            value={
              loading
                ? "—"
                : stats.activeSwaps
            }
            accent="lavender"
          />

          <StatCard
            icon={<Users size={18} />}
            label="Connections"
            value={
              loading
                ? "—"
                : stats.peopleConnected
            }
            accent="green"
          />

          <StatCard
            icon={<Star size={18} />}
            label="Your rating"
            value={
              user?.rating
                ? Number(user.rating).toFixed(1)
                : "New"
            }
            accent="yellow"
          />

        </section>


        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <section
          className="
            mt-5
            grid
            gap-5
            lg:grid-cols-[1fr_330px]
          "
        >


          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-5">


            {/* =================================================
                SKILLS
            ================================================= */}

            <div
              className="
                rounded-[26px]
                border
                border-[var(--border)]
                bg-[var(--surface)]
                p-6
                shadow-[var(--shadow-sm)]
              "
            >

              <div className="flex items-start justify-between">

                <div>

                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.2em]
                      text-[var(--pink-strong)]
                    "
                  >
                    Your skill board
                  </p>

                  <h2
                    className="
                      mt-1
                      text-[22px]
                      font-bold
                      tracking-[-0.04em]
                    "
                  >
                    What you bring & want
                  </h2>

                </div>


                <Link
                  to="/profile"
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-[var(--lavender-soft)]
                    text-[var(--purple-strong)]
                    transition
                    hover:scale-105
                  "
                >
                  <ArrowRight size={15} />
                </Link>

              </div>


              <div className="mt-5 grid gap-4 sm:grid-cols-2">


                {/* =================================================
                    TEACH
                ================================================= */}

                <div
                  className="
                    rounded-[22px]
                    bg-[var(--peach)]
                    p-5
                    text-[#35272a]
                    transition
                    hover:-translate-y-1
                  "
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-[13px]
                          bg-[#f3d7ca]
                          text-[#5d4038]
                        "
                      >
                        <Heart size={16} />
                      </div>

                      <span
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.12em]
                        "
                      >
                        I can teach
                      </span>

                    </div>


                    <span
                      className="
                        rounded-full
                        bg-[#f3d7ca]
                        px-2.5
                        py-1
                        text-[8px]
                        font-bold
                        text-[#49363b]
                      "
                    >
                      {teachSkills.length}
                    </span>

                  </div>


                  <div className="mt-5 flex flex-wrap gap-2">

                    {teachSkills.length > 0 ? (

                      teachSkills.map((skill, index) => (

                        <span
                          key={`${skill}-${index}`}
                          className="
                            rounded-full
                            bg-[#f7e5dc]
                            px-3
                            py-2
                            text-[9px]
                            font-semibold
                            text-[#49363b]
                          "
                        >
                          {skill}
                        </span>

                      ))

                    ) : (

                      <span
                        className="
                          text-[10px]
                          font-medium
                          text-[#604a4e]
                        "
                      >
                        Add skills you can teach
                      </span>

                    )}

                  </div>

                </div>


                {/* =================================================
                    LEARN
                ================================================= */}

                <div
                  className="
                    rounded-[22px]
                    bg-[var(--mint)]
                    p-5
                    text-[#29332b]
                    transition
                    hover:-translate-y-1
                  "
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-[13px]
                          bg-[#dce8d9]
                          text-[#405443]
                        "
                      >
                        <BookOpen size={16} />
                      </div>

                      <span
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.12em]
                        "
                      >
                        I want to learn
                      </span>

                    </div>


                    <span
                      className="
                        rounded-full
                        bg-[#dce8d9]
                        px-2.5
                        py-1
                        text-[8px]
                        font-bold
                        text-[#405443]
                      "
                    >
                      {learnSkills.length}
                    </span>

                  </div>


                  <div className="mt-5 flex flex-wrap gap-2">

                    {learnSkills.length > 0 ? (

                      learnSkills.map((skill, index) => (

                        <span
                          key={`${skill}-${index}`}
                          className="
                            rounded-full
                            bg-[#e4efe8]
                            px-3
                            py-2
                            text-[9px]
                            font-semibold
                            text-[#405443]
                          "
                        >
                          {skill}
                        </span>

                      ))

                    ) : (

                      <span
                        className="
                          text-[10px]
                          font-medium
                          text-[#506357]
                        "
                      >
                        Add skills you want to learn
                      </span>

                    )}

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <div>

              <div className="mb-4">

                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-[var(--pink-strong)]
                  "
                >
                  Keep going
                </p>

                <h2
                  className="
                    mt-1
                    text-[22px]
                    font-bold
                    tracking-[-0.04em]
                  "
                >
                  Quick actions
                </h2>

              </div>


              <div className="grid gap-3 sm:grid-cols-3">

                <QuickAction
                  to="/explore"
                  icon={<Compass size={19} />}
                  title="Find people"
                  text="Discover skills you can exchange."
                  className="bg-[var(--pink-soft)]"
                  iconBg="bg-[var(--pink)]"
                />

                <QuickAction
                  to="/swaps"
                  icon={<Repeat2 size={19} />}
                  title="View swaps"
                  text="Check your current connections."
                  className="bg-[var(--lavender-soft)]"
                  iconBg="bg-[var(--lavender)]"
                />

                <QuickAction
                  to="/messages"
                  icon={<MessageCircle size={19} />}
                  title="Messages"
                  text="Continue your conversations."
                  className="bg-[var(--yellow-soft)]"
                  iconBg="bg-[var(--yellow)]"
                />

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="space-y-5">


            {/* =================================================
                PROFILE
            ================================================= */}

            <div
              className="
                rounded-[26px]
                bg-[var(--purple)]
                p-6
                text-white
                shadow-[var(--shadow-md)]
              "
            >

              <div className="flex items-center gap-4">


                {/* AVATAR */}

                <div
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-full
                    border-2
                    border-white/50
                    bg-white/20
                    text-sm
                    font-bold
                  "
                >

                  {user?.profilePicture ? (

                    <img
                      src={user.profilePicture}
                      alt=""
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    getInitials(user?.name)

                  )}

                </div>


                {/* USER */}

                <div className="min-w-0">

                  <p
                    className="
                      truncate
                      text-[14px]
                      font-bold
                      text-white
                    "
                  >
                    {user?.name || "Your profile"}
                  </p>

                  <p
                    className="
                      mt-1
                      truncate
                      text-[9px]
                      text-white/75
                    "
                  >
                    @{user?.username || "username"}
                  </p>

                </div>

              </div>


              {/* PROGRESS */}

              <div className="mt-7">

                <p
                  className="
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-white/75
                  "
                >
                  Your TimeSwap journey
                </p>


                <div
                  className="
                    mt-3
                    h-2
                    overflow-hidden
                    rounded-full
                    bg-white/20
                  "
                >

                  <div
                    className="
                      h-full
                      rounded-full
                      bg-[var(--yellow)]
                    "
                    style={{
                      width: profileProgress,
                    }}
                  />

                </div>


                <p
                  className="
                    mt-2
                    text-[9px]
                    text-white/75
                  "
                >
                  Complete your profile to get
                  better skill matches.
                </p>

              </div>


              {/* PROFILE BUTTON */}

              <Link
                to="/profile"
                className="
                  mt-5
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-[#f8f3eb]
                  px-4
                  py-3
                  text-[10px]
                  font-bold
                  text-[#493b52]
                  transition
                  hover:-translate-y-0.5
                "
              >

                View profile

                <ArrowRight size={13} />

              </Link>

            </div>


            {/* =================================================
                TIME TIP
            ================================================= */}

            <div
              className="
                rounded-[26px]
                border
                border-[var(--border)]
                bg-[var(--surface)]
                p-6
                shadow-[var(--shadow-sm)]
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-[14px]
                    bg-[var(--yellow-soft)]
                    text-[var(--yellow-dark)]
                  "
                >
                  <Clock3 size={18} />
                </div>


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
                    Time tip
                  </p>

                  <h3
                    className="
                      mt-1
                      text-[14px]
                      font-bold
                      text-[var(--text)]
                    "
                  >
                    One hour can go a long way.
                  </h3>

                </div>

              </div>


              <p
                className="
                  mt-4
                  text-[10px]
                  leading-5
                  text-[var(--text-secondary)]
                "
              >
                Your knowledge is valuable.
                Share one hour today and turn it
                into a new opportunity tomorrow. ✨
              </p>

            </div>

          </aside>

        </section>

      </main>

    </div>
  );
}


/* =========================================================
   CREDIT MINI
========================================================= */

function CreditMini({
  label,
  value,
  icon,
  color,
}) {

  const styles = {

    yellow: {
      background: "#eee1a2",
      text: "#554719",
    },

    pink: {
      background: "#e7c7d0",
      text: "#5b3843",
    },

  };


  const style =
    styles[color] || {
      background: "#e5dce8",
      text: "#46384d",
    };


  return (

    <div
      className="
        rounded-[17px]
        p-3.5
      "
      style={{
        background: style.background,
        color: style.text,
      }}
    >

      <div
        className="
          flex
          items-center
          gap-1.5
          text-[var(--text-secondary)]
        "
        style={{
          color: style.text,
        }}
      >

        {icon}

        <span
          className="
            text-[8px]
            font-bold
            uppercase
            tracking-[0.1em]
          "
        >
          {label}
        </span>

      </div>


      <p
        className="
          mt-2
          text-[18px]
          font-bold
        "
        style={{
          color: style.text,
        }}
      >
        {value}
      </p>

    </div>

  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  label,
  value,
  accent,
}) {

  const backgrounds = {

    pink: "bg-[var(--pink-soft)]",

    lavender: "bg-[var(--lavender-soft)]",

    green: "bg-[var(--mint-soft)]",

    yellow: "bg-[var(--yellow-soft)]",

  };


  const iconColors = {

    pink: "text-[var(--pink-strong)]",

    lavender: "text-[var(--purple-strong)]",

    green: "text-[var(--green-strong)]",

    yellow: "text-[var(--yellow-dark)]",

  };


  return (

    <div
      className="
        group
        rounded-[22px]
        border
        border-[var(--border)]
        bg-[var(--surface)]
        p-5
        shadow-[var(--shadow-sm)]
        transition
        hover:-translate-y-1
        hover:shadow-[var(--shadow-md)]
      "
    >

      <div className="flex items-center justify-between">

        <div
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-[13px]
            ${backgrounds[accent]}
            ${iconColors[accent]}
          `}
        >
          {icon}
        </div>


        <Sparkles
          size={14}
          className="
            text-[var(--text-muted)]
            opacity-50
            transition
            group-hover:opacity-100
          "
        />

      </div>


      <p
        className="
          mt-5
          text-[9px]
          font-bold
          uppercase
          tracking-[0.16em]
          text-[var(--text-muted)]
        "
      >
        {label}
      </p>


      <p
        className="
          mt-1
          text-[25px]
          font-bold
          tracking-[-0.05em]
        "
      >
        {value}
      </p>

    </div>

  );
}


/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  to,
  icon,
  title,
  text,
  className,
  iconBg,
}) {

  return (

    <Link
      to={to}
      className={`
        group
        rounded-[22px]
        border
        border-[var(--border)]
        p-5
        shadow-[var(--shadow-sm)]
        transition
        hover:-translate-y-1
        hover:shadow-[var(--shadow-md)]
        ${className}
      `}
    >

      <div
        className={`
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-[13px]
          ${iconBg}
        `}
      >
        {icon}
      </div>


      <h3
        className="
          mt-5
          text-[13px]
          font-bold
        "
      >
        {title}
      </h3>


      <p
        className="
          mt-2
          text-[9px]
          leading-4
          text-[var(--text-secondary)]
        "
      >
        {text}
      </p>


      <div
        className="
          mt-4
          flex
          items-center
          gap-1
          text-[9px]
          font-bold
        "
      >

        Open

        <ArrowRight
          size={11}
          className="transition group-hover:translate-x-1"
        />

      </div>

    </Link>

  );
}


export default Dashboard;
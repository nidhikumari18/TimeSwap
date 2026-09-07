import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Coins,
  Play,
  XCircle,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Sessions() {
  const { user, setUser } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/sessions");

      setSessions(response.data.sessions || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Couldn't load sessions."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // START SESSION
  // ==========================================

  const startSession = async (sessionId) => {
    try {
      setActionLoading(sessionId);
      setError("");

      const response = await api.put(
        `/sessions/${sessionId}/start`
      );

      const updatedSession =
        response.data.session;

      setSessions((previous) =>
        previous.map((session) =>
          session._id === updatedSession._id
            ? updatedSession
            : session
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Couldn't start session."
      );
    } finally {
      setActionLoading("");
    }
  };

  // ==========================================
  // COMPLETE SESSION
  // ==========================================

  const completeSession = async (sessionId) => {
    try {
      setActionLoading(sessionId);
      setError("");

      const response = await api.put(
        `/sessions/${sessionId}/complete`
      );

      const updatedSession =
        response.data.session;

      setSessions((previous) =>
        previous.map((session) =>
          session._id === updatedSession._id
            ? updatedSession
            : session
        )
      );

      // Update credits in AuthContext
      if (user) {
        const newCredits =
          response.data.learnerCredits ??
          response.data.teacherCredits ??
          user.credits;

        setUser({
          ...user,
          credits: newCredits,
        });
      }
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Couldn't complete session."
      );
    } finally {
      setActionLoading("");
    }
  };

  // ==========================================
  // CANCEL SESSION
  // ==========================================

  const cancelSession = async (sessionId) => {
    try {
      setActionLoading(sessionId);
      setError("");

      const response = await api.put(
        `/sessions/${sessionId}/cancel`
      );

      const updatedSession =
        response.data.session;

      setSessions((previous) =>
        previous.map((session) =>
          session._id === updatedSession._id
            ? updatedSession
            : session
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Couldn't cancel session."
      );
    } finally {
      setActionLoading("");
    }
  };

  const upcoming = sessions.filter(
    (session) =>
      session.status === "scheduled"
  );

  const active = sessions.filter(
    (session) =>
      session.status === "active"
  );

  const completed = sessions.filter(
    (session) =>
      session.status === "completed"
  );

  const cancelled = sessions.filter(
    (session) =>
      session.status === "cancelled"
  );

  const creditsEarned = completed
    .filter(
      (session) =>
        session.teacher?._id === user?._id
    )
    .reduce(
      (total, session) =>
        total + session.credits,
      0
    );

  const creditsSpent = completed
    .filter(
      (session) =>
        session.learner?._id === user?._id
    )
    .reduce(
      (total, session) =>
        total + session.credits,
      0
    );

  return (
    <div className="min-h-screen bg-[#11110f] text-[#f5f2ea]">

      {/* ==========================================
          NAVBAR
      ========================================== */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#11110f]/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[70px] max-w-[1200px] items-center justify-between px-5">

          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f2ea] text-[#11110f]">
              <Sparkles size={15} />
            </div>

            <div>
              <span className="block text-[16px] font-semibold">
                SkillSwap
              </span>

              <span className="hidden text-[8px] uppercase tracking-[0.16em] text-white/40 sm:block">
                Give an hour. Gain a skill.
              </span>
            </div>
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-xs text-white/50 transition hover:text-white"
          >
            <ArrowLeft size={13} />
            Dashboard
          </Link>

        </div>
      </header>


      {/* ==========================================
          MAIN
      ========================================== */}

      <main className="mx-auto max-w-[1200px] px-5 py-8 lg:py-10">

        {/* HEADER */}

        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Your learning journey
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
              My sessions
            </h1>

            <p className="mt-2 max-w-lg text-xs leading-6 text-white/50">
              Learn, teach, and exchange your time
              for skills through the SkillSwap community.
            </p>

          </div>


          {/* CREDIT BALANCE */}

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0df91] text-[#292722]">
              <Coins size={18} />
            </div>

            <div>
              <p className="text-[8px] uppercase tracking-[0.16em] text-white/40">
                Available credits
              </p>

              <p className="mt-0.5 text-xl font-semibold">
                {user?.credits ?? 0}
              </p>
            </div>

          </div>

        </section>


        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-200">
            {error}
          </div>
        )}


        {/* ==========================================
            CREDIT STATS
        ========================================== */}

        <section className="mt-8 grid gap-3 sm:grid-cols-3">

          <StatCard
            icon={<Clock3 size={16} />}
            label="Upcoming"
            value={upcoming.length}
          />

          <StatCard
            icon={<Coins size={16} />}
            label="Credits earned"
            value={`+${creditsEarned}`}
          />

          <StatCard
            icon={<Coins size={16} />}
            label="Credits spent"
            value={`-${creditsSpent}`}
          />

        </section>


        {/* ==========================================
            ACTIVE
        ========================================== */}

        {active.length > 0 && (
          <SessionSection
            title="Active now"
            subtitle="Sessions currently in progress"
            sessions={active}
            actionLoading={actionLoading}
            onComplete={completeSession}
            onStart={startSession}
            onCancel={cancelSession}
          />
        )}


        {/* ==========================================
            UPCOMING
        ========================================== */}

        <SessionSection
          title="Upcoming"
          subtitle="Your scheduled learning sessions"
          sessions={upcoming}
          actionLoading={actionLoading}
          onComplete={completeSession}
          onStart={startSession}
          onCancel={cancelSession}
        />


        {/* ==========================================
            COMPLETED
        ========================================== */}

        <SessionSection
          title="Completed"
          subtitle="Your finished skill exchanges"
          sessions={completed}
          actionLoading={actionLoading}
          onComplete={completeSession}
          onStart={startSession}
          onCancel={cancelSession}
        />


        {/* ==========================================
            CANCELLED
        ========================================== */}

        {cancelled.length > 0 && (
          <SessionSection
            title="Cancelled"
            subtitle="Sessions that were cancelled"
            sessions={cancelled}
            actionLoading={actionLoading}
            onComplete={completeSession}
            onStart={startSession}
            onCancel={cancelSession}
          />
        )}


        {/* ==========================================
            NO SESSIONS
        ========================================== */}

        {!loading && sessions.length === 0 && (
          <div className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.04] px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
              <CalendarDays size={21} />
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              No sessions yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-white/40">
              Find someone whose skills match yours
              and start your first skill exchange.
            </p>

            <Link
              to="/explore"
              className="mt-6 inline-flex rounded-full bg-[#f5f2ea] px-5 py-3 text-[10px] font-semibold text-[#11110f]"
            >
              Explore people
            </Link>

          </div>
        )}

      </main>
    </div>
  );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">

      <div className="flex items-center justify-between">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
          {icon}
        </div>

        <span className="text-xl font-semibold">
          {value}
        </span>

      </div>

      <p className="mt-4 text-[9px] uppercase tracking-[0.16em] text-white/40">
        {label}
      </p>

    </div>
  );
}


// =====================================================
// SESSION SECTION
// =====================================================

function SessionSection({
  title,
  subtitle,
  sessions,
  actionLoading,
  onComplete,
  onStart,
  onCancel,
}) {
  return (
    <section className="mt-10">

      <div className="mb-4">

        <h2 className="text-xl font-semibold">
          {title}
        </h2>

        <p className="mt-1 text-[10px] text-white/40">
          {subtitle}
        </p>

      </div>


      {sessions.length === 0 ? (

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-7 text-xs text-white/30">
          Nothing here yet.
        </div>

      ) : (

        <div className="grid gap-4 md:grid-cols-2">

          {sessions.map((session) => (

            <SessionCard
              key={session._id}
              session={session}
              actionLoading={actionLoading}
              onComplete={onComplete}
              onStart={onStart}
              onCancel={onCancel}
            />

          ))}

        </div>

      )}

    </section>
  );
}


// =====================================================
// SESSION CARD
// =====================================================

function SessionCard({
  session,
  actionLoading,
  onComplete,
  onStart,
  onCancel,
}) {
  const teacher = session.teacher;
  const learner = session.learner;

  const isLoading =
    actionLoading === session._id;

  return (
    <div className="group rounded-[24px] border border-white/10 bg-[#1a1a17] p-5 transition hover:border-white/20">

      {/* TOP */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <Avatar
            person={teacher}
          />

          <div>

            <p className="text-[13px] font-semibold">
              {teacher?.name || "Teacher"}
            </p>

            <p className="mt-0.5 text-[9px] text-white/35">
              @{teacher?.username || "user"}
            </p>

          </div>

        </div>


        <StatusBadge
          status={session.status}
        />

      </div>


      {/* SKILL */}

      <div className="mt-6 rounded-2xl bg-white/[0.04] p-4">

        <p className="text-[8px] uppercase tracking-[0.17em] text-white/35">
          Learning
        </p>

        <h3 className="mt-1 text-lg font-semibold">
          {session.skill}
        </h3>

      </div>


      {/* DETAILS */}

      <div className="mt-4 grid grid-cols-2 gap-3">

        <Detail
          icon={<Clock3 size={13} />}
          label="Duration"
          value={`${session.duration} hour${
            session.duration > 1
              ? "s"
              : ""
          }`}
        />

        <Detail
          icon={<Coins size={13} />}
          label="Credits"
          value={`${session.credits}`}
        />

      </div>


      {/* DATE */}

      {session.scheduledAt && (
        <div className="mt-4 flex items-center gap-2 text-[10px] text-white/40">

          <CalendarDays size={13} />

          {new Date(
            session.scheduledAt
          ).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
          })}

        </div>
      )}


      {/* ACTIONS */}

      {session.status === "scheduled" && (
        <div className="mt-5 flex gap-2">

          <button
            onClick={() =>
              onStart(session._id)
            }
            disabled={isLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#f5f2ea] px-4 py-3 text-[10px] font-semibold text-[#11110f] transition hover:opacity-90 disabled:opacity-40"
          >
            <Play size={12} />

            {isLoading
              ? "Starting..."
              : "Start session"}
          </button>

          <button
            onClick={() =>
              onCancel(session._id)
            }
            disabled={isLoading}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-white/40 transition hover:border-red-400/30 hover:text-red-300 disabled:opacity-40"
          >
            <XCircle size={15} />
          </button>

        </div>
      )}


      {session.status === "active" && (
        <button
          onClick={() =>
            onComplete(session._id)
          }
          disabled={isLoading}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#b9c99e] px-4 py-3 text-[10px] font-semibold text-[#20251b] transition hover:opacity-90 disabled:opacity-40"
        >
          <CheckCircle2 size={13} />

          {isLoading
            ? "Completing..."
            : `Complete & transfer ${session.credits} credits`}
        </button>
      )}


      {session.status === "completed" && (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#b9c99e]/10 px-4 py-3 text-[10px] text-[#cbd9b6]">

          <CheckCircle2 size={13} />

          Session completed •{" "}
          {session.credits} credits transferred

        </div>
      )}

    </div>
  );
}


// =====================================================
// AVATAR
// =====================================================

function Avatar({ person }) {
  const initials =
    person?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  if (person?.profilePicture) {
    return (
      <img
        src={person.profilePicture}
        alt={person.name}
        className="h-11 w-11 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8ddea] text-xs font-semibold text-[#292722]">
      {initials}
    </div>
  );
}


// =====================================================
// STATUS
// =====================================================

function StatusBadge({ status }) {
  const labels = {
    scheduled: "Upcoming",
    active: "Active",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <span className="rounded-full bg-white/10 px-3 py-1.5 text-[8px] font-medium uppercase tracking-[0.1em] text-white/50">
      {labels[status] || status}
    </span>
  );
}


// =====================================================
// DETAIL
// =====================================================

function Detail({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-white/[0.035] p-3">

      <div className="flex items-center gap-2 text-white/35">
        {icon}

        <span className="text-[8px] uppercase tracking-[0.1em]">
          {label}
        </span>
      </div>

      <p className="mt-2 text-xs font-medium">
        {value}
      </p>

    </div>
  );
}


export default Sessions;
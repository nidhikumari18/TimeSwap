
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Inbox,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MySwaps() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // =====================================================
  // CURRENT USER
  // =====================================================

  const currentUser = useMemo(() => {
    try {
      const storedUser =
        localStorage.getItem("user") ||
        localStorage.getItem("timeswapUser");

      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to read current user:", error);
      return null;
    }
  }, []);

  // =====================================================
  // LOAD SWAP REQUESTS
  // =====================================================

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const response = await api.get("/swaps/request/status");

      const data = response.data;

      const list =
        data?.requests ||
        data?.swaps ||
        data ||
        [];

      setRequests(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Failed to load swap requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // STATUS HELPERS
  // =====================================================

  const getStatus = (request) => {
    return (
      request?.status ||
      request?.requestStatus ||
      "pending"
    ).toLowerCase();
  };

  const getRequestId = (request) => {
    return request?._id || request?.id;
  };

  // =====================================================
  // PERSON HELPERS
  // =====================================================

  const getPerson = (request) => {
    return (
      request?.sender ||
      request?.receiver ||
      request?.user ||
      request?.from ||
      {}
    );
  };

  const getPersonId = (person) => {
    if (!person) return null;

    if (typeof person === "string") {
      return person;
    }

    return (
      person?._id ||
      person?.id ||
      person?.userId ||
      null
    );
  };

  const getName = (request) => {
    const person = getPerson(request);

    return (
      person?.name ||
      person?.fullName ||
      request?.name ||
      request?.username ||
      "TimeSwap User"
    );
  };

  const getUsername = (request) => {
    const person = getPerson(request);

    return (
      person?.username ||
      request?.username ||
      "user"
    );
  };

  const getProfilePicture = (request) => {
    const person = getPerson(request);

    return (
      person?.profilePicture ||
      person?.profileImage ||
      person?.avatar ||
      request?.profilePicture ||
      request?.sender?.profilePicture ||
      request?.receiver?.profilePicture ||
      null
    );
  };

  // =====================================================
  // REQUEST DIRECTION
  // =====================================================

  const isIncomingRequest = (request) => {
    if (!currentUser) return false;

    const currentUserId =
      currentUser?._id ||
      currentUser?.id ||
      currentUser?.userId;

    const receiverId = getPersonId(request?.receiver);

    const directReceiverId =
      request?.receiverId ||
      request?.receiver_id;

    const targetReceiverId =
      receiverId || directReceiverId;

    return (
      targetReceiverId &&
      currentUserId &&
      targetReceiverId.toString() === currentUserId.toString()
    );
  };

  const isSentRequest = (request) => {
    if (!currentUser) return false;

    const currentUserId =
      currentUser?._id ||
      currentUser?.id ||
      currentUser?.userId;

    const senderId = getPersonId(request?.sender);

    const directSenderId =
      request?.senderId ||
      request?.sender_id;

    const targetSenderId =
      senderId || directSenderId;

    return (
      targetSenderId &&
      currentUserId &&
      targetSenderId.toString() === currentUserId.toString()
    );
  };

  // =====================================================
  // COUNTS
  // =====================================================

  const counts = useMemo(() => {
    return {
      all: requests.length,

      pending: requests.filter(
        (request) => getStatus(request) === "pending"
      ).length,

      accepted: requests.filter(
        (request) => getStatus(request) === "accepted"
      ).length,

      rejected: requests.filter((request) => {
        const status = getStatus(request);

        return (
          status === "rejected" ||
          status === "declined"
        );
      }).length,
    };
  }, [requests]);

  // =====================================================
  // FILTER REQUESTS
  // =====================================================

  const filteredRequests = useMemo(() => {
    if (activeTab === "all") {
      return requests;
    }

    return requests.filter((request) => {
      const status = getStatus(request);

      if (activeTab === "rejected") {
        return (
          status === "rejected" ||
          status === "declined"
        );
      }

      return status === activeTab;
    });
  }, [requests, activeTab]);

  // =====================================================
  // UPDATE REQUEST
  // =====================================================

  const updateRequest = async (requestId, status) => {
    if (!requestId) return;

    try {
      setUpdatingId(requestId);

      await api.put(
        `/swaps/request/${requestId}`,
        { status }
      );

      setRequests((previous) =>
        previous.map((request) =>
          getRequestId(request) === requestId
            ? {
                ...request,
                status,
              }
            : request
        )
      );
    } catch (error) {
      console.error(
        "Failed to update swap request:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Could not update this request."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // MESSAGE
  // =====================================================

  const handleMessage = (request) => {
    const currentUserId =
      currentUser?._id ||
      currentUser?.id ||
      currentUser?.userId;

    const senderId = getPersonId(request?.sender);
    const receiverId = getPersonId(request?.receiver);

    let otherUserId = null;

    if (
      currentUserId &&
      senderId &&
      senderId.toString() === currentUserId.toString()
    ) {
      otherUserId = receiverId;
    } else {
      otherUserId = senderId || receiverId;
    }

    if (otherUserId) {
      navigate(`/messages?user=${otherUserId}`);
    } else {
      navigate("/messages");
    }
  };

  // =====================================================
  // INITIALS
  // =====================================================

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] transition-colors duration-300">
      <main className="mx-auto w-full max-w-[1200px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="relative mb-6 overflow-hidden rounded-[26px] border border-[var(--border-light)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-7">

          <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[var(--pink-soft)] opacity-60 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 right-[30%] h-40 w-40 rounded-full bg-[var(--lavender-soft)] opacity-50 blur-3xl" />

          <div className="relative">

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--pink)] bg-[var(--pink-soft)] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--pink-strong)]">
              <Sparkles size={12} />
              Your skill exchanges
            </div>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

              <div>
                <h1 className="text-[30px] font-bold leading-tight tracking-[-0.05em] sm:text-[38px]">
                  My Swaps
                </h1>

                <p className="mt-2 max-w-xl text-[11px] leading-5 text-[var(--text-secondary)]">
                  Keep track of your skill exchanges,
                  requests and new connections.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchRequests}
                disabled={loading}
                className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-[13px] border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-[10px] font-bold text-[var(--text)] transition hover:-translate-y-0.5 hover:border-[var(--pink)] hover:bg-[var(--pink-soft)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={13}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

            </div>
          </div>
        </section>

        {/* =================================================
            QUICK STATS
        ================================================= */}

        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

          <StatCard
            icon={<Users size={15} />}
            label="All requests"
            value={counts.all}
            color="pink"
          />

          <StatCard
            icon={<Clock3 size={15} />}
            label="Pending"
            value={counts.pending}
            color="yellow"
          />

          <StatCard
            icon={<CheckCircle2 size={15} />}
            label="Accepted"
            value={counts.accepted}
            color="mint"
          />

          <StatCard
            icon={<X size={15} />}
            label="Declined"
            value={counts.rejected}
            color="peach"
          />

        </section>

        {/* =================================================
            TABS
        ================================================= */}

        <section className="mb-5">

          <div className="flex w-full gap-2 overflow-x-auto rounded-[18px] border border-[var(--border-light)] bg-[var(--surface)] p-2 shadow-[var(--shadow-sm)]">

            <FilterButton
              active={activeTab === "all"}
              onClick={() => setActiveTab("all")}
              label="All"
              count={counts.all}
            />

            <FilterButton
              active={activeTab === "pending"}
              onClick={() => setActiveTab("pending")}
              label="Pending"
              count={counts.pending}
            />

            <FilterButton
              active={activeTab === "accepted"}
              onClick={() => setActiveTab("accepted")}
              label="Accepted"
              count={counts.accepted}
            />

            <FilterButton
              active={activeTab === "rejected"}
              onClick={() => setActiveTab("rejected")}
              label="Declined"
              count={counts.rejected}
            />

          </div>
        </section>

        {/* =================================================
            SECTION TITLE
        ================================================= */}

        <div className="mb-4 flex items-center justify-between">

          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[var(--pink-strong)]">
              Activity
            </p>

            <h2 className="mt-1 text-[20px] font-bold tracking-[-0.04em]">
              Swap requests
            </h2>
          </div>

          <div className="rounded-full bg-[var(--lavender-soft)] px-3 py-1.5 text-[9px] font-bold text-[var(--purple-strong)]">
            {filteredRequests.length} shown
          </div>

        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        {loading ? (
          <LoadingState />
        ) : filteredRequests.length === 0 ? (
          <EmptyState
            activeTab={activeTab}
            goExplore={() => navigate("/explore")}
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">

            {filteredRequests.map((request) => {
              const requestId = getRequestId(request);
              const incoming = isIncomingRequest(request);
              const sent = isSentRequest(request);

              return (
                <SwapRequestCard
                  key={requestId}
                  request={request}
                  name={getName(request)}
                  username={getUsername(request)}
                  profilePicture={getProfilePicture(request)}
                  initials={getInitials(getName(request))}
                  updating={updatingId === requestId}
                  isIncoming={incoming}
                  isSent={sent}
                  onAccept={() =>
                    updateRequest(requestId, "accepted")
                  }
                  onReject={() =>
                    updateRequest(requestId, "rejected")
                  }
                  onMessage={() =>
                    handleMessage(request)
                  }
                />
              );
            })}

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
  color,
}) {
  const colors = {
    pink: {
      bg: "bg-[var(--pink-soft)]",
      icon: "bg-[var(--pink)]",
      text: "text-[var(--pink-strong)]",
    },

    yellow: {
      bg: "bg-[var(--yellow-soft)]",
      icon: "bg-[var(--yellow)]",
      text: "text-[var(--yellow-dark)]",
    },

    mint: {
      bg: "bg-[var(--mint-soft)]",
      icon: "bg-[var(--mint)]",
      text: "text-[var(--green-strong)]",
    },

    peach: {
      bg: "bg-[var(--peach-soft)]",
      icon: "bg-[var(--peach)]",
      text: "text-[var(--peach-dark)]",
    },
  };

  const selected = colors[color] || colors.pink;

  return (
    <div
      className={`
        ${selected.bg}
        rounded-[20px]
        border
        border-[var(--border-light)]
        p-3.5
        shadow-[var(--shadow-sm)]
        transition
        hover:-translate-y-0.5
      `}
    >

      <div className="flex items-center justify-between">

        <div
          className={`
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-[11px]
            ${selected.icon}
            ${selected.text}
          `}
        >
          {icon}
        </div>

        <span className="text-[20px] font-bold tracking-[-0.04em] text-[var(--text)]">
          {value}
        </span>

      </div>

      <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
        {label}
      </p>

    </div>
  );
}

// =====================================================
// FILTER BUTTON
// =====================================================

function FilterButton({
  active,
  onClick,
  label,
  count,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        shrink-0
        items-center
        gap-2
        rounded-[12px]
        px-3.5
        py-2
        text-[9px]
        font-bold
        transition
        ${
          active
            ? "bg-[var(--purple)] text-white shadow-[var(--shadow-sm)]"
            : "text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
        }
      `}
    >

      {label}

      <span
        className={`
          rounded-full
          px-1.5
          py-0.5
          text-[8px]
          ${
            active
              ? "bg-white/20 text-white"
              : "bg-[var(--surface-soft)] text-[var(--text-muted)]"
          }
        `}
      >
        {count}
      </span>

    </button>
  );
}

// =====================================================
// REQUEST CARD
// =====================================================

function SwapRequestCard({
  request,
  name,
  username,
  profilePicture,
  initials,
  updating,
  isIncoming,
  isSent,
  onAccept,
  onReject,
  onMessage,
}) {
  const status = (
    request?.status ||
    request?.requestStatus ||
    "pending"
  ).toLowerCase();

  const skill =
    request?.skill ||
    request?.skillTheyTeach ||
    request?.teachSkill ||
    request?.requestedSkill ||
    "Skill exchange";

  const wantedSkill =
    request?.skillTheyWant ||
    request?.wantSkill ||
    request?.learningSkill ||
    request?.offeredSkill ||
    "Your skills";

  const message =
    request?.message ||
    "I'd love to exchange skills with you!";

  const isPending = status === "pending";

  const isAccepted = status === "accepted";

  const isRejected =
    status === "rejected" ||
    status === "declined";

  return (
    <article className="overflow-hidden rounded-[23px] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">

      {/* TOP COLOUR STRIP */}

      <div
        className={`
          h-2
          ${
            isAccepted
              ? "bg-[var(--mint)]"
              : isRejected
              ? "bg-[var(--peach)]"
              : "bg-[var(--pink)]"
          }
        `}
      />

      <div className="p-4 sm:p-5">

        {/* PERSON */}

        <div className="flex items-center justify-between gap-3">

          <div className="flex min-w-0 items-center gap-3">

            {profilePicture ? (
              <img
                src={profilePicture}
                alt=""
                className="h-11 w-11 shrink-0 rounded-[14px] border-2 border-[var(--border-light)] object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[var(--lavender)] text-sm font-bold text-[var(--purple-dark)]">
                {initials}
              </div>
            )}

            <div className="min-w-0">

              <h3 className="truncate text-[13px] font-bold text-[var(--text)]">
                {name}
              </h3>

              <p className="mt-0.5 truncate text-[9px] text-[var(--text-muted)]">
                @{username}
              </p>

            </div>
          </div>

          <StatusBadge status={status} />

        </div>

        {/* REQUEST TYPE */}

        <div className="mt-4 rounded-[15px] bg-[var(--surface-soft)] px-3 py-2">

          <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            {isIncoming
              ? "Incoming request"
              : isSent
              ? "Sent request"
              : "Skill exchange"}
          </p>

        </div>

        {/* SKILL EXCHANGE */}

        <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">

          <div className="rounded-[16px] border border-[var(--border-light)] bg-[var(--peach-soft)] p-3">

            <p className="text-[8px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              They offer
            </p>

            <p className="mt-1 truncate text-[12px] font-semibold text-[var(--text)]">
              {skill}
            </p>

          </div>

          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text-secondary)] shadow-sm">
            <ArrowRight size={12} />
          </div>

          <div className="rounded-[16px] border border-[var(--border-light)] bg-[var(--mint-soft)] p-3">

            <p className="text-[8px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              They want
            </p>

            <p className="mt-1 truncate text-[12px] font-semibold text-[var(--text)]">
              {wantedSkill}
            </p>

          </div>

        </div>

        {/* MESSAGE */}

        {message && (
          <div className="mt-4 rounded-[15px] border border-[var(--border-light)] bg-[var(--surface-soft)] px-3 py-2.5">

            <div className="flex items-start gap-2">

              <MessageCircle
                size={12}
                className="mt-0.5 shrink-0 text-[var(--purple-strong)]"
              />

              <p className="text-[10px] leading-5 text-[var(--text-secondary)]">
                “{message}”
              </p>

            </div>

          </div>
        )}

        {/* ACTIONS */}

        <div className="mt-4 flex gap-2">

          {isPending && isIncoming ? (
            <>
              <button
                type="button"
                disabled={updating}
                onClick={onAccept}
                className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[12px] bg-[var(--green-strong)] px-3 text-[9px] font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={13} />

                {updating
                  ? "Updating..."
                  : "Accept"}
              </button>

              <button
                type="button"
                disabled={updating}
                onClick={onReject}
                className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[12px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-[9px] font-bold text-[var(--text-secondary)] transition hover:bg-[var(--peach-soft)] hover:text-[var(--peach-dark)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={13} />
                Decline
              </button>
            </>
          ) : isAccepted ? (
            <button
              type="button"
              onClick={onMessage}
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[12px] bg-[var(--purple)] px-3 text-[9px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--purple-strong)]"
            >
              <MessageCircle size={13} />
              Message
              <ArrowRight size={12} />
            </button>
          ) : isPending && isSent ? (
            <div className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[12px] bg-[var(--yellow-soft)] px-3 text-[9px] font-bold text-[var(--yellow-dark)]">
              <Clock3 size={13} />
              Waiting for response
            </div>
          ) : (
            <button
              type="button"
              onClick={onMessage}
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[12px] bg-[var(--purple)] px-3 text-[9px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--purple-strong)]"
            >
              <MessageCircle size={13} />
              Message
              <ArrowRight size={12} />
            </button>
          )}

        </div>

      </div>
    </article>
  );
}

// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({ status }) {
  if (status === "accepted") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--mint-soft)] px-2.5 py-1.5 text-[8px] font-bold text-[var(--green-strong)]">
        <CheckCircle2 size={11} />
        Accepted
      </span>
    );
  }

  if (
    status === "rejected" ||
    status === "declined"
  ) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--peach-soft)] px-2.5 py-1.5 text-[8px] font-bold text-[var(--peach-dark)]">
        <X size={11} />
        Declined
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--yellow-soft)] px-2.5 py-1.5 text-[8px] font-bold text-[var(--yellow-dark)]">
      <Clock3 size={11} />
      Pending
    </span>
  );
}

// =====================================================
// LOADING STATE
// =====================================================

function LoadingState() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">

      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-[23px] border border-[var(--border-light)] bg-[var(--card)]"
        >

          <div className="h-2 bg-[var(--pink-soft)]" />

          <div className="space-y-4 p-5">

            <div className="flex items-center gap-3">

              <div className="h-11 w-11 animate-pulse rounded-[14px] bg-[var(--surface-soft)]" />

              <div className="space-y-2">

                <div className="h-3 w-28 animate-pulse rounded bg-[var(--surface-soft)]" />

                <div className="h-2 w-20 animate-pulse rounded bg-[var(--surface-soft)]" />

              </div>

            </div>

            <div className="h-7 w-28 animate-pulse rounded-[12px] bg-[var(--surface-soft)]" />

            <div className="grid grid-cols-2 gap-2">

              <div className="h-20 animate-pulse rounded-[16px] bg-[var(--peach-soft)]" />

              <div className="h-20 animate-pulse rounded-[16px] bg-[var(--mint-soft)]" />

            </div>

            <div className="h-14 animate-pulse rounded-[15px] bg-[var(--surface-soft)]" />

            <div className="h-9 animate-pulse rounded-[12px] bg-[var(--surface-soft)]" />

          </div>
        </div>
      ))}

    </div>
  );
}

// =====================================================
// EMPTY STATE
// =====================================================

function EmptyState({
  activeTab,
  goExplore,
}) {
  const title =
    activeTab === "all"
      ? "No swap requests yet"
      : activeTab === "rejected"
      ? "No declined requests"
      : `No ${activeTab} requests`;

  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] px-6 py-14 text-center shadow-[var(--shadow-sm)]">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[var(--lavender-soft)] text-[var(--purple-strong)]">
        <Inbox size={24} />
      </div>

      <h3 className="mt-4 text-[18px] font-bold">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-[10px] leading-5 text-[var(--text-secondary)]">
        Start exploring the TimeSwap community
        and find someone whose skills match yours.
      </p>

      <button
        type="button"
        onClick={goExplore}
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-[13px] bg-[var(--purple)] px-5 text-[9px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--purple-strong)]"
      >
        Explore people
        <ArrowRight size={13} />
      </button>

    </div>
  );
}

export default MySwaps;


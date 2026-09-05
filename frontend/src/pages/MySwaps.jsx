import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  MessageCircle,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function MySwaps() {
  const { user } = useAuth();

  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch incoming and sent requests separately using the actual backend routes
      const [incomingRes, sentRes] = await Promise.all([
        api.get("/swaps/received"),
        api.get("/swaps/sent"),
      ]);

      setIncomingRequests(
        incomingRes.data.requests || []
      );
      setSentRequests(
        sentRes.data.requests || []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Couldn't load your swap requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (
    requestId,
    status
  ) => {
    try {
      setUpdatingId(requestId);
      setError("");

      await api.put(
        `/swaps/request/${requestId}`,
        {
          status,
        }
      );

      // Update incoming requests
      setIncomingRequests((previous) =>
        previous.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status,
              }
            : request
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Couldn't update the request."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* -------------------------------- */
  /* ACCEPTED REQUESTS */
  /* -------------------------------- */

  const acceptedRequests = [
    ...incomingRequests,
    ...sentRequests,
  ].filter(
    (request) =>
      request.status?.toLowerCase() ===
      "accepted"
  );

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#292722]">

      {/* ============================================== */}
      {/* NAVBAR */}
      {/* ============================================== */}

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

            <NavItem
              to="/dashboard"
              text="Home"
            />

            <NavItem
              to="/explore"
              text="Explore"
            />

            <NavItem
              to="/swaps"
              text="My swaps"
              active
            />

            <NavItem
              to="/messages"
              text="Messages"
            />

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


      {/* ============================================== */}
      {/* MAIN */}
      {/* ============================================== */}

      <main className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 lg:py-10">

        {/* BACK */}

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-[10px] text-[#8e887f] transition hover:text-[#292722]"
        >
          <ArrowLeft size={13} />
          Back home
        </Link>


        {/* ============================================== */}
        {/* HERO */}
        {/* ============================================== */}

        <section className="mt-6 grid overflow-hidden rounded-[28px] bg-[#ddd5e8] lg:grid-cols-[1fr_300px]">

          {/* HERO TEXT */}

          <div className="px-6 py-9 sm:px-10 sm:py-11">

            <div className="inline-flex items-center gap-2 rounded-full bg-[#eee9f2] px-3 py-1.5 text-[9px] font-medium text-[#6d6473]">

              <Sparkles size={11} />

              Your exchanges

            </div>


            <h1 className="mt-5 text-[38px] font-semibold leading-[0.98] tracking-[-0.06em] sm:text-[52px]">

              My swaps.

              <br />

              Learn. Share. Connect.

            </h1>


            <p className="mt-5 max-w-[500px] text-[12px] leading-6 text-[#706974] sm:text-[13px]">

              Keep track of the people you're
              learning from, teaching, and
              connecting with.

            </p>

          </div>


          {/* HERO STATS */}

          <div className="relative hidden overflow-hidden lg:block">

            <div className="absolute -right-16 -top-16 h-[250px] w-[250px] rounded-full border-[25px] border-[#eeeaf3]/70" />

            <div className="absolute right-8 top-20 h-[150px] w-[150px] rounded-full border-[16px] border-[#cfc4dc]/70" />


            <div className="absolute right-10 bottom-9 w-[205px] rounded-[20px] bg-[#fffdf9] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.07)]">

              <div className="flex items-center justify-between">

                <span className="text-[8px] uppercase tracking-[0.16em] text-[#aaa39a]">
                  Active swaps
                </span>

                <Users size={13} />

              </div>


              <p className="mt-3 text-[32px] font-semibold tracking-[-0.05em]">
                {acceptedRequests.length}
              </p>

              <p className="text-[9px] text-[#99938a]">
                connections in progress
              </p>

            </div>

          </div>

        </section>


        {/* ============================================== */}
        {/* QUICK STATS */}
        {/* ============================================== */}

        <section className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">

          <MiniStat
            value={incomingRequests.length}
            label="Incoming"
            className="bg-[#f0df91]"
          />

          <MiniStat
            value={sentRequests.length}
            label="Sent"
            className="bg-[#e8b6d5]"
          />

          <MiniStat
            value={acceptedRequests.length}
            label="Active"
            className="bg-[#dde5d2]"
          />

        </section>


        {/* ============================================== */}
        {/* ERROR */}
        {/* ============================================== */}

        {error && (
          <div className="mt-5 rounded-2xl border border-[#ead8d5] bg-[#f8eae7] px-5 py-4 text-[11px] text-[#8b625c]">
            {error}
          </div>
        )}


        {/* ============================================== */}
        {/* ACTIVE SWAPS */}
        {/* ============================================== */}

        {acceptedRequests.length > 0 &&
          !loading && (

            <section className="mt-10">

              <SectionHeading
                eyebrow="Currently learning"
                title="Active swaps"
                count={acceptedRequests.length}
              />

              <div className="mt-5 grid gap-3 md:grid-cols-2">

                {acceptedRequests.map(
                  (request) => (
                    <ActiveSwapCard
                      key={request._id}
                      request={request}
                      user={user}
                    />
                  )
                )}

              </div>

            </section>

          )}


        {/* ============================================== */}
        {/* REQUESTS */}
        {/* ============================================== */}

        <section className="mt-10 grid gap-8 lg:grid-cols-2">


          {/* INCOMING */}

          <section>

            <SectionHeading
              eyebrow="People reaching out"
              title="Incoming"
              count={incomingRequests.length}
            />

            <div className="mt-5">

              {loading ? (

                <LoadingCards />

              ) : incomingRequests.length === 0 ? (

                <EmptyState
                  icon={<Users size={16} />}
                  title="No requests yet"
                  text="When someone wants to exchange skills with you, they'll appear here."
                />

              ) : (

                <div className="space-y-3">

                  {incomingRequests.map(
                    (request) => (

                      <RequestCard
                        key={request._id}
                        request={request}
                        type="incoming"
                        updating={
                          updatingId ===
                          request._id
                        }
                        onUpdate={
                          updateRequest
                        }
                      />

                    )
                  )}

                </div>

              )}

            </div>

          </section>


          {/* SENT */}

          <section>

            <SectionHeading
              eyebrow="People you're waiting on"
              title="Sent"
              count={sentRequests.length}
            />

            <div className="mt-5">

              {loading ? (

                <LoadingCards />

              ) : sentRequests.length === 0 ? (

                <EmptyState
                  icon={<Sparkles size={16} />}
                  title="Nothing sent yet"
                  text="Find someone interesting in Explore and start your first skill exchange."
                  action={
                    <Link
                      to="/explore"
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#292722] px-5 py-2.5 text-[10px] text-white"
                    >
                      Explore people
                      <ArrowRight size={12} />
                    </Link>
                  }
                />

              ) : (

                <div className="space-y-3">

                  {sentRequests.map(
                    (request) => (

                      <RequestCard
                        key={request._id}
                        request={request}
                        type="sent"
                        updating={
                          updatingId ===
                          request._id
                        }
                        onUpdate={
                          updateRequest
                        }
                      />

                    )
                  )}

                </div>

              )}

            </div>

          </section>

        </section>


        {/* ============================================== */}
        {/* BOTTOM CTA */}
        {/* ============================================== */}

        <section className="mt-10 rounded-[24px] bg-[#292722] px-6 py-7 text-white sm:px-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-[8px] uppercase tracking-[0.2em] text-[#aaa59d]">
                Ready for your next exchange?
              </p>

              <h2 className="mt-2 text-[21px] font-medium tracking-[-0.035em]">
                Someone out there knows
                something you want to learn.
              </h2>

            </div>


            <Link
              to="/explore"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-[10px] font-medium text-[#292722] transition hover:-translate-y-0.5"
            >
              Find them
              <ArrowUpRight size={13} />
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}


/* ================================================= */
/* NAV ITEM */
/* ================================================= */

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


/* ================================================= */
/* MINI STAT */
/* ================================================= */

function MiniStat({
  value,
  label,
  className,
}) {
  return (
    <div
      className={`rounded-[20px] p-5 ${className}`}
    >

      <p className="text-[27px] font-semibold tracking-[-0.05em]">
        {value}
      </p>

      <p className="mt-1 text-[9px] uppercase tracking-[0.14em] opacity-60">
        {label}
      </p>

    </div>
  );
}


/* ================================================= */
/* SECTION HEADING */
/* ================================================= */

function SectionHeading({
  eyebrow,
  title,
  count,
}) {
  return (
    <div className="flex items-end justify-between">

      <div>

        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#aaa39a]">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-[25px] font-semibold tracking-[-0.045em]">
          {title}
        </h2>

      </div>


      <span className="rounded-full bg-[#fffdf9] px-3 py-1.5 text-[9px] font-semibold text-[#777168]">
        {count}
      </span>

    </div>
  );
}


/* ================================================= */
/* REQUEST CARD */
/* ================================================= */

function RequestCard({
  request,
  type,
  updating,
  onUpdate,
}) {

  const person =
    type === "incoming"
      ? request.sender
      : request.receiver;


  const name =
    person?.name ||
    request.name ||
    "SkillSwap user";


  const username =
    person?.username || "";


  const initial =
    name.charAt(0).toUpperCase();


  const status =
    request.status?.toLowerCase() ||
    "pending";


  /*
   * Find the other person's ID.
   * This is used to open their exact conversation.
   */

  const otherUserId =
    type === "incoming"
      ? request.sender?._id
      : request.receiver?._id;


  return (
    <article className="group rounded-[22px] border border-[#e2ddd5] bg-[#fffdf9] p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(0,0,0,0.05)]">


      {/* TOP */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8ddea] text-xs font-semibold">
            {initial}
          </div>

          <div>

            <h3 className="text-[14px] font-semibold">
              {name}
            </h3>

            {username && (
              <p className="mt-0.5 text-[9px] text-[#aaa39a]">
                @{username}
              </p>
            )}

          </div>

        </div>


        <StatusBadge status={status} />

      </div>


      {/* EXCHANGE */}

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-[18px] bg-[#f7f4ee] p-4">

        <div>

          <p className="text-[8px] uppercase tracking-[0.16em] text-[#aaa39a]">
            {type === "incoming"
              ? "They teach"
              : "They want"}
          </p>

          <p className="mt-1 text-[12px] font-semibold">
            {request.skillTheyTeach ||
              "A new skill"}
          </p>

        </div>


        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
          <ArrowRight size={12} />
        </div>


        <div className="text-right">

          <p className="text-[8px] uppercase tracking-[0.16em] text-[#aaa39a]">
            {type === "incoming"
              ? "You offer"
              : "You teach"}
          </p>

          <p className="mt-1 text-[12px] font-semibold">
            {request.skillTheyWant ||
              "Your skill"}
          </p>

        </div>

      </div>


      {/* MESSAGE */}

      {request.message && (
        <div className="mt-4">

          <p className="text-[10px] leading-5 text-[#777168]">
            "{request.message}"
          </p>

        </div>
      )}


      {/* INCOMING ACTIONS */}

      {type === "incoming" &&
        status === "pending" && (

          <div className="mt-5 grid grid-cols-2 gap-2">

            <button
              onClick={() =>
                onUpdate(
                  request._id,
                  "accepted"
                )
              }
              disabled={updating}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#292722] py-3 text-[10px] font-medium text-white transition hover:bg-[#3c3934] disabled:opacity-50"
            >

              <Check size={13} />

              {updating
                ? "Updating..."
                : "Accept swap"}

            </button>


            <button
              onClick={() =>
                onUpdate(
                  request._id,
                  "rejected"
                )
              }
              disabled={updating}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#ded8cf] py-3 text-[10px] font-medium transition hover:bg-[#f7f4ee] disabled:opacity-50"
            >

              <X size={13} />

              Decline

            </button>

          </div>

        )}


      {/* SENT */}

      {type === "sent" &&
        status === "pending" && (

          <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#eee8df] px-4 py-3 text-[10px] text-[#888178]">

            <Clock3 size={13} />

            Waiting for their response...

          </div>

        )}


      {/* ACCEPTED */}

      {status === "accepted" &&
        otherUserId && (

          <Link
            to={`/messages?user=${otherUserId}`}
            className="mt-5 flex items-center justify-between rounded-xl bg-[#dde5d2] px-4 py-3 transition hover:bg-[#d4ddc8]"
          >

            <div className="flex items-center gap-2">

              <MessageCircle size={13} />

              <span className="text-[10px] font-medium">
                Your swap is active
              </span>

            </div>


            <ArrowUpRight size={13} />

          </Link>

        )}

    </article>
  );
}


/* ================================================= */
/* ACTIVE SWAP CARD */
/* ================================================= */

function ActiveSwapCard({
  request,
  user,
}) {

  /*
   * Compare IDs as strings.
   * This prevents ObjectId/string comparison issues.
   */

  const senderId =
    request.sender?._id?.toString();

  const currentUserId =
    user?._id?.toString();


  const isSender =
    senderId === currentUserId;


  const person =
    isSender
      ? request.receiver
      : request.sender;


  const name =
    person?.name ||
    "SkillSwap user";


  const initial =
    name.charAt(0).toUpperCase();


  const otherUserId =
    person?._id;


  return (
    <Link
      to={
        otherUserId
          ? `/messages?user=${otherUserId}`
          : "/messages"
      }
      className="group rounded-[22px] border border-[#ded8cf] bg-[#dde5d2] p-5 transition hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(0,0,0,0.05)]"
    >

      {/* TOP */}

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-xs font-semibold">
            {initial}
          </div>

          <div>

            <p className="text-[8px] uppercase tracking-[0.16em] text-[#78816d]">
              Active exchange
            </p>

            <h3 className="mt-1 text-[14px] font-semibold">
              {name}
            </h3>

          </div>

        </div>


        <ArrowUpRight
          size={14}
          className="text-[#59604f] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />

      </div>


      {/* SKILLS */}

      <div className="mt-5 flex items-center gap-2">

        <span className="rounded-full bg-white/70 px-3 py-1.5 text-[9px]">
          {request.skillTheyTeach ||
            "Skill exchange"}
        </span>

        <span className="text-[10px] text-[#78816d]">
          ↔
        </span>

        <span className="rounded-full bg-white/70 px-3 py-1.5 text-[9px]">
          {request.skillTheyWant ||
            "Your skills"}
        </span>

      </div>


      {/* CHAT */}

      <div className="mt-5 flex items-center gap-2 text-[9px] text-[#59604f]">

        <MessageCircle size={12} />

        Continue conversation

      </div>

    </Link>
  );
}


/* ================================================= */
/* STATUS */
/* ================================================= */

function StatusBadge({
  status,
}) {

  if (status === "accepted") {

    return (
      <span className="rounded-full bg-[#dde5d2] px-3 py-1.5 text-[9px] font-semibold text-[#59604f]">
        Accepted
      </span>
    );

  }


  if (status === "rejected") {

    return (
      <span className="rounded-full bg-[#f0e5e3] px-3 py-1.5 text-[9px] font-semibold text-[#8a625d]">
        Declined
      </span>
    );

  }


  return (
    <span className="rounded-full bg-[#eee7f1] px-3 py-1.5 text-[9px] font-semibold text-[#675d6d]">
      Pending
    </span>
  );
}


/* ================================================= */
/* EMPTY */
/* ================================================= */

function EmptyState({
  icon,
  title,
  text,
  action,
}) {

  return (
    <div className="rounded-[22px] border border-[#e2ddd5] bg-[#fffdf9] px-6 py-12 text-center">

      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#eee8df]">
        {icon}
      </div>


      <h3 className="mt-4 text-[14px] font-semibold">
        {title}
      </h3>


      <p className="mx-auto mt-2 max-w-xs text-[10px] leading-5 text-[#99938a]">
        {text}
      </p>


      {action}

    </div>
  );
}


/* ================================================= */
/* LOADING */
/* ================================================= */

function LoadingCards() {

  return (
    <div className="space-y-3">

      {[1, 2].map((item) => (

        <div
          key={item}
          className="h-[225px] animate-pulse rounded-[22px] bg-[#eeeae3]"
        />

      ))}

    </div>
  );
}


export default MySwaps;

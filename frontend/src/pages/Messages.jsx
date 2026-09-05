import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  MoreHorizontal,
  Send,
  Sparkles,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Messages() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const otherUserId = searchParams.get("user");

  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  /* ================================================= */
  /* LOAD OTHER USER */
  /* ================================================= */

  useEffect(() => {
    if (!otherUserId) {
      setLoading(false);
      return;
    }

    fetchOtherUser();
  }, [otherUserId]);

  const fetchOtherUser = async () => {
    try {
      const response = await api.get(`/users/${otherUserId}`);

      setOtherUser(
        response.data.user || response.data
      );
    } catch (error) {
      console.error(
        "Failed to load user:",
        error
      );
    }
  };

  /* ================================================= */
  /* SOCKET.IO */
  /* ================================================= */

  useEffect(() => {
    if (!user?._id) return;

    const socket = io("http://localhost:5000");

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(
        "Socket connected:",
        socket.id
      );

      socket.emit(
        "user-online",
        user._id
      );
    });

    socket.on(
      "receive-message",
      (message) => {
        const senderId =
          message.sender?._id ||
          message.sender;

        const receiverId =
          message.receiver?._id ||
          message.receiver;

        const isCurrentConversation =
          (
            senderId?.toString() ===
              otherUserId?.toString() &&
            receiverId?.toString() ===
              user?._id?.toString()
          ) ||
          (
            senderId?.toString() ===
              user?._id?.toString() &&
            receiverId?.toString() ===
              otherUserId?.toString()
          );

        if (isCurrentConversation) {
          setMessages((previous) => [
            ...previous,
            message,
          ]);
        }
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [user?._id, otherUserId]);

  /* ================================================= */
  /* LOAD MESSAGES */
  /* ================================================= */

  useEffect(() => {
    if (!otherUserId) {
      setLoading(false);
      return;
    }

    fetchMessages();
  }, [otherUserId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/messages/${otherUserId}`
      );

      setMessages(
        response.data.messages || []
      );
    } catch (error) {
      console.error(
        "Failed to load messages:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================================================= */
  /* SEND MESSAGE */
  /* ================================================= */

  const sendMessage = async (e) => {
    e.preventDefault();

    const messageText = text.trim();

    if (
      !messageText ||
      !otherUserId ||
      sending
    ) {
      return;
    }

    try {
      setSending(true);

      const response = await api.post(
        "/messages",
        {
          receiver: otherUserId,
          text: messageText,
        }
      );

      const newMessage =
        response.data.message;

      setMessages((previous) => [
        ...previous,
        newMessage,
      ]);

      socketRef.current?.emit(
        "send-message",
        newMessage
      );

      setText("");

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );
    } finally {
      setSending(false);
    }
  };

  /* ================================================= */
  /* AUTO SCROLL */
  /* ================================================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* ================================================= */
  /* HELPERS */
  /* ================================================= */

  const initials =
    otherUser?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  /* ================================================= */
  /* UI */
  /* ================================================= */

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#292722]">

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

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


          {/* NAV */}

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
            />

            <NavItem
              to="/messages"
              text="Messages"
              active
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


      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="mx-auto flex min-h-[calc(100vh-70px)] w-full max-w-[1200px] flex-col px-4 py-5 sm:px-6 lg:px-8">

        {!otherUserId ? (

          /* ================================================= */
          /* NO CHAT */
          /* ================================================= */

          <div className="flex flex-1 items-center justify-center">

            <div className="w-full max-w-md rounded-[28px] border border-[#e2ddd5] bg-[#fffdf9] px-7 py-12 text-center shadow-[0_12px_40px_rgba(0,0,0,0.03)]">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e9e2ee]">
                <Sparkles size={20} />
              </div>

              <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#aaa39a]">
                SkillSwap messages
              </p>

              <h2 className="mt-2 text-[25px] font-semibold tracking-[-0.045em]">
                Your conversations
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-[11px] leading-5 text-[#99938a]">
                Connect with someone from your
                active swaps and start sharing
                knowledge.
              </p>

              <Link
                to="/swaps"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#292722] px-5 py-3 text-[10px] font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#3c3934]"
              >
                View my swaps
                <ArrowLeft
                  size={12}
                  className="rotate-180"
                />
              </Link>

            </div>

          </div>

        ) : (

          /* ================================================= */
          /* CHAT */
          /* ================================================= */

          <div className="flex min-h-[calc(100vh-110px)] flex-1 flex-col overflow-hidden rounded-[28px] border border-[#e1dcd4] bg-[#fffdf9] shadow-[0_14px_45px_rgba(0,0,0,0.035)]">


            {/* ================================================= */}
            {/* CHAT HEADER */}
            {/* ================================================= */}

            <div className="flex items-center justify-between border-b border-[#eee9e2] bg-[#fffdf9] px-4 py-4 sm:px-6">

              <div className="flex items-center gap-3">

                <Link
                  to="/swaps"
                  className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#f4f1eb]"
                >
                  <ArrowLeft size={15} />
                </Link>


                {/* AVATAR */}

                <div className="relative">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ded5e8] text-xs font-semibold">
                    {initials}
                  </div>

                  {/* online dot */}

                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#fffdf9] bg-[#aab99a]" />

                </div>


                {/* USER */}

                <div>

                  <h2 className="text-[14px] font-semibold">
                    {otherUser?.name ||
                      "Loading..."}
                  </h2>

                  <div className="mt-0.5 flex items-center gap-1.5">

                    <span className="text-[9px] text-[#aaa39a]">
                      @{otherUser?.username ||
                        "user"}
                    </span>

                    <span className="text-[#d0cbc3]">
                      ·
                    </span>

                    <span className="text-[9px] text-[#8c987e]">
                      Active swap
                    </span>

                  </div>

                </div>

              </div>


              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#8f8980] transition hover:bg-[#f4f1eb] hover:text-[#292722]"
              >
                <MoreHorizontal size={17} />
              </button>

            </div>


            {/* ================================================= */}
            {/* CHAT INFO */}
            {/* ================================================= */}

            <div className="border-b border-[#eee9e2] bg-[#faf8f4] px-5 py-2.5 text-center">

              <span className="text-[9px] text-[#aaa39a]">
                This conversation is part of your
                SkillSwap connection ✨
              </span>

            </div>


            {/* ================================================= */}
            {/* MESSAGES */}
            {/* ================================================= */}

            <div className="flex-1 space-y-3 overflow-y-auto bg-[#f8f6f1] px-4 py-6 sm:px-7">

              {loading ? (

                <LoadingMessages />

              ) : messages.length === 0 ? (

                /* EMPTY CHAT */

                <div className="flex h-full min-h-[400px] items-center justify-center">

                  <div className="text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e9e2ee]">
                      <Sparkles size={17} />
                    </div>

                    <p className="mt-4 text-[14px] font-semibold">
                      Start the conversation ✨
                    </p>

                    <p className="mx-auto mt-1.5 max-w-xs text-[10px] leading-5 text-[#aaa39a]">
                      Say hello, talk about your
                      goals, or plan your first
                      skill exchange.
                    </p>

                  </div>

                </div>

              ) : (

                messages.map((message, index) => {

                  const senderId =
                    message.sender?._id ||
                    message.sender;

                  const isMine =
                    senderId?.toString() ===
                    user?._id?.toString();

                  const previousMessage =
                    messages[index - 1];

                  const previousSender =
                    previousMessage?.sender?._id ||
                    previousMessage?.sender;

                  const sameSender =
                    previousSender?.toString() ===
                    senderId?.toString();

                  return (

                    <div
                      key={
                        message._id ||
                        `${message.createdAt}-${index}`
                      }
                      className={`flex ${
                        isMine
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      <div
                        className={`max-w-[78%] sm:max-w-[65%] ${
                          sameSender
                            ? "mt-[-6px]"
                            : ""
                        }`}
                      >

                        <div
                          className={`rounded-[19px] px-4 py-2.5 text-[11px] leading-5 shadow-[0_2px_8px_rgba(0,0,0,0.025)] ${
                            isMine
                              ? "rounded-br-[6px] bg-[#292722] text-white"
                              : "rounded-bl-[6px] bg-[#e7dfeb] text-[#554d5a]"
                          }`}
                        >
                          {message.text}
                        </div>

                      </div>

                    </div>

                  );
                })

              )}

              <div ref={bottomRef} />

            </div>


            {/* ================================================= */}
            {/* INPUT */}
            {/* ================================================= */}

            <form
              onSubmit={sendMessage}
              className="border-t border-[#eee9e2] bg-[#fffdf9] p-3 sm:p-4"
            >

              <div className="flex items-center gap-2 rounded-[17px] border border-[#e1dcd4] bg-[#f8f6f1] p-1.5 transition focus-within:border-[#cfc7d5] focus-within:bg-white">

                <input
                  ref={inputRef}
                  value={text}
                  onChange={(e) =>
                    setText(e.target.value)
                  }
                  placeholder="Write something..."
                  disabled={sending}
                  className="h-10 min-w-0 flex-1 bg-transparent px-3 text-[11px] outline-none placeholder:text-[#aaa39a]"
                />

                <button
                  type="submit"
                  disabled={
                    !text.trim() ||
                    sending
                  }
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#292722] text-white transition hover:bg-[#3c3934] disabled:cursor-not-allowed disabled:opacity-25"
                >

                  <Send size={14} />

                </button>

              </div>


              <p className="mt-2 text-center text-[8px] text-[#b0aaa2]">
                Share knowledge. Be kind. ✨
              </p>

            </form>

          </div>

        )}

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
/* LOADING */
/* ================================================= */

function LoadingMessages() {
  return (
    <div className="flex min-h-[400px] flex-col justify-center gap-4">

      <div className="flex">
        <div className="h-10 w-[180px] animate-pulse rounded-[18px] bg-[#e9e2ee]" />
      </div>

      <div className="flex justify-end">
        <div className="h-10 w-[220px] animate-pulse rounded-[18px] bg-[#dedbd5]" />
      </div>

      <div className="flex">
        <div className="h-10 w-[145px] animate-pulse rounded-[18px] bg-[#e9e2ee]" />
      </div>

    </div>
  );
}


export default Messages;
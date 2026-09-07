import { useEffect, useRef, useState } from "react";

import {
  ArrowLeft,
  MoreHorizontal,
  Send,
  Sparkles,
  Smile,
  Search,
  CheckCheck,
  Trash2,
  MessageCircle,
} from "lucide-react";

import EmojiPicker from "emoji-picker-react";
import { Link, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Messages() {
  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  const otherUserId = searchParams.get("user");

  const currentUserId = user?._id || user?.id;

  // =========================================================
  // STATE
  // =========================================================

  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);

  const [text, setText] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // =========================================================
  // DELETE STATES
  // =========================================================

  const [messageMenu, setMessageMenu] = useState(null);
  const [showChatMenu, setShowChatMenu] = useState(false);

  const [deletingMessage, setDeletingMessage] = useState(null);
  const [deletingConversation, setDeletingConversation] =
    useState(false);

  // =========================================================
  // REFS
  // =========================================================

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // =========================================================
  // GET CONVERSATIONS
  // =========================================================

  useEffect(() => {
    if (!currentUserId) return;

    fetchConversations();
  }, [currentUserId]);

  const fetchConversations = async () => {
    try {
      setLoading(true);

      const response = await api.get("/messages/conversations");

      const list = response.data?.conversations || [];

      setConversations(list);

      if (otherUserId) {
        const conversation = list.find((item) => {
          const id = item.user?._id || item.user?.id;

          return id?.toString() === otherUserId.toString();
        });

        if (conversation?.user) {
          setOtherUser(conversation.user);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load conversations:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // GET OTHER USER
  // =========================================================

  useEffect(() => {
    if (!otherUserId) {
      setOtherUser(null);
      return;
    }

    fetchOtherUser();
  }, [otherUserId, conversations]);

  const fetchOtherUser = async () => {
    try {
      const existingConversation = conversations.find((item) => {
        const id = item.user?._id || item.user?.id;

        return id?.toString() === otherUserId.toString();
      });

      if (existingConversation?.user) {
        setOtherUser(existingConversation.user);
        return;
      }

      const response = await api.get(`/users/${otherUserId}`);

      const fetchedUser =
        response.data?.user ||
        response.data?.data ||
        response.data;

      if (fetchedUser) {
        setOtherUser(fetchedUser);
      }
    } catch (error) {
      console.error(
        "Failed to load user:",
        error.response?.data || error.message
      );

      setOtherUser(null);
    }
  };

  // =========================================================
  // LOAD MESSAGES
  // =========================================================

  useEffect(() => {
    if (!otherUserId) {
      setMessages([]);
      return;
    }

    fetchMessages();
  }, [otherUserId]);

  const fetchMessages = async () => {
    try {
      setChatLoading(true);

      const response = await api.get(`/messages/${otherUserId}`);

      setMessages(response.data?.messages || []);

      await fetchConversations();

      // Mark incoming messages as read
      await api.put(`/messages/read/${otherUserId}`);
    } catch (error) {
      console.error(
        "Failed to load messages:",
        error.response?.data || error.message
      );
    } finally {
      setChatLoading(false);
    }
  };

  // =========================================================
  // SOCKET.IO
  // =========================================================

  useEffect(() => {
    if (!currentUserId) return;

    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);

      socket.emit("user-online", currentUserId);
    });

    // =======================================================
    // RECEIVE MESSAGE
    // =======================================================

    socket.on("receive-message", (message) => {
      const senderId =
        message.sender?._id ||
        message.sender?.id ||
        message.sender;

      const receiverId =
        message.receiver?._id ||
        message.receiver?.id ||
        message.receiver;

      const isCurrentConversation =
        (senderId?.toString() === otherUserId?.toString() &&
          receiverId?.toString() === currentUserId?.toString()) ||
        (senderId?.toString() === currentUserId?.toString() &&
          receiverId?.toString() === otherUserId?.toString());

      if (isCurrentConversation) {
        setMessages((previous) => {
          const exists = previous.some(
            (item) => item._id === message._id
          );

          if (exists) {
            return previous;
          }

          return [...previous, message];
        });

        // If incoming message, mark it as read
        if (
          senderId?.toString() === otherUserId?.toString()
        ) {
          api
            .put(`/messages/read/${otherUserId}`)
            .then(() => {
              // Update messages locally as read
              setMessages((previous) =>
                previous.map((item) => {
                  const itemSender =
                    item.sender?._id ||
                    item.sender?.id ||
                    item.sender;

                  if (
                    itemSender?.toString() ===
                    otherUserId?.toString()
                  ) {
                    return {
                      ...item,
                      read: true,
                    };
                  }

                  return item;
                })
              );
            })
            .catch((error) =>
              console.error("Read message error:", error)
            );
        }
      }

      fetchConversations();
    });

    // =======================================================
    // MESSAGE READ
    // =======================================================

    socket.on("messages-read", ({ userId }) => {
      if (
        userId?.toString() === otherUserId?.toString()
      ) {
        setMessages((previous) =>
          previous.map((message) => {
            const senderId =
              message.sender?._id ||
              message.sender?.id ||
              message.sender;

            if (
              senderId?.toString() ===
              currentUserId?.toString()
            ) {
              return {
                ...message,
                read: true,
              };
            }

            return message;
          })
        );
      }
    });

    // =======================================================
    // DELETE FOR ME
    // =======================================================

    socket.on(
      "message-deleted-for-me",
      ({ messageId }) => {
        setMessages((previous) =>
          previous.filter(
            (message) => message._id !== messageId
          )
        );

        fetchConversations();
      }
    );

    // =======================================================
    // DELETE FOR EVERYONE
    // =======================================================

    socket.on(
      "message-deleted-for-everyone",
      ({ messageId }) => {
        setMessages((previous) =>
          previous.map((message) => {
            if (message._id !== messageId) {
              return message;
            }

            return {
              ...message,
              deletedForEveryone: true,
              text: "This message was deleted",
            };
          })
        );

        fetchConversations();
      }
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUserId, otherUserId]);

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const sendMessage = async (e) => {
    e?.preventDefault();

    const messageText = text.trim();

    if (!messageText || !otherUserId || sending) {
      return;
    }

    try {
      setSending(true);

      const response = await api.post("/messages", {
        receiver: otherUserId,
        text: messageText,
      });

      const newMessage = response.data?.message;

      if (newMessage) {
        setMessages((previous) => {
          const exists = previous.some(
            (item) => item._id === newMessage._id
          );

          if (exists) {
            return previous;
          }

          return [
            ...previous,
            {
              ...newMessage,
              read: false,
            },
          ];
        });

        socketRef.current?.emit(
          "send-message",
          newMessage
        );
      }

      setText("");
      setShowEmojiPicker(false);

      fetchConversations();

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } catch (error) {
      console.error(
        "Failed to send message:",
        error.response?.data || error.message
      );
    } finally {
      setSending(false);
    }
  };

  // =========================================================
  // DELETE FOR ME
  // =========================================================

  const deleteForMe = async (message) => {
    if (!message?._id) return;

    try {
      setDeletingMessage(message._id);

      await api.delete(
        `/messages/message/${message._id}/me`
      );

      setMessages((previous) =>
        previous.filter(
          (item) => item._id !== message._id
        )
      );

      socketRef.current?.emit(
        "message-deleted-for-me",
        {
          messageId: message._id,
          userId: currentUserId,
        }
      );

      setMessageMenu(null);

      await fetchConversations();
    } catch (error) {
      console.error(
        "Delete for me error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete message"
      );
    } finally {
      setDeletingMessage(null);
    }
  };

  // =========================================================
  // DELETE FOR EVERYONE
  // =========================================================

  const deleteForEveryone = async (message) => {
    if (!message?._id) return;

    const confirmed = window.confirm(
      "Delete this message for everyone?"
    );

    if (!confirmed) return;

    try {
      setDeletingMessage(message._id);

      await api.delete(
        `/messages/message/${message._id}/everyone`
      );

      setMessages((previous) =>
        previous.map((item) => {
          if (item._id !== message._id) {
            return item;
          }

          return {
            ...item,
            deletedForEveryone: true,
            text: "This message was deleted",
          };
        })
      );

      const senderId =
        message.sender?._id ||
        message.sender?.id ||
        message.sender;

      const receiverId =
        message.receiver?._id ||
        message.receiver?.id ||
        message.receiver;

      socketRef.current?.emit(
        "message-deleted-for-everyone",
        {
          messageId: message._id,
          senderId: senderId?.toString(),
          receiverId: receiverId?.toString(),
        }
      );

      setMessageMenu(null);

      await fetchConversations();
    } catch (error) {
      console.error(
        "Delete for everyone error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete message for everyone"
      );
    } finally {
      setDeletingMessage(null);
    }
  };

  // =========================================================
  // DELETE CONVERSATION
  // =========================================================

  const deleteConversation = async () => {
    if (!otherUserId) return;

    const confirmed = window.confirm(
      "Delete this conversation for you?"
    );

    if (!confirmed) return;

    try {
      setDeletingConversation(true);

      await api.delete(
        `/messages/conversation/${otherUserId}`
      );

      setMessages([]);

      setConversations((previous) =>
        previous.filter((conversation) => {
          const id =
            conversation.user?._id ||
            conversation.user?.id;

          return (
            id?.toString() !==
            otherUserId.toString()
          );
        })
      );

      setOtherUser(null);
      setShowChatMenu(false);
      setSearchParams({});
    } catch (error) {
      console.error(
        "Delete conversation error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete conversation"
      );
    } finally {
      setDeletingConversation(false);
    }
  };

  // =========================================================
  // EMOJI
  // =========================================================

  const handleEmojiClick = (emojiData) => {
    setText(
      (previous) =>
        previous + emojiData.emoji
    );

    inputRef.current?.focus();
  };

  // =========================================================
  // ENTER
  // =========================================================

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  // =========================================================
  // AUTO SCROLL
  // =========================================================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (date) => {
    if (!date) return "";

    const messageDate = new Date(date);
    const now = new Date();

    if (
      messageDate.toDateString() ===
      now.toDateString()
    ) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const yesterday = new Date();

    yesterday.setDate(
      yesterday.getDate() - 1
    );

    if (
      messageDate.toDateString() ===
      yesterday.toDateString()
    ) {
      return "Yesterday";
    }

    return messageDate.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
    });
  };

  // =========================================================
  // INITIALS
  // =========================================================

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U"
    );
  };

  // =========================================================
  // FILTER CONVERSATIONS
  // =========================================================

  const filteredConversations =
    conversations.filter((conversation) => {
      const name =
        conversation.user?.name || "";

      const username =
        conversation.user?.username || "";

      return (
        name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        username
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    });

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="h-dvh overflow-hidden bg-[var(--background)] text-[var(--text)] transition-colors duration-300">



      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto h-[calc(100dvh-76px)] w-full max-w-[1250px] px-3 py-3 sm:px-6 lg:px-8">

        {/* ===================================================
            MESSAGES CONTAINER
        =================================================== */}

        <div className="flex h-full min-h-0 w-full overflow-hidden rounded-[24px] border border-[var(--border-light)] bg-[var(--surface)] shadow-[var(--shadow-lg)]">

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside
            className={`h-full w-full shrink-0 border-r border-[var(--border-light)] bg-[var(--surface)] md:w-[330px] ${
              otherUserId
                ? "hidden md:flex md:flex-col"
                : "flex flex-col"
            }`}
          >

            {/* SIDEBAR HEADER */}

            <div className="shrink-0 border-b border-[var(--border-light)] px-5 py-4">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    TimeSwap
                  </p>

                  <h1 className="mt-1 text-[22px] font-bold tracking-[-0.04em]">
                    Messages
                  </h1>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--lavender-soft)] text-[var(--purple-strong)]">
                  <MessageCircle size={15} />
                </div>

              </div>

              {/* SEARCH */}

              <div className="mt-4 flex items-center gap-2 rounded-[14px] border border-[var(--border-light)] bg-[var(--surface-soft)] px-3">

                <Search
                  size={14}
                  className="shrink-0 text-[var(--text-muted)]"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search conversations..."
                  className="h-10 min-w-0 flex-1 border-0 bg-transparent text-[10px] text-[var(--text)] outline-none"
                />

              </div>
            </div>

            {/* CONVERSATION LIST */}

            <div className="min-h-0 flex-1 overflow-y-auto">

              {loading ? (

                <ConversationLoading />

              ) : filteredConversations.length === 0 ? (

                <div className="flex h-full items-center justify-center px-8">

                  <div className="text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--lavender-soft)] text-[var(--purple-strong)]">
                      <Sparkles size={18} />
                    </div>

                    <p className="mt-4 text-[14px] font-bold">
                      No conversations yet
                    </p>

                    <p className="mt-2 text-[10px] leading-5 text-[var(--text-muted)]">
                      Start a conversation with someone from your active swaps.
                    </p>

                    <Link
                      to="/swaps"
                      className="mt-5 inline-flex rounded-full bg-[var(--pink-strong)] px-5 py-2.5 text-[10px] font-semibold text-white"
                    >
                      View my swaps
                    </Link>

                  </div>

                </div>

              ) : (

                filteredConversations.map(
                  (conversation) => {

                    const person =
                      conversation.user;

                    const personId =
                      person?._id ||
                      person?.id;

                    const active =
                      personId?.toString() ===
                      otherUserId?.toString();

                    return (
                      <button
                        key={personId}
                        type="button"
                        onClick={() =>
                          setSearchParams({
                            user: personId,
                          })
                        }
                        className={`group flex w-full items-center gap-3 border-b border-[var(--border-light)] px-5 py-3.5 text-left transition ${
                          active
                            ? "bg-[var(--pink-soft)]"
                            : "hover:bg-[var(--surface-soft)]"
                        }`}
                      >

                        {/* AVATAR */}

                        <div className="relative shrink-0">

                          {person?.profilePicture ? (

                            <img
                              src={person.profilePicture}
                              alt=""
                              className="h-10 w-10 rounded-full object-cover ring-2 ring-[var(--surface)]"
                            />

                          ) : (

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--lavender-soft)] text-[10px] font-bold text-[var(--purple-strong)]">
                              {getInitials(
                                person?.name
                              )}
                            </div>

                          )}

                        </div>

                        {/* DETAILS */}

                        <div className="min-w-0 flex-1">

                          <div className="flex items-center justify-between gap-2">

                            <h3 className="truncate text-[11px] font-bold">
                              {person?.name ||
                                "Unknown user"}
                            </h3>

                            <span className="shrink-0 text-[7px] text-[var(--text-muted)]">
                              {formatTime(
                                conversation.lastMessageTime
                              )}
                            </span>

                          </div>

                          <div className="mt-1 flex items-center justify-between gap-2">

                            <p className="truncate text-[9px] text-[var(--text-secondary)]">
                              {conversation.lastMessage ||
                                "Start chatting..."}
                            </p>

                            {conversation.unreadCount >
                              0 && (
                              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--pink-strong)] px-1 text-[7px] font-bold text-white">
                                {conversation.unreadCount >
                                99
                                  ? "99+"
                                  : conversation.unreadCount}
                              </span>
                            )}

                          </div>

                        </div>

                      </button>
                    );
                  }
                )
              )}

            </div>
          </aside>

          {/* =================================================
              CHAT AREA
          ================================================= */}

          <section
            className={`relative flex h-full min-h-0 min-w-0 flex-1 flex-col ${
              otherUserId
                ? "flex"
                : "hidden md:flex"
            }`}
          >

            {!otherUserId ? (

              /* EMPTY CHAT */

              <div className="flex min-h-0 flex-1 items-center justify-center bg-[var(--background-2)]">

                <div className="max-w-sm px-6 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--lavender-soft)] text-[var(--purple-strong)] shadow-[var(--shadow-sm)]">
                    <MessageCircle size={22} />
                  </div>

                  <p className="mt-5 text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    TimeSwap messages
                  </p>

                  <h2 className="mt-2 text-[24px] font-bold tracking-[-0.045em] text-[var(--text)]">
                    Your conversations
                  </h2>

                  <p className="mt-3 text-[10px] leading-5 text-[var(--text-secondary)]">
                    Select a conversation to start chatting.
                  </p>

                </div>

              </div>

            ) : (

              <>

                {/* =================================================
                    CHAT HEADER
                ================================================= */}

                <div className="flex shrink-0 items-center justify-between border-b border-[var(--border-light)] bg-[var(--surface)] px-4 py-3.5 sm:px-6">

                  <div className="flex min-w-0 items-center gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        setSearchParams({})
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] md:hidden"
                    >
                      <ArrowLeft size={15} />
                    </button>

                    <div className="relative shrink-0">

                      {otherUser?.profilePicture ? (

                        <img
                          src={
                            otherUser.profilePicture
                          }
                          alt=""
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-[var(--border-light)]"
                        />

                      ) : (

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--lavender-soft)] text-[10px] font-bold text-[var(--purple-strong)]">
                          {getInitials(
                            otherUser?.name
                          )}
                        </div>

                      )}

                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--surface)] bg-[var(--green)]" />

                    </div>

                    <div className="min-w-0">

                      <h2 className="truncate text-[13px] font-bold text-[var(--text)]">
                        {otherUser?.name ||
                          "User"}
                      </h2>

                      <div className="mt-0.5 flex items-center gap-1.5">

                        <span className="truncate text-[8px] text-[var(--text-muted)]">
                          @{otherUser?.username ||
                            "user"}
                        </span>

                        <span className="text-[var(--text-muted)]">
                          ·
                        </span>

                        <span className="text-[8px] text-[var(--green)]">
                          Active swap
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* CHAT MENU */}

                  <div className="relative">

                    <button
                      type="button"
                      onClick={() =>
                        setShowChatMenu(
                          (previous) =>
                            !previous
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-soft)]"
                    >
                      <MoreHorizontal size={17} />
                    </button>

                    {showChatMenu && (

                      <div className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-[var(--shadow-lg)]">

                        <button
                          type="button"
                          onClick={
                            deleteConversation
                          }
                          disabled={
                            deletingConversation
                          }
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[10px] font-semibold text-[#c95f6d] transition hover:bg-[var(--pink-soft)] disabled:opacity-50"
                        >

                          <Trash2 size={14} />

                          {deletingConversation
                            ? "Deleting..."
                            : "Delete conversation"}

                        </button>

                      </div>
                    )}

                  </div>
                </div>

                {/* =================================================
                    INFO BAR
                ================================================= */}

                <div className="shrink-0 border-b border-[var(--border-light)] bg-[var(--yellow-soft)] px-5 py-2 text-center">

                  <span className="text-[8px] font-medium text-[var(--text-secondary)]">
                    This conversation is part of your TimeSwap connection ✨
                  </span>

                </div>

                {/* =================================================
                    MESSAGES
                    ONLY THIS AREA SCROLLS
                ================================================= */}

                <div
                  onClick={() => {
                    setMessageMenu(null);
                    setShowChatMenu(false);
                  }}
                  className="relative min-h-0 flex-1 overflow-y-auto bg-[var(--background-2)] px-4 py-5 sm:px-7"
                >

                  {chatLoading ? (

                    <LoadingMessages />

                  ) : messages.length === 0 ? (

                    <div className="flex h-full min-h-[300px] items-center justify-center">

                      <div className="text-center">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--lavender-soft)] text-[var(--purple-strong)]">
                          <Sparkles size={17} />
                        </div>

                        <p className="mt-4 text-[14px] font-bold text-[var(--text)]">
                          Start the conversation ✨
                        </p>

                        <p className="mx-auto mt-1.5 max-w-xs text-[10px] leading-5 text-[var(--text-secondary)]">
                          Say hello, talk about your goals, or plan your first skill exchange.
                        </p>

                      </div>

                    </div>

                  ) : (

                    <div className="space-y-3">

                      {messages.map(
                        (message, index) => {

                          const senderId =
                            message.sender?._id ||
                            message.sender?.id ||
                            message.sender;

                          const isMine =
                            senderId?.toString() ===
                            currentUserId?.toString();

                          const previousMessage =
                            messages[index - 1];

                          const previousSender =
                            previousMessage?.sender?._id ||
                            previousMessage?.sender?.id ||
                            previousMessage?.sender;

                          const sameSender =
                            previousSender?.toString() ===
                            senderId?.toString();

                          const isDeleted =
                            message.deletedForEveryone;

                          return (

                            <div
                              key={
                                message._id ||
                                `${message.createdAt}-${index}`
                              }
                              className={`group flex ${
                                isMine
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >

                              <div
                                className={`relative max-w-[78%] sm:max-w-[65%] ${
                                  sameSender
                                    ? "mt-[-6px]"
                                    : ""
                                }`}
                              >

                                {/* MESSAGE MENU */}

                                {!isDeleted && (

                                  <div
                                    className={`absolute ${
                                      isMine
                                        ? "-right-9"
                                        : "-left-9"
                                    } top-1/2 z-20 -translate-y-1/2`}
                                  >

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();

                                        setMessageMenu(
                                          messageMenu ===
                                            message._id
                                            ? null
                                            : message._id
                                        );
                                      }}
                                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] opacity-0 shadow-[var(--shadow-sm)] transition group-hover:opacity-100 hover:bg-[var(--surface-soft)]"
                                    >
                                      <MoreHorizontal size={14} />
                                    </button>

                                    {messageMenu ===
                                      message._id && (

                                      <div
                                        onClick={(e) =>
                                          e.stopPropagation()
                                        }
                                        className={`absolute ${
                                          isMine
                                            ? "right-0"
                                            : "left-0"
                                        } top-8 z-50 w-44 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-[var(--shadow-lg)]`}
                                      >

                                        {/* DELETE FOR ME */}

                                        <button
                                          type="button"
                                          disabled={
                                            deletingMessage ===
                                            message._id
                                          }
                                          onClick={() =>
                                            deleteForMe(
                                              message
                                            )
                                          }
                                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[10px] font-semibold text-[var(--text)] hover:bg-[var(--surface-soft)] disabled:opacity-50"
                                        >

                                          <Trash2 size={13} />

                                          Delete for me

                                        </button>

                                        {/* DELETE FOR EVERYONE */}

                                        {isMine && (

                                          <button
                                            type="button"
                                            disabled={
                                              deletingMessage ===
                                              message._id
                                            }
                                            onClick={() =>
                                              deleteForEveryone(
                                                message
                                              )
                                            }
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[10px] font-semibold text-[#c95f6d] hover:bg-[var(--pink-soft)] disabled:opacity-50"
                                          >

                                            <Trash2 size={13} />

                                            Delete for everyone

                                          </button>

                                        )}

                                      </div>
                                    )}

                                  </div>
                                )}

                                {/* =================================================
                                    MESSAGE BUBBLE
                                ================================================= */}

                                <div
                                  className={`relative rounded-[18px] border px-3.5 py-2 text-[11px] leading-5 shadow-[var(--shadow-sm)] ${
                                    isDeleted
                                      ? "border-[var(--border)] bg-[var(--surface-soft)] italic text-[var(--text-muted)]"
                                      : isMine
                                      ? "rounded-br-[5px] border-[var(--purple)] bg-[var(--purple)] text-white"
                                      : "rounded-bl-[5px] border-[var(--pink)] bg-[var(--pink)] text-white"
                                  }`}
                                >

                                  <div
                                    className={`whitespace-pre-wrap break-words font-medium ${
                                      isDeleted
                                        ? "font-normal italic"
                                        : ""
                                    }`}
                                  >

                                    {isDeleted
                                      ? "This message was deleted"
                                      : message.text}

                                  </div>

                                  {/* =================================================
                                      TIME + DOUBLE TICK
                                  ================================================= */}

                                  <div
                                    className={`mt-1 flex items-center justify-end gap-1 ${
                                      isDeleted
                                        ? "text-[var(--text-muted)]"
                                        : "text-white/80"
                                    }`}
                                  >

                                    <span className="text-[7px] font-medium">
                                      {formatTime(
                                        message.createdAt
                                      )}
                                    </span>

                                    {/* 
                                      DELIVERED:
                                      Double grey/white tick

                                      SEEN:
                                      Double colored tick
                                    */}

                                    {isMine &&
                                      !isDeleted && (

                                        <CheckCheck
                                          size={11}
                                          strokeWidth={2.7}
                                          className={
                                            message.read
                                              ? "text-[var(--yellow)]"
                                              : "text-white/75"
                                          }
                                        />

                                      )}

                                  </div>

                                </div>

                              </div>

                            </div>
                          );
                        }
                      )}

                      <div ref={bottomRef} />

                    </div>
                  )}

                </div>

                {/* =================================================
                    EMOJI PICKER
                ================================================= */}

                {showEmojiPicker && (

                  <div className="absolute bottom-[82px] right-4 z-50 overflow-hidden rounded-2xl shadow-2xl">

                    <EmojiPicker
                      onEmojiClick={
                        handleEmojiClick
                      }
                      width={320}
                      height={380}
                      searchDisabled={false}
                      skinTonesDisabled
                      previewConfig={{
                        showPreview: false,
                      }}
                    />

                  </div>
                )}

                {/* =================================================
                    INPUT
                    ALWAYS STAYS AT BOTTOM
                ================================================= */}

                <form
                  onSubmit={sendMessage}
                  className="shrink-0 border-t border-[var(--border-light)] bg-[var(--surface)] p-2.5 sm:p-3"
                >

                  <div className="flex items-center gap-2 rounded-[16px] border border-[var(--border)] bg-[var(--surface-soft)] p-1.5">

                    {/* EMOJI */}

                    <button
                      type="button"
                      onClick={() =>
                        setShowEmojiPicker(
                          (previous) =>
                            !previous
                        )
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-[var(--text-muted)] hover:bg-[var(--lavender-soft)] hover:text-[var(--purple-strong)]"
                    >
                      <Smile size={16} />
                    </button>

                    {/* INPUT */}

                    <input
                      ref={inputRef}
                      value={text}
                      onChange={(e) =>
                        setText(e.target.value)
                      }
                      onKeyDown={
                        handleKeyDown
                      }
                      onFocus={() =>
                        setShowEmojiPicker(
                          false
                        )
                      }
                      placeholder="Write something..."
                      disabled={sending}
                      className="h-9 min-w-0 flex-1 border-0 bg-transparent px-2 text-[10px] text-[var(--text)] outline-none"
                    />

                    {/* SEND */}

                    <button
                      type="submit"
                      disabled={
                        !text.trim() ||
                        sending
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[var(--purple)] text-white transition hover:scale-[1.03] hover:bg-[var(--purple-strong)] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Send size={13} />
                    </button>

                  </div>

                  <p className="mt-1 text-center text-[7px] text-[var(--text-muted)]">
                    Share knowledge. Be kind. ✨
                  </p>

                </form>

              </>
            )}

          </section>

        </div>
      </main>
    </div>
  );
}

// =========================================================
// CONVERSATION LOADING
// =========================================================

function ConversationLoading() {
  return (
    <div className="space-y-1 p-3">

      {[1, 2, 3, 4].map((item) => (

        <div
          key={item}
          className="flex items-center gap-3 rounded-xl p-3"
        >

          <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--lavender-soft)]" />

          <div className="flex-1">

            <div className="h-3 w-24 animate-pulse rounded bg-[var(--lavender-soft)]" />

            <div className="mt-2 h-2 w-40 animate-pulse rounded bg-[var(--border-light)]" />

          </div>

        </div>
      ))}

    </div>
  );
}

// =========================================================
// MESSAGE LOADING
// =========================================================

function LoadingMessages() {
  return (
    <div className="flex min-h-[300px] flex-col justify-center gap-4">

      <div className="flex">
        <div className="h-9 w-[180px] animate-pulse rounded-[18px] bg-[var(--pink)]" />
      </div>

      <div className="flex justify-end">
        <div className="h-9 w-[220px] animate-pulse rounded-[18px] bg-[var(--purple)]" />
      </div>

      <div className="flex">
        <div className="h-9 w-[145px] animate-pulse rounded-[18px] bg-[var(--pink)]" />
      </div>

    </div>
  );
}

export default Messages;
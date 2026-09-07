import {
    Check,
    CheckCheck,
    MoreHorizontal,
    Send,
    Smile,
  } from "lucide-react";
  
  function ChatBox({
    messages = [],
    text = "",
    setText,
    onSend,
    onEmojiClick,
    currentUserId,
    inputRef,
    disabled = false,
  }) {
    const getSenderId = (message) => {
      return (
        message.sender?._id ||
        message.sender?.id ||
        message.sender
      );
    };
  
    const formatTime = (date) => {
      if (!date) return "";
  
      const messageDate = new Date(date);
  
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };
  
    return (
      <div className="flex h-full min-h-0 flex-col">
        {/* MESSAGES */}
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[var(--background-2)] px-4 py-5 sm:px-7">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-[11px] text-[var(--text-muted)]">
                Start the conversation ✨
              </p>
            </div>
          ) : (
            messages.map((message, index) => {
              const senderId = getSenderId(message);
  
              const isMine =
                senderId?.toString() ===
                currentUserId?.toString();
  
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
                  <div className="relative max-w-[78%] sm:max-w-[65%]">
                    {/* MENU */}
                    {!isDeleted && (
                      <button
                        type="button"
                        className={`absolute top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] opacity-0 shadow-[var(--shadow-sm)] transition group-hover:opacity-100 ${
                          isMine
                            ? "-left-9"
                            : "-right-9"
                        }`}
                      >
                        <MoreHorizontal size={13} />
                      </button>
                    )}
  
                    {/* BUBBLE */}
                    <div
                      className={`rounded-[19px] border px-4 py-2.5 shadow-[var(--shadow-sm)] ${
                        isDeleted
                          ? "border-[var(--border)] bg-[var(--surface-soft)] italic text-[var(--text-muted)]"
                          : isMine
                          ? "rounded-br-[6px] border-[var(--purple)] bg-[var(--purple)] text-white"
                          : "rounded-bl-[6px] border-[var(--pink)] bg-[var(--pink-soft)] text-[var(--text)]"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words text-[11px] leading-5">
                        {isDeleted
                          ? "This message was deleted"
                          : message.text}
                      </p>
  
                      <div className="mt-1 flex items-center justify-end gap-1">
                        <span
                          className={`text-[7px] ${
                            isMine
                              ? "text-white/80"
                              : "text-[var(--text-muted)]"
                          }`}
                        >
                          {formatTime(
                            message.createdAt
                          )}
                        </span>
  
                        {/* READ RECEIPT */}
                        {isMine && !isDeleted && (
                          message.read ? (
                            <CheckCheck
                              size={11}
                              strokeWidth={2.5}
                              className="text-[var(--pink-strong)]"
                            />
                          ) : (
                            <Check
                              size={11}
                              strokeWidth={2.5}
                              className="text-white/80"
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
  
        {/* INPUT */}
        <form
          onSubmit={onSend}
          className="shrink-0 border-t border-[var(--border-light)] bg-[var(--surface)] p-3 sm:p-4"
        >
          <div className="flex items-center gap-2 rounded-[17px] border border-[var(--border)] bg-[var(--surface-soft)] p-1.5">
            <button
              type="button"
              onClick={onEmojiClick}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[13px] text-[var(--text-muted)] transition hover:bg-[var(--lavender-soft)] hover:text-[var(--purple-strong)]"
            >
              <Smile size={17} />
            </button>
  
            <input
              ref={inputRef}
              value={text}
              onChange={(e) =>
                setText?.(e.target.value)
              }
              placeholder="Write something..."
              disabled={disabled}
              className="h-10 min-w-0 flex-1 bg-transparent px-2 text-[11px] text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
            />
  
            <button
              type="submit"
              disabled={!text.trim() || disabled}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[13px] bg-[var(--purple)] text-white transition hover:bg-[var(--purple-strong)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Send size={14} />
            </button>
          </div>
  
          <p className="mt-2 text-center text-[8px] text-[var(--text-muted)]">
            Share knowledge. Be kind. ✨
          </p>
        </form>
      </div>
    );
  }
  
  export default ChatBox;
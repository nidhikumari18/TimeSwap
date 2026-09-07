import {
    ArrowRight,
    BookOpen,
    GraduationCap,
    Star,
  } from "lucide-react";
  
  function SwapCard({
    user,
    teachSkill,
    learnSkill,
    status = "pending",
    rating,
    onClick,
    actionLabel,
  }) {
    const statusStyles = {
      pending:
        "bg-[var(--yellow-soft)] text-[var(--yellow-dark)] border-[var(--yellow)]",
  
      accepted:
        "bg-[var(--mint-soft)] text-[var(--green-strong)] border-[var(--mint)]",
  
      rejected:
        "bg-[var(--pink-soft)] text-[var(--pink-strong)] border-[var(--pink)]",
  
      completed:
        "bg-[var(--blue-soft)] text-[var(--text)] border-[var(--blue)]",
    };
  
    const initials =
      user?.name
        ?.split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U";
  
    return (
      <div className="rounded-[24px] border border-[var(--border-light)] bg-[var(--card)] p-5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
        {/* USER */}
        <div className="flex items-center gap-3">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt=""
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--lavender-soft)] text-[11px] font-bold text-[var(--purple-strong)]">
              {initials}
            </div>
          )}
  
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[12px] font-bold text-[var(--text)]">
              {user?.name || "TimeSwap member"}
            </h3>
  
            {user?.username && (
              <p className="mt-0.5 text-[9px] text-[var(--text-muted)]">
                @{user.username}
              </p>
            )}
          </div>
  
          <span
            className={`rounded-full border px-2.5 py-1 text-[8px] font-bold capitalize ${
              statusStyles[status] ||
              statusStyles.pending
            }`}
          >
            {status}
          </span>
        </div>
  
        {/* SKILLS */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="rounded-[17px] border border-[var(--lavender)] bg-[var(--lavender-soft)] p-3">
            <div className="flex items-center gap-2">
              <GraduationCap
                size={14}
                className="text-[var(--purple-strong)]"
              />
  
              <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[var(--purple-strong)]">
                They teach
              </span>
            </div>
  
            <p className="mt-2 text-[10px] font-semibold text-[var(--text)]">
              {teachSkill || "Skill not specified"}
            </p>
          </div>
  
          <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--text-muted)]">
            <ArrowRight size={13} />
          </div>
  
          <div className="rounded-[17px] border border-[var(--blue)] bg-[var(--blue-soft)] p-3">
            <div className="flex items-center gap-2">
              <BookOpen
                size={14}
                className="text-[var(--text)]"
              />
  
              <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                You learn
              </span>
            </div>
  
            <p className="mt-2 text-[10px] font-semibold text-[var(--text)]">
              {learnSkill || "Skill not specified"}
            </p>
          </div>
        </div>
  
        {/* BOTTOM */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--border-light)] pt-4">
          <div className="flex items-center gap-1.5">
            <Star
              size={12}
              className="text-[var(--yellow-dark)]"
              fill="currentColor"
            />
  
            <span className="text-[9px] font-semibold text-[var(--text-secondary)]">
              {rating || "New"}
            </span>
          </div>
  
          {actionLabel && (
            <button
              type="button"
              onClick={onClick}
              className="cursor-pointer rounded-full bg-[var(--purple-strong)] px-4 py-2 text-[9px] font-bold text-white transition hover:bg-[var(--pink-strong)]"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    );
  }
  
  export default SwapCard;
import {
  BookOpen,
  GraduationCap,
  X,
} from "lucide-react";

function SkillCard({
  title,
  skills = [],
  type = "teach",
  variant,
  editing = false,
  inputValue = "",
  setInputValue,
  onAdd,
  onRemove,
}) {
  const isTeach =
    variant === "purple"
      ? true
      : variant === "blue"
      ? false
      : type === "teach";

  return (
    <div
      className={`rounded-[22px] border p-5 shadow-[var(--shadow-sm)] ${
        isTeach
          ? "border-[var(--lavender)] bg-[var(--lavender-soft)]"
          : "border-[var(--blue)] bg-[var(--blue-soft)]"
      }`}
    >

      {/* HEADER */}

      <div className="mb-4 flex items-center gap-2">

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--surface)] shadow-[var(--shadow-sm)] ${
            isTeach
              ? "text-[var(--purple-strong)]"
              : "text-[var(--blue)]"
          }`}
        >
          {isTeach ? (
            <GraduationCap size={14} />
          ) : (
            <BookOpen size={14} />
          )}
        </div>

        <span className="text-[10px] font-bold text-[var(--text)]">
          {title}
        </span>

      </div>

      {/* SKILLS */}

      <div className="flex flex-wrap gap-2">

        {skills.length > 0 ? (
          skills.map((skill) => (

            <span
              key={skill}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--surface)] px-3 py-2 text-[9px] font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-sm)]"
            >

              {skill}

              {editing && (
                <button
                  type="button"
                  onClick={() => onRemove?.(skill)}
                  className="cursor-pointer text-[var(--text-muted)] transition hover:text-[var(--pink-strong)]"
                  aria-label={`Remove ${skill}`}
                >
                  <X size={11} />
                </button>
              )}

            </span>

          ))
        ) : (
          <span className="text-[10px] text-[var(--text-muted)]">
            No skills added yet.
          </span>
        )}

      </div>

      {/* EDIT MODE */}

      {editing && (
        <div className="mt-4 flex gap-2">

          <input
            value={inputValue}
            onChange={(e) =>
              setInputValue?.(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAdd?.();
              }
            }}
            placeholder="Add a skill..."
            className="h-10 min-w-0 flex-1 rounded-[13px] border border-[var(--border)] bg-[var(--surface)] px-3 text-[10px] text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--purple-strong)]"
          />

          <button
            type="button"
            onClick={onAdd}
            className="cursor-pointer rounded-[13px] bg-[var(--purple-strong)] px-4 text-[10px] font-bold text-white transition hover:bg-[var(--pink-strong)]"
          >
            Add
          </button>

        </div>
      )}

    </div>
  );
}

export default SkillCard;
import { TrendingUp } from "lucide-react";

function StatCard({
  label,
  value,
  description,
  icon,
  variant = "pink",
}) {
  const variants = {
    pink: {
      wrapper:
        "border-[var(--pink)] bg-[var(--pink-soft)]",
      icon:
        "bg-[var(--pink)] text-[var(--pink-strong)]",
    },

    purple: {
      wrapper:
        "border-[var(--lavender)] bg-[var(--lavender-soft)]",
      icon:
        "bg-[var(--lavender)] text-[var(--purple-strong)]",
    },

    blue: {
      wrapper:
        "border-[var(--blue)] bg-[var(--blue-soft)]",
      icon:
        "bg-[var(--blue)] text-[var(--text)]",
    },

    mint: {
      wrapper:
        "border-[var(--mint)] bg-[var(--mint-soft)]",
      icon:
        "bg-[var(--mint)] text-[var(--green-strong)]",
    },

    peach: {
      wrapper:
        "border-[var(--peach)] bg-[var(--peach-soft)]",
      icon:
        "bg-[var(--peach)] text-[var(--peach-dark)]",
    },
  };

  const currentVariant =
    variants[variant] || variants.pink;

  return (
    <div
      className={`rounded-[22px] border p-5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] ${currentVariant.wrapper}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${currentVariant.icon}`}
        >
          {icon || <TrendingUp size={16} />}
        </div>

        <span className="text-[28px] font-bold tracking-[-0.05em] text-[var(--text)]">
          {value}
        </span>
      </div>

      <p className="mt-4 text-[10px] font-bold text-[var(--text)]">
        {label}
      </p>

      {description && (
        <p className="mt-1 text-[8px] text-[var(--text-secondary)]">
          {description}
        </p>
      )}
    </div>
  );
}

export default StatCard;
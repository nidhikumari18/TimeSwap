import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      title={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      className="
        group
        relative
        flex
        h-10
        w-10
        items-center
        justify-center
        overflow-hidden
        rounded-full
        border
        border-[var(--border)]
        bg-[var(--card)]
        text-[var(--text)]
        shadow-[var(--shadow-sm)]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-[var(--shadow-md)]
        active:scale-95
      "
    >
      {/* Soft hover glow */}
      <span
        className="
          absolute
          inset-0
          rounded-full
          bg-[var(--primary)]
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-15
        "
      />

      {/* Icon */}
      <span className="relative z-10 transition-transform duration-300 group-hover:rotate-12">
        {isDark ? (
          <Sun
            size={17}
            strokeWidth={2}
          />
        ) : (
          <Moon
            size={17}
            strokeWidth={2}
          />
        )}
      </span>
    </button>
  );
}

export default ThemeToggle;
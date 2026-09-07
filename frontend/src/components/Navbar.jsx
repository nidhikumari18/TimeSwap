import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Compass,
  Repeat2,
  MessageCircle,
  Coins,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-light)] bg-[var(--surface)]/90 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link
          to="/dashboard"
          className="group flex items-center gap-3"
        >
          <div
            className="
              flex h-11 w-11 items-center justify-center
              rounded-[15px]
              bg-[var(--logo-bg)]
              text-[var(--logo-text)]
              shadow-[var(--shadow-sm)]
              transition-all duration-300
              group-hover:-rotate-3
              group-hover:scale-105
            "
          >
            <Sparkles size={18} strokeWidth={2.2} />
          </div>

          <div className="hidden sm:block">
            <span
              className="
                block text-[18px] font-bold
                tracking-[-0.045em]
                text-[var(--text)]
              "
            >
              TimeSwap
            </span>

            <span
              className="
                block text-[8px] font-semibold
                uppercase tracking-[0.18em]
                text-[var(--text-muted)]
              "
            >
              Give time. Gain skills.
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-1.5 md:flex">
          <NavItem
            to="/dashboard"
            label="Home"
            icon={<Home size={15} />}
            active={isActive("/dashboard")}
            color="peach"
          />

          <NavItem
            to="/explore"
            label="Explore"
            icon={<Compass size={15} />}
            active={isActive("/explore")}
            color="mint"
          />

          <NavItem
            to="/swaps"
            label="My Swaps"
            icon={<Repeat2 size={15} />}
            active={isActive("/swaps")}
            color="lavender"
          />

          <NavItem
            to="/messages"
            label="Messages"
            icon={<MessageCircle size={15} />}
            active={isActive("/messages")}
            color="yellow"
          />
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* CREDITS */}
          <div
            className="
              hidden sm:flex items-center gap-2
              rounded-full
              border border-[var(--border-light)]
              bg-[var(--yellow-soft)]
              px-3.5 py-2
              shadow-[var(--shadow-sm)]
            "
          >
            <div
              className="
                flex h-7 w-7 items-center justify-center
                rounded-full
                bg-[var(--yellow)]
                text-[var(--yellow-dark)]
              "
            >
              <Coins size={13} strokeWidth={2.3} />
            </div>

            <div className="leading-none">
              <span
                className="
                  block text-[7px] font-bold
                  uppercase tracking-[0.14em]
                  text-[var(--text-muted)]
                "
              >
                Credits
              </span>

              <span
                className="
                  mt-1 block text-[12px] font-bold
                  text-[var(--text)]
                "
              >
                {user?.credits ?? 0}
              </span>
            </div>
          </div>

          {/* THEME */}
          <ThemeToggle />

          {/* PROFILE */}
          <Link
            to="/profile"
            className="
              group
              flex h-11 w-11
              items-center justify-center
              overflow-hidden
              rounded-full
              border-2 border-[var(--surface)]
              bg-[var(--lavender)]
              text-xs font-bold
              text-[var(--purple-dark)]
              shadow-[var(--shadow-sm)]
              ring-1 ring-[var(--border-light)]
              transition-all duration-300
              hover:-translate-y-0.5
              hover:shadow-[var(--shadow-md)]
            "
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt=""
                className="
                  h-full w-full object-cover
                  transition duration-300
                  group-hover:scale-105
                "
              />
            ) : (
              getInitials(user?.name)
            )}
          </Link>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      <div
        className="
          flex
          border-t border-[var(--border-light)]
          bg-[var(--surface)]
          px-2 py-2
          md:hidden
        "
      >
        <MobileNavItem
          to="/dashboard"
          label="Home"
          icon={<Home size={17} />}
          active={isActive("/dashboard")}
        />

        <MobileNavItem
          to="/explore"
          label="Explore"
          icon={<Compass size={17} />}
          active={isActive("/explore")}
        />

        <MobileNavItem
          to="/swaps"
          label="Swaps"
          icon={<Repeat2 size={17} />}
          active={isActive("/swaps")}
        />

        <MobileNavItem
          to="/messages"
          label="Messages"
          icon={<MessageCircle size={17} />}
          active={isActive("/messages")}
        />

        <MobileNavItem
          to="/profile"
          label="Profile"
          icon={<Sparkles size={17} />}
          active={isActive("/profile")}
        />
      </div>
    </header>
  );
}

/* =========================================================
   DESKTOP NAV ITEM
========================================================= */

function NavItem({
  to,
  label,
  icon,
  active,
  color,
}) {
  const activeColors = {
    peach: `
      bg-[var(--peach)]
      text-[var(--peach-dark)]
    `,

    mint: `
      bg-[var(--mint)]
      text-[var(--mint-dark)]
    `,

    lavender: `
      bg-[var(--lavender)]
      text-[var(--purple-dark)]
    `,

    yellow: `
      bg-[var(--yellow-soft)]
      text-[var(--yellow-dark)]
    `,
  };

  return (
    <Link
      to={to}
      className={`
        group
        flex items-center gap-2
        rounded-full
        px-4 py-2.5
        text-[11px] font-semibold
        transition-all duration-200

        ${
          active
            ? `${activeColors[color]} shadow-[var(--shadow-sm)]`
            : `
              text-[var(--text-secondary)]
              hover:bg-[var(--surface-soft)]
              hover:text-[var(--text)]
              hover:-translate-y-0.5
            `
        }
      `}
    >
      <span className="transition-transform duration-200 group-hover:scale-110">
        {icon}
      </span>

      <span>{label}</span>
    </Link>
  );
}

/* =========================================================
   MOBILE NAV ITEM
========================================================= */

function MobileNavItem({
  to,
  label,
  icon,
  active,
}) {
  return (
    <Link
      to={to}
      className={`
        flex flex-1
        flex-col
        items-center
        justify-center
        gap-1.5
        rounded-[15px]
        py-2
        text-[8px]
        font-semibold
        transition-all duration-200

        ${
          active
            ? `
              bg-[var(--peach-soft)]
              text-[var(--primary-dark)]
              shadow-[var(--shadow-sm)]
            `
            : `
              text-[var(--text-muted)]
              hover:bg-[var(--surface-soft)]
              hover:text-[var(--text)]
            `
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default Navbar;
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Heart,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Explore() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [requestingId, setRequestingId] = useState(null);
  const [successUser, setSuccessUser] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      // Use the correct /users/explore endpoint
      const response = await api.get("/users/explore");

      const peopleList = response.data.users || [];

      setUsers(
        Array.isArray(peopleList)
          ? peopleList.filter(
              (person) =>
                person._id !== user?._id
            )
          : []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Couldn't load the SkillSwap community."
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateMatch = (person) => {
    const myLearning =
      user?.skillsToLearn || [];

    const theirTeaching =
      person?.skillsToTeach || [];

    if (
      myLearning.length === 0 ||
      theirTeaching.length === 0
    ) {
      return 0;
    }

    const matches = myLearning.filter(
      (skill) =>
        theirTeaching.some(
          (theirSkill) =>
            theirSkill.toLowerCase() ===
            skill.toLowerCase()
        )
    );

    return Math.round(
      (matches.length /
        myLearning.length) *
        100
    );
  };

  const sendRequest = async (person) => {
    try {
      setRequestingId(person._id);
      setSuccessUser("");

      // Select the first skill they teach
      const skillTheyTeach =
        person.skillsToTeach?.[0] ||
        "Skill exchange";

      // Select the first skill we can teach them
      const skillTheyWant =
        user?.skillsToTeach?.[0] ||
        "My skill";

      // Send request with correct field names matching SwapRequest model
      await api.post("/swaps/request", {
        receiverId: person._id,
        skillTheyTeach,
        skillTheyWant,
        message: `Hi ${person.name}! I'd love to learn ${skillTheyTeach} from you and share ${skillTheyWant} with you. 🌷`,
      });

      setSuccessUser(person.name);

    } catch (error) {
      setSuccessUser(
        error.response?.data?.message ||
          "Couldn't send the request."
      );
    } finally {
      setRequestingId(null);
    }
  };


  /* ---------------- FILTER USERS ---------------- */

  const filteredUsers = Array.isArray(users)
    ? users
      .filter((person) => {

        if (activeFilter === "Teaching") {
          return (
            person.skillsToTeach?.length > 0
          );
        }

        if (activeFilter === "Learning") {
          return (
            person.skillsToLearn?.length > 0
          );
        }

        return true;
      })
      .filter((person) => {

        if (!search) return true;

        const value = search.toLowerCase().trim();

        const name =
          person.name?.toLowerCase() || "";

        const username =
          person.username?.toLowerCase() ||
          "";

        const teach =
          person.skillsToTeach
            ?.join(" ")
            .toLowerCase() || "";

        const learn =
          person.skillsToLearn
            ?.join(" ")
            .toLowerCase() || "";

        return (
          name.includes(value) ||
          username.includes(value) ||
          teach.includes(value) ||
          learn.includes(value)
        );
      })
      .sort(
        (a, b) =>
          calculateMatch(b) -
          calculateMatch(a)
      )
    : [];


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

            <span className="text-[16px] font-semibold tracking-[-0.03em]">
              SkillSwap
            </span>

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
              active
            />

            <NavItem
              to="/swaps"
              text="My swaps"
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


      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="mx-auto max-w-[1320px] px-5 py-7 lg:px-8 lg:py-9">


        {/* ================================================= */}
        {/* HERO */}
        {/* ================================================= */}

        <section className="relative overflow-hidden rounded-[28px] bg-[#ddd5e8] px-6 py-8 sm:px-9 sm:py-10">

          {/* decorative circles */}

          <div className="pointer-events-none absolute -right-12 -top-28 h-72 w-72 rounded-full border-[25px] border-[#eeeaf3]/70" />

          <div className="pointer-events-none absolute right-28 top-20 h-48 w-48 rounded-full border-[17px] border-[#cfc4dc]/70" />

          <div className="relative max-w-[700px]">

            {/* LABEL */}

            <div className="inline-flex items-center gap-2 rounded-full bg-[#eee9f2] px-3 py-1.5 text-[10px] font-medium text-[#6d6473]">

              <Sparkles size={11} />

              Skill community

            </div>


            {/* TITLE */}

            <h1 className="mt-5 text-[34px] font-semibold leading-[1.05] tracking-[-0.055em] sm:text-[48px]">

              Find someone
              <br />

              who knows what you don't. ✦

            </h1>


            <p className="mt-4 max-w-[560px] text-[13px] leading-6 text-[#6d6771]">

              Learn something new from someone in the
              community — and give your own skills in return.

            </p>

          </div>

        </section>


        {/* ================================================= */}
        {/* SEARCH AREA */}
        {/* ================================================= */}

        <section className="relative z-10 -mt-5 px-3 sm:px-6">

          <div className="rounded-[22px] border border-[#ded8cf] bg-white p-2 shadow-[0_10px_35px_rgba(0,0,0,0.05)]">

            <div className="flex items-center gap-3 px-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1ece5]">

                <Search
                  size={15}
                  className="text-[#777168]"
                />

              </div>


              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search people, skills or interests..."
                className="h-11 min-w-0 flex-1 bg-transparent text-[12px] outline-none placeholder:text-[#aaa39a]"
              />


              {search && (
                <button
                  onClick={() =>
                    setSearch("")
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f3f0eb] text-[#777168]"
                >
                  <X size={13} />
                </button>
              )}

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* FILTERS */}
        {/* ================================================= */}

        <section className="mt-7 flex items-center justify-between gap-4">

          <div className="flex gap-2 overflow-x-auto pb-1">

            <FilterButton
              label="All people"
              active={activeFilter === "All"}
              onClick={() =>
                setActiveFilter("All")
              }
            />

            <FilterButton
              label="People teaching"
              active={
                activeFilter === "Teaching"
              }
              onClick={() =>
                setActiveFilter("Teaching")
              }
            />

            <FilterButton
              label="People learning"
              active={
                activeFilter === "Learning"
              }
              onClick={() =>
                setActiveFilter("Learning")
              }
            />

          </div>


          <div className="hidden shrink-0 items-center gap-2 rounded-full border border-[#e1dbd3] bg-white px-3 py-2 text-[10px] text-[#8d877e] sm:flex">

            <Users size={12} />

            {filteredUsers.length} people

          </div>

        </section>


        {/* ================================================= */}
        {/* SUCCESS MESSAGE */}
        {/* ================================================= */}

        {successUser && (
          <div className="mt-4 flex items-center gap-3 rounded-[17px] border border-[#d8dfca] bg-[#e9eedf] px-4 py-3 text-[11px] text-[#59624c]">

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/70">
              <Check size={13} />
            </div>

            <span>
              {successUser.includes("Couldn't") ||
              successUser.includes("already")
                ? successUser
                : `Swap request sent to ${successUser}! ✨`}
            </span>

            <button
              onClick={() =>
                setSuccessUser("")
              }
              className="ml-auto"
            >
              <X size={13} />
            </button>

          </div>
        )}


        {/* ================================================= */}
        {/* PEOPLE SECTION */}
        {/* ================================================= */}

        <section className="mt-8">

          <div className="mb-5 flex items-end justify-between">

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#aaa39a]">
                Discover
              </p>

              <h2 className="mt-1 text-[24px] font-semibold tracking-[-0.04em]">
                People you might like
              </h2>

              <p className="mt-1 text-[11px] text-[#99938a]">
                Best matches appear first
              </p>

            </div>

          </div>


          {/* ================================================= */}
          {/* LOADING */}
          {/* ================================================= */}

          {loading && (
            <div className="grid gap-4 md:grid-cols-2">

              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-[360px] animate-pulse rounded-[24px] border border-[#e6e0d8] bg-white"
                  />
                )
              )}

            </div>
          )}


          {/* ================================================= */}
          {/* ERROR */}
          {/* ================================================= */}

          {!loading && error && (
            <div className="rounded-[24px] border border-[#e3ddd5] bg-white px-6 py-14 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eee8df]">
                <Users size={18} />
              </div>

              <h3 className="mt-5 text-[15px] font-semibold">
                Something went wrong
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-[#99938a]">
                {error}
              </p>

              <button
                onClick={fetchUsers}
                className="mt-5 rounded-full bg-[#292722] px-5 py-2.5 text-[10px] font-medium text-white"
              >
                Try again
              </button>

            </div>
          )}


          {/* ================================================= */}
          {/* EMPTY */}
          {/* ================================================= */}

          {!loading &&
            !error &&
            filteredUsers.length === 0 && (
              <div className="rounded-[24px] border border-[#e3ddd5] bg-white px-6 py-16 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e9e2ee]">
                  <Search size={19} />
                </div>

                <h3 className="mt-5 text-[16px] font-semibold">
                  No one found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-[#99938a]">
                  Try another name or skill,
                  or clear your filters.
                </p>

                <button
                  onClick={() => {
                    setSearch("");
                    setActiveFilter("All");
                  }}
                  className="mt-5 rounded-full border border-[#ded8cf] px-5 py-2.5 text-[10px] font-medium"
                >
                  Clear filters
                </button>

              </div>
            )}


          {/* ================================================= */}
          {/* USER GRID */}
          {/* ================================================= */}

          {!loading &&
            !error &&
            filteredUsers.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">

                {filteredUsers.map(
                  (person, index) => (
                    <UserCard
                      key={person._id}
                      person={person}
                      match={calculateMatch(
                        person
                      )}
                      requesting={
                        requestingId ===
                        person._id
                      }
                      onRequest={() =>
                        sendRequest(person)
                      }
                      index={index}
                    />
                  )
                )}

              </div>
            )}

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
  active = false,
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
/* FILTER BUTTON */
/* ================================================= */

function FilterButton({
  label,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2.5 text-[10px] font-medium transition ${
        active
          ? "bg-[#292722] text-white"
          : "border border-[#ded8cf] bg-white text-[#777168] hover:bg-[#f1ede7]"
      }`}
    >
      {label}
    </button>
  );
}


/* ================================================= */
/* USER CARD */
/* ================================================= */

function UserCard({
  person,
  match,
  requesting,
  onRequest,
  index,
}) {

  const initials =
    person.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";


  const cardBackgrounds = [
    "bg-[#fffdf8]",
    "bg-[#fcf8fb]",
    "bg-[#f9faf5]",
    "bg-[#faf8f4]",
  ];


  const avatarBackgrounds = [
    "bg-[#f2d967]",
    "bg-[#e8b6d5]",
    "bg-[#b8c79c]",
    "bg-[#c9d5e7]",
  ];


  return (
    <article
      className={`group relative overflow-hidden rounded-[24px] border border-[#e3ddd5] ${cardBackgrounds[index % 4]} p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.05)]`}
    >

      {/* ================================================= */}
      {/* TOP */}
      {/* ================================================= */}

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${avatarBackgrounds[index % 4]} text-sm font-semibold`}
          >
            {initials}
          </div>

          <div>

            <h3 className="text-[14px] font-semibold tracking-[-0.02em]">
              {person.name}
            </h3>

            <p className="mt-0.5 text-[10px] text-[#a19a91]">
              @{person.username}
            </p>

          </div>

        </div>


        {/* MATCH */}

        <div className="flex flex-col items-end">

          <div className="flex items-center gap-1.5">

            <Heart
              size={12}
              className="text-[#8b7c8d]"
            />

            <span className="text-[11px] font-semibold">
              {match}%
            </span>

          </div>

          <span className="mt-0.5 text-[8px] uppercase tracking-[0.15em] text-[#aaa39a]">
            match
          </span>

        </div>

      </div>


      {/* ================================================= */}
      {/* MATCH BAR */}
      {/* ================================================= */}

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#e9e4dc]">

        <div
          className="h-full rounded-full bg-[#292722] transition-all duration-500"
          style={{
            width: `${Math.max(
              match,
              4
            )}%`,
          }}
        />

      </div>


      {/* ================================================= */}
      {/* BIO */}
      {/* ================================================= */}

      <p className="mt-5 min-h-[40px] text-[11px] leading-5 text-[#777168]">

        {person.bio ||
          "Open to sharing skills, learning something new and making meaningful connections."}

      </p>


      {/* ================================================= */}
      {/* SKILLS */}
      {/* ================================================= */}

      <div className="mt-5 grid grid-cols-2 gap-3">

        {/* TEACH */}

        <div className="rounded-[16px] bg-[#f2eee7] p-3">

          <div className="flex items-center gap-1.5">

            <BookOpen
              size={11}
              className="text-[#777168]"
            />

            <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#9a938a]">
              Teaches
            </p>

          </div>

          <div className="mt-2 flex flex-wrap gap-1">

            {(person.skillsToTeach || [])
              .slice(0, 3)
              .map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white px-2 py-1 text-[9px] font-medium"
                >
                  {skill}
                </span>
              ))}

          </div>

        </div>


        {/* LEARN */}

        <div className="rounded-[16px] bg-[#eee7f1] p-3">

          <div className="flex items-center gap-1.5">

            <Sparkles
              size={11}
              className="text-[#777168]"
            />

            <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#9a938a]">
              Learning
            </p>

          </div>

          <div className="mt-2 flex flex-wrap gap-1">

            {(person.skillsToLearn || [])
              .slice(0, 3)
              .map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white/80 px-2 py-1 text-[9px] font-medium text-[#675d6d]"
                >
                  {skill}
                </span>
              ))}

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* ACTION */}
      {/* ================================================= */}

      <button
        onClick={onRequest}
        disabled={requesting}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#292722] py-3 text-[10px] font-medium text-white transition hover:bg-[#3c3934] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
      >

        {requesting
          ? "Sending request..."
          : "Request a skill swap"}

        {!requesting && (
          <ArrowUpRight size={13} />
        )}

      </button>


      {/* ================================================= */}
      {/* SMALL FOOTER */}
      {/* ================================================= */}

      <div className="mt-3 flex items-center justify-center gap-1.5 text-[8px] text-[#aaa39a]">

        <Sparkles size={9} />

        SkillSwap community

      </div>

    </article>
  );
}


export default Explore;

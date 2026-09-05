import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Heart,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await api.get("/users/matches");

      const data = response.data;

      const people =
        data.users ||
        data.matches ||
        data ||
        [];

      setMatches(
        Array.isArray(people)
          ? people
              .filter(
                (person) =>
                  person._id !== user?._id
              )
              .slice(0, 4)
          : []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const firstName =
    user?.name?.split(" ")[0] || "there";

  const teaching =
    user?.skillsToTeach || [];

  const learning =
    user?.skillsToLearn || [];


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


          {/* NAVIGATION */}

          <nav className="hidden items-center gap-8 md:flex">

            <NavItem
              to="/dashboard"
              text="Home"
              active
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

      <main className="mx-auto max-w-[1320px] px-5 py-8 lg:px-8 lg:py-10">


        {/* ================================================= */}
        {/* WELCOME */}
        {/* ================================================= */}

        <section className="relative grid overflow-hidden rounded-[30px] bg-[#ddd5e8] lg:grid-cols-[1fr_360px]">

          {/* LEFT */}

          <div className="relative px-6 py-9 sm:px-10 sm:py-11 lg:px-12 lg:py-14">

            <div className="inline-flex items-center gap-2 rounded-full bg-[#eee9f2] px-3 py-1.5 text-[9px] font-medium text-[#6d6473]">

              <Sparkles size={11} />

              Your skill-sharing space

            </div>


            <h1 className="mt-6 max-w-[650px] text-[37px] font-semibold leading-[0.98] tracking-[-0.06em] sm:text-[52px]">

              Hi, {firstName}.

              <br />

              What will you
              <br />

              learn today?

            </h1>


            <p className="mt-5 max-w-[500px] text-[12px] leading-6 text-[#706974] sm:text-[13px]">

              Everyone knows something you don't.
              Find someone who can teach you —
              and share something you're good at
              in return.

            </p>


            <div className="mt-7 flex flex-wrap gap-2">

              <Link
                to="/explore"
                className="inline-flex items-center gap-2 rounded-full bg-[#292722] px-5 py-3 text-[10px] font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#3b3833]"
              >
                Find a skill
                <ArrowRight size={13} />
              </Link>


              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-full bg-white/60 px-5 py-3 text-[10px] font-medium transition hover:bg-white"
              >
                Edit my skills
              </Link>

            </div>

          </div>


          {/* RIGHT VISUAL */}

          <div className="relative hidden min-h-[320px] overflow-hidden lg:block">

            {/* circles */}

            <div className="absolute -right-20 -top-20 h-[310px] w-[310px] rounded-full border-[28px] border-[#eeeaf3]/70" />

            <div className="absolute right-14 top-16 h-[205px] w-[205px] rounded-full border-[20px] border-[#cfc4dc]/70" />


            {/* floating card */}

            <div className="absolute right-12 top-[86px] w-[220px] rotate-[3deg] rounded-[22px] bg-[#fffdf9] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">

              <div className="flex items-center justify-between">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0df91] text-xs font-semibold">
                  ✦
                </div>

                <span className="text-[8px] uppercase tracking-[0.15em] text-[#aaa39a]">
                  Skill match
                </span>

              </div>


              <p className="mt-5 text-[10px] uppercase tracking-[0.15em] text-[#aaa39a]">
                Someone can teach you
              </p>

              <h3 className="mt-1 text-[20px] font-semibold tracking-[-0.04em]">
                {learning[0] ||
                  "something new"}
              </h3>

              <div className="mt-4 flex items-center gap-2 text-[9px] text-[#888178]">

                <Users size={11} />

                People nearby can help

              </div>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* YOUR SKILLS */}
        {/* ================================================= */}

        <section className="mt-5 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">


          {/* LEARN */}

          <div className="rounded-[24px] border border-[#e3ddd5] bg-[#fffdf9] p-6 sm:p-7">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#aaa39a]">
                  Your curiosity
                </p>

                <h2 className="mt-1 text-[23px] font-semibold tracking-[-0.045em]">
                  Things you want to learn
                </h2>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8ddea]">
                <Heart size={15} />
              </div>

            </div>


            {learning.length === 0 ? (

              <EmptySkill
                text="Add something you're curious about."
              />

            ) : (

              <div className="mt-6 flex flex-wrap gap-2">

                {learning.map(
                  (skill, index) => (
                    <SkillPill
                      key={skill}
                      skill={skill}
                      index={index}
                    />
                  )
                )}

              </div>

            )}


            <Link
              to="/profile"
              className="mt-7 inline-flex items-center gap-1 text-[10px] font-medium text-[#777168] transition hover:text-[#292722]"
            >
              Manage your learning list
              <ArrowRight size={12} />
            </Link>

          </div>


          {/* TEACH */}

          <div className="rounded-[24px] bg-[#dde5d2] p-6 sm:p-7">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#78816d]">
                  Your contribution
                </p>

                <h2 className="mt-1 text-[22px] font-semibold tracking-[-0.045em]">
                  Things you teach
                </h2>

              </div>

              <BookOpen
                size={17}
                className="text-[#707966]"
              />

            </div>


            {teaching.length === 0 ? (

              <p className="mt-6 text-[11px] leading-5 text-[#78816d]">
                Add skills you can share
                with the community.
              </p>

            ) : (

              <div className="mt-6 flex flex-wrap gap-1.5">

                {teaching.map(
                  (skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-white/70 px-3 py-2 text-[10px] font-medium"
                    >
                      {skill}
                    </span>
                  )
                )}

              </div>

            )}


            <Link
              to="/profile"
              className="mt-6 inline-flex items-center gap-1 text-[10px] font-medium text-[#59604f]"
            >
              Update skills
              <ArrowRight size={12} />
            </Link>

          </div>

        </section>


        {/* ================================================= */}
        {/* COMMUNITY */}
        {/* ================================================= */}

        <section className="mt-10">

          <div className="flex items-end justify-between">

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#aaa39a]">
                Community
              </p>

              <h2 className="mt-1 text-[27px] font-semibold tracking-[-0.05em]">
                People worth meeting
              </h2>

              <p className="mt-1 text-[11px] text-[#99938a]">
                People whose skills might fit yours.
              </p>

            </div>


            <Link
              to="/explore"
              className="hidden items-center gap-1 text-[10px] font-medium text-[#777168] sm:flex"
            >
              Explore everyone
              <ChevronRight size={13} />
            </Link>

          </div>


          {/* PEOPLE */}

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {loading ? (

              <>
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </>

            ) : matches.length === 0 ? (

              <EmptyCommunity />

            ) : (

              matches.map(
                (person, index) => (
                  <PersonCard
                    key={person._id}
                    person={person}
                    index={index}
                  />
                )
              )

            )}

          </div>

        </section>


        {/* ================================================= */}
        {/* BOTTOM QUOTE */}
        {/* ================================================= */}

        <section className="mt-10 overflow-hidden rounded-[25px] bg-[#292722] px-6 py-10 text-white sm:px-10">

          <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">

            <div>

              <p className="text-[9px] uppercase tracking-[0.2em] text-[#aaa59d]">
                The idea behind SkillSwap
              </p>

              <h2 className="mt-3 max-w-[600px] text-[27px] font-medium leading-tight tracking-[-0.04em] sm:text-[34px]">
                Everyone knows something
                you don't know yet.
              </h2>

            </div>


            <Link
              to="/explore"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-[10px] font-medium text-[#292722] transition hover:-translate-y-0.5"
            >
              Meet the community
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
/* SKILL PILL */
/* ================================================= */

function SkillPill({
  skill,
  index,
}) {

  const backgrounds = [
    "bg-[#f0df91]",
    "bg-[#e8ddea]",
    "bg-[#dde5d2]",
    "bg-[#eee4d9]",
  ];

  return (
    <span
      className={`rounded-full px-4 py-2.5 text-[10px] font-medium ${backgrounds[index % backgrounds.length]}`}
    >
      {skill}
    </span>
  );
}


/* ================================================= */
/* PERSON CARD */
/* ================================================= */

function PersonCard({
  person,
  index,
}) {

  const initials =
    person.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";


  const accents = [
    "bg-[#f0df91]",
    "bg-[#e8b6d5]",
    "bg-[#b9c99e]",
    "bg-[#c9d6e7]",
  ];


  return (
    <Link
      to="/explore"
      className="group rounded-[23px] border border-[#e3ddd5] bg-[#fffdf9] p-4 transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(0,0,0,0.06)]"
    >

      {/* AVATAR */}

      <div className="flex items-center justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-semibold ${accents[index % accents.length]}`}
        >
          {initials}
        </div>

        <ArrowUpRight
          size={14}
          className="text-[#aaa39a] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />

      </div>


      {/* NAME */}

      <div className="mt-5">

        <h3 className="text-[14px] font-semibold tracking-[-0.02em]">
          {person.name}
        </h3>

        <p className="mt-0.5 text-[9px] text-[#aaa39a]">
          @{person.username}
        </p>

      </div>


      {/* TEACH */}

      <div className="mt-5">

        <p className="text-[8px] font-semibold uppercase tracking-[0.17em] text-[#aaa39a]">
          Can teach
        </p>

        <div className="mt-2 flex flex-wrap gap-1">

          {(person.skillsToTeach || [])
            .slice(0, 3)
            .map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-[#f0ece5] px-2.5 py-1.5 text-[9px]"
              >
                {skill}
              </span>
            ))}

        </div>

      </div>


      {/* LEARN */}

      <div className="mt-4">

        <p className="text-[8px] font-semibold uppercase tracking-[0.17em] text-[#aaa39a]">
          Wants to learn
        </p>

        <div className="mt-2 flex flex-wrap gap-1">

          {(person.skillsToLearn || [])
            .slice(0, 2)
            .map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-[#eee7f1] px-2.5 py-1.5 text-[9px] text-[#675d6d]"
              >
                {skill}
              </span>
            ))}

        </div>

      </div>


      {/* FOOTER */}

      <div className="mt-5 flex items-center justify-between border-t border-[#eee9e1] pt-3">

        <span className="text-[8px] text-[#aaa39a]">
          Skill match
        </span>

        <span className="text-[10px] font-semibold">
          ✦
        </span>

      </div>

    </Link>
  );
}


/* ================================================= */
/* EMPTY SKILL */
/* ================================================= */

function EmptySkill({ text }) {
  return (
    <div className="mt-6 rounded-[18px] bg-[#f7f4ee] px-5 py-6">

      <p className="text-[11px] leading-5 text-[#99938a]">
        {text}
      </p>

    </div>
  );
}


/* ================================================= */
/* EMPTY COMMUNITY */
/* ================================================= */

function EmptyCommunity() {
  return (
    <div className="col-span-full rounded-[23px] border border-[#e3ddd5] bg-white px-6 py-14 text-center">

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e9e2ee]">
        <Users size={17} />
      </div>

      <h3 className="mt-4 text-[14px] font-semibold">
        Your community is waiting.
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-[10px] leading-5 text-[#99938a]">
        Add some skills to your profile
        and we'll find people for you.
      </p>

      <Link
        to="/profile"
        className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#292722] px-5 py-2.5 text-[10px] text-white"
      >
        Add my skills
        <ArrowRight size={12} />
      </Link>

    </div>
  );
}


/* ================================================= */
/* SKELETON */
/* ================================================= */

function Skeleton() {
  return (
    <div className="h-[290px] animate-pulse rounded-[23px] bg-[#eeeae3]" />
  );
}


export default Dashboard;
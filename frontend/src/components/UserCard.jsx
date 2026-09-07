function UserCard({
    person,
    getInitials,
    onRequest,
    onMessage,
  }) {
    return (
      <article
        className="
          group
          overflow-hidden
          rounded-[24px]
          border
          border-[var(--border)]
          bg-[var(--card)]
          shadow-[var(--shadow-sm)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-[var(--pink)]
          hover:shadow-[var(--shadow-md)]
        "
      >
        {/* TOP COLOUR STRIP */}
        <div
          className="
            relative
            h-[82px]
            bg-[var(--pink-soft)]
          "
        >
          <div
            className="
              absolute
              -right-8
              -top-10
              h-28
              w-28
              rounded-full
              bg-[var(--yellow)]
              opacity-50
              blur-2xl
            "
          />
  
          <div
            className="
              absolute
              bottom-[-25px]
              left-[45%]
              h-20
              w-20
              rounded-full
              bg-[var(--lavender)]
              opacity-50
              blur-2xl
            "
          />
  
          {/* AVAILABLE */}
          <div
            className="
              absolute
              right-3
              top-3
              flex
              items-center
              gap-1.5
              rounded-full
              border
              border-white/60
              bg-white/80
              px-2.5
              py-1
              text-[8px]
              font-bold
              text-[#493d45]
              backdrop-blur-sm
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[var(--green)]
              "
            />
  
            Available
          </div>
  
          {/* PROFILE */}
          <div className="absolute bottom-[-25px] left-5">
            {person.profilePicture ? (
              <img
                src={person.profilePicture}
                alt=""
                className="
                  h-[58px]
                  w-[58px]
                  rounded-[18px]
                  border-[3px]
                  border-[var(--card)]
                  object-cover
                  shadow-[var(--shadow-sm)]
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-[58px]
                  w-[58px]
                  items-center
                  justify-center
                  rounded-[18px]
                  border-[3px]
                  border-[var(--card)]
                  bg-[var(--purple)]
                  text-sm
                  font-bold
                  text-white
                  shadow-[var(--shadow-sm)]
                "
              >
                {getInitials(person.name)}
              </div>
            )}
          </div>
        </div>
  
        {/* CONTENT */}
        <div className="p-4 pt-9">
  
          {/* NAME */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3
                className="
                  truncate
                  text-[14px]
                  font-bold
                  tracking-[-0.02em]
                "
              >
                {person.name || "TimeSwap member"}
              </h3>
  
              <p
                className="
                  mt-0.5
                  truncate
                  text-[9px]
                  text-[var(--text-muted)]
                "
              >
                @{person.username || "user"}
              </p>
            </div>
  
            {/* RATING */}
            <div
              className="
                flex
                shrink-0
                items-center
                gap-1
                rounded-full
                border
                border-[var(--yellow)]
                bg-[var(--yellow-soft)]
                px-2
                py-1
                text-[8px]
                font-bold
                text-[var(--yellow-dark)]
              "
            >
              ★ {Number(person.rating || 0).toFixed(1)}
            </div>
          </div>
  
          {/* BIO */}
          <p
            className="
              mt-2
              line-clamp-2
              min-h-[28px]
              text-[9px]
              leading-4
              text-[var(--text-secondary)]
            "
          >
            {person.bio ||
              "Ready to exchange knowledge and learn something new."}
          </p>
  
          {/* SKILLS */}
          <div className="mt-3 space-y-2">
  
            {/* CAN TEACH */}
            <div
              className="
                rounded-[15px]
                border
                border-[var(--peach)]
                bg-[var(--peach-soft)]
                px-3
                py-2.5
              "
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span
                  className="
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.1em]
                    text-[var(--peach-dark)]
                  "
                >
                  ✦ Can teach
                </span>
  
                <span
                  className="
                    text-[8px]
                    font-semibold
                    text-[var(--text-muted)]
                  "
                >
                  {(person.skillsToTeach || []).length}
                </span>
              </div>
  
              <div className="flex flex-wrap gap-1.5">
                {(person.skillsToTeach || [])
                  .slice(0, 3)
                  .map((skill) => (
                    <span
                      key={skill}
                      className="
                        rounded-full
                        border
                        border-white/60
                        bg-white/60
                        px-2
                        py-1
                        text-[8px]
                        font-semibold
                        text-[var(--text)]
                      "
                    >
                      {skill}
                    </span>
                  ))}
  
                {(!person.skillsToTeach ||
                  person.skillsToTeach.length === 0) && (
                  <span className="text-[8px] text-[var(--text-muted)]">
                    No skills added
                  </span>
                )}
              </div>
            </div>
  
            {/* WANTS TO LEARN */}
            <div
              className="
                rounded-[15px]
                border
                border-[var(--mint)]
                bg-[var(--mint-soft)]
                px-3
                py-2.5
              "
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span
                  className="
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.1em]
                    text-[var(--green-strong)]
                  "
                >
                  ♡ Wants to learn
                </span>
  
                <span
                  className="
                    text-[8px]
                    font-semibold
                    text-[var(--text-muted)]
                  "
                >
                  {(person.skillsToLearn || []).length}
                </span>
              </div>
  
              <div className="flex flex-wrap gap-1.5">
                {(person.skillsToLearn || [])
                  .slice(0, 3)
                  .map((skill) => (
                    <span
                      key={skill}
                      className="
                        rounded-full
                        border
                        border-white/60
                        bg-white/60
                        px-2
                        py-1
                        text-[8px]
                        font-semibold
                        text-[var(--text)]
                      "
                    >
                      {skill}
                    </span>
                  ))}
  
                {(!person.skillsToLearn ||
                  person.skillsToLearn.length === 0) && (
                  <span className="text-[8px] text-[var(--text-muted)]">
                    No skills added
                  </span>
                )}
              </div>
            </div>
          </div>
  
          {/* ACTIONS */}
          <div className="mt-3 grid grid-cols-[1fr_40px] gap-2">
  
            <button
              type="button"
              onClick={onRequest}
              className="
                flex
                h-9
                items-center
                justify-center
                gap-1.5
                rounded-[12px]
                bg-[var(--purple)]
                px-3
                text-[8px]
                font-bold
                text-white
                transition-all
                hover:-translate-y-0.5
                hover:bg-[var(--purple-strong)]
                hover:shadow-[var(--shadow-sm)]
              "
            >
              Request swap
              <ArrowRight size={11} />
            </button>
  
            <button
              type="button"
              onClick={onMessage}
              title="Message"
              className="
                flex
                h-9
                w-10
                items-center
                justify-center
                rounded-[12px]
                border
                border-[var(--border)]
                bg-[var(--surface-soft)]
                text-[var(--text)]
                transition-all
                hover:-translate-y-0.5
                hover:border-[var(--pink)]
                hover:bg-[var(--pink-soft)]
                hover:text-[var(--pink-strong)]
              "
            >
              <MessageCircle size={14} />
            </button>
  
          </div>
  
        </div>
      </article>
    );
  }
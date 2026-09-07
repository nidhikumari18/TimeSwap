function Footer() {
    return (
      <footer className="border-t border-[var(--border-light)] bg-[var(--surface)]">
        <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-6 lg:px-8">
  
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
  
            {/* BRAND */}
            <div className="max-w-sm">
              <div className="flex items-center gap-3">
  
                <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[var(--purple)] text-lg text-white shadow-[var(--shadow-sm)]">
                  ✦
                </div>
  
                <div>
                  <h3 className="text-[16px] font-bold tracking-[-0.03em] text-[var(--text)]">
                    TimeSwap
                  </h3>
  
                  <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                    Give time. Gain skills.
                  </p>
                </div>
  
              </div>
  
              <p className="mt-4 text-[12px] leading-5 text-[var(--text-secondary)]">
                Exchange your time, share your skills, and learn something new
                from people around you.
              </p>
            </div>
  
            {/* SOCIAL MEDIA */}
            <div className="flex flex-col gap-3">
  
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Connect with us
              </p>
  
              <div className="flex items-center gap-2">
  
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-light)] bg-[var(--surface-soft)] text-[var(--text-secondary)] text-sm font-bold transition-all duration-200 hover:-translate-y-1 hover:bg-[var(--lavender-soft)] hover:text-[var(--purple-strong)]"
                >
                  GH
                </a>
  
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-light)] bg-[var(--surface-soft)] text-[var(--text-secondary)] text-sm font-bold transition-all duration-200 hover:-translate-y-1 hover:bg-[var(--pink-soft)] hover:text-[var(--pink-strong)]"
                >
                  IG
                </a>
  
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-light)] bg-[var(--surface-soft)] text-[var(--text-secondary)] text-sm font-bold transition-all duration-200 hover:-translate-y-1 hover:bg-[var(--blue-soft)]"
                >
                  in
                </a>
  
              </div>
            </div>
          </div>
  
          {/* BOTTOM */}
          <div className="mt-8 flex flex-col gap-3 border-t border-[var(--border-light)] pt-5 text-[10px] text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
  
            <p>
              © {new Date().getFullYear()} TimeSwap. All rights reserved.
            </p>
  
            <p>
              Made with <span className="text-[var(--pink-strong)]">♥</span>{" "}
              for skill sharing.
            </p>
  
          </div>
  
        </div>
      </footer>
    );
  }
  
  export default Footer;
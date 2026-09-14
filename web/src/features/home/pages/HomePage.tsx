function Grid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
      />

      <div className="absolute right-[-14%] top-[18%] h-[620px] w-[620px] rounded-full border border-foreground/[0.12] motion-safe:animate-[spin_80s_linear_infinite]" />

      <div className="absolute right-[-5%] top-[26%] h-[460px] w-[460px] rounded-full border border-foreground/[0.09] motion-safe:animate-[spin_60s_linear_infinite_reverse]" />

      <div className="absolute right-[4%] top-[34%] h-[300px] w-[300px] rounded-full border border-foreground/[0.08]" />

      <div className="absolute right-[10%] top-[49%] h-px w-[38%] bg-foreground/[0.1]" />

      <div className="absolute right-[28%] top-[24%] h-[52%] w-px bg-foreground/[0.08]" />

      <div className="absolute right-[8%] top-[49%] h-2 w-2 rounded-full bg-foreground" />

      <div className="absolute bottom-8 right-8 hidden font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground sm:block">
        00 / 01 / 01
      </div>
    </div>
  )
}

function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Grid />

      <header className="relative z-10 mx-auto flex w-full max-w-[1400px] items-center justify-between px-8 py-7 lg:px-12">
        <a
          href="/"
          className="text-xl font-semibold tracking-[-0.05em]"
        >
          LDGR
        </a>

        <a
          href="/login"
          className="text-sm font-medium tracking-tight transition-opacity hover:opacity-50"
        >
          Sign In
        </a>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-[1400px] items-center px-8 pb-24 lg:px-12">
        <div className="max-w-[1050px]">
          <p className="mb-8 text-[12px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Financial Infrastructure
          </p>

          <h1 className="text-[clamp(3.5rem,7.5vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.07em]">
            Built to Record.
            <br />
            Built to Trust.
            <br />
            Built for Scale.
          </h1>

          <p className="mt-10 max-w-[650px] text-base leading-7 text-muted-foreground sm:text-lg">
            A modern double-entry accounting engine for businesses
            that need financial infrastructure they can trust.
          </p>

          <div className="mt-10 flex items-center gap-6">
            <a
              href="/register"
              className="inline-flex h-12 items-center rounded-full bg-foreground px-7 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
            >
              Get Started
            </a>

            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Double-entry by design
            </span>
          </div>
        </div>
      </section>

      <div
        aria-hidden="true"
        className="absolute bottom-8 left-8 z-10 text-[10px] uppercase tracking-[0.25em] text-muted-foreground lg:left-12"
      >
        LDGR / Infrastructure
      </div>
    </main>
  )
}

export default HomePage

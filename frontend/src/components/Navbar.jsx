function Navbar({ search, setSearch }) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-3.5">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 via-cyan-900/30 to-slate-950 text-2xl shadow-[0_0_25px_rgba(6,182,212,0.25)] backdrop-blur-md">
          <span className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">🛡️</span>
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500 border border-slate-950" />
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white font-display">
              PhishShield <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">AI</span>
            </h1>
            <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-cyan-300 font-mono-code">
              v2.0
            </span>
          </div>

          <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mt-0.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
            Real-Time Threat Detection & Defense System
          </p>
        </div>
      </div>

      {/* Action Area: Live Badge & Search Input */}
      <div className="flex items-center gap-3">
        {/* Live Engine Status */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-gradient-to-r from-emerald-500/10 to-teal-500/5 px-3.5 py-2 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[11px] font-bold tracking-wider text-emerald-300 uppercase font-mono-code">
            HYBRID AI ACTIVE
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 sm:w-80">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search scanned URL or domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 py-2.5 pl-10 pr-9 text-sm text-slate-100 placeholder-slate-500 backdrop-blur-xl transition duration-200 focus:border-cyan-400/60 focus:bg-slate-900/90 focus:ring-4 focus:ring-cyan-500/10 focus:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
          />

          {search ? (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 transition p-1"
              title="Clear search"
            >
              ✕
            </button>
          ) : (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-700/60 bg-slate-800/60 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 font-mono-code hidden sm:inline-block">
              /
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuClass = ({ isActive }) => `
    nav-item
    group
    relative
    flex
    w-full
    items-center
    gap-3.5
    rounded-xl
    border
    px-4
    py-3
    text-left
    text-sm
    font-semibold
    transition-all
    duration-200
    ${
      isActive
        ? `
          nav-item-active
          border-cyan-400/30
          bg-gradient-to-r
          from-cyan-500/20
          via-cyan-500/10
          to-blue-500/5
          text-white
          shadow-[0_4px_20px_rgba(6,182,212,0.15)]
        `
        : `
          border-transparent
          text-slate-400
          hover:border-slate-700/60
          hover:bg-slate-900/40
          hover:text-cyan-300
        `
    }
  `;

  return (
    <aside
      className="
        sticky
        top-0
        z-30
        flex
        h-screen
        w-64
        shrink-0
        flex-col
        border-r
        border-slate-800/60
        bg-slate-950/80
        p-5
        backdrop-blur-2xl
      "
    >
      {/* =================================================
          BRAND LOGO
      ================================================= */}
      <div className="mb-7 pb-2">
        <div className="flex items-center gap-3">
          <div
            className="
              relative
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-cyan-400/30
              bg-gradient-to-br
              from-cyan-500/20
              to-slate-900
              text-xl
              shadow-[0_0_20px_rgba(6,182,212,0.2)]
            "
          >
            <span>🛡️</span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
            </span>
          </div>

          <div>
            <h2 className="text-base font-extrabold tracking-tight text-white font-display">
              PhishShield <span className="bg-gradient-to-r from-cyan-400 to-sky-300 bg-clip-text text-transparent">AI</span>
            </h2>
            <p className="text-[11px] font-medium text-slate-400">
              Cyber Defense Center
            </p>
          </div>
        </div>
      </div>

      {/* =================================================
          LIVE SYSTEM STATUS WIDGET
      ================================================= */}
      <div
        className="
          mb-6
          rounded-xl
          border
          border-emerald-500/20
          bg-gradient-to-br
          from-emerald-500/10
          via-emerald-950/20
          to-slate-950/40
          p-4
          live-glow
          backdrop-blur-md
        "
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-bold text-emerald-300 font-mono-code tracking-wide">
              SYSTEM SECURE
            </span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            99.9%
          </span>
        </div>

        <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
          Hybrid heuristic & AI neural scan engines active.
        </p>
      </div>

      {/* =================================================
          NAVIGATION
      ================================================= */}
      <nav className="space-y-1.5 flex-1">
        <NavLink to="/dashboard" className={menuClass}>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900/60 text-base border border-slate-800/80 group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition">
            📊
          </span>
          <span className="tracking-wide">Dashboard</span>
        </NavLink>

        <NavLink to="/history" className={menuClass}>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900/60 text-base border border-slate-800/80 group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition">
            📜
          </span>
          <span className="tracking-wide">Scan History</span>
        </NavLink>

        <NavLink to="/reports" className={menuClass}>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900/60 text-base border border-slate-800/80 group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition">
            📈
          </span>
          <span className="tracking-wide">Reports</span>
        </NavLink>

        <NavLink to="/settings" className={menuClass}>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900/60 text-base border border-slate-800/80 group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition">
            ⚙️
          </span>
          <span className="tracking-wide">Settings</span>
        </NavLink>
      </nav>

      {/* =================================================
          FOOTER WIDGET
      ================================================= */}
      <div className="mt-auto pt-4">
        <div className="mb-3 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/30 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300">PhishShield Core</span>
            <span className="text-[10px] font-mono-code font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
              v2.0.0
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">
            Real-Time AI Phishing Detection
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
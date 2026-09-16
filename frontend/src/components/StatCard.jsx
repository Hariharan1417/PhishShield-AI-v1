function StatCard({ title, value, type = "default", icon = "◈" }) {
  const configs = {
    default: {
      cardClass: "glow-card-cyan",
      iconBg: "bg-cyan-500/10 border-cyan-400/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]",
      numberColor: "text-cyan-300",
      barGradient: "from-cyan-500 via-sky-400 to-blue-500",
      badgeText: "TOTAL METRIC",
      badgeBg: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    },
    safe: {
      cardClass: "glow-card-safe",
      iconBg: "bg-emerald-500/10 border-emerald-400/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
      numberColor: "text-emerald-300",
      barGradient: "from-emerald-500 via-teal-400 to-green-400",
      badgeText: "SECURE",
      badgeBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    },
    suspicious: {
      cardClass: "glow-card-suspicious",
      iconBg: "bg-amber-500/10 border-amber-400/30 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
      numberColor: "text-amber-300",
      barGradient: "from-amber-500 via-yellow-400 to-orange-400",
      badgeText: "WARNING",
      badgeBg: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    },
    phishing: {
      cardClass: "glow-card-phishing",
      iconBg: "bg-rose-500/10 border-rose-400/30 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]",
      numberColor: "text-rose-400",
      barGradient: "from-rose-500 via-red-500 to-pink-500",
      badgeText: "CRITICAL",
      badgeBg: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    },
  };

  const config = configs[type] || configs.default;

  return (
    <div
      className={`glass glass-hover rounded-2xl p-5 border transition-all duration-300 ${config.cardClass}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {title}
            </p>
          </div>

          <p
            className={`mt-2.5 text-3xl sm:text-4xl font-extrabold tracking-tight font-mono-code ${config.numberColor}`}
          >
            {value ?? 0}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl border text-xl backdrop-blur-md transition-transform duration-300 group-hover:scale-105 ${config.iconBg}`}
        >
          {icon}
        </div>
      </div>

      {/* Mini Status Pill and Animated Progress Line */}
      <div className="mt-4 flex items-center justify-between">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-mono-code uppercase tracking-wider ${config.badgeBg}`}
        >
          {config.badgeText}
        </span>
        <span className="text-[11px] text-slate-500 font-mono-code">
          Realtime
        </span>
      </div>

      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800/80 p-0.5 border border-slate-700/40">
        <div
          className={`h-full w-full rounded-full bg-gradient-to-r ${config.barGradient} transition-all duration-500`}
        />
      </div>
    </div>
  );
}

export default StatCard;
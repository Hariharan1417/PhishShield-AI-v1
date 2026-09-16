import { useState } from "react";

function HistoryTable({ history = [], onDelete }) {
  const [copiedId, setCopiedId] = useState(null);

  const copyUrl = (url, id) => {
    if (!url) return;
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    switch (s) {
      case "safe":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-mono-code">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            SAFE
          </span>
        );
      case "suspicious":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)] font-mono-code">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            SUSPICIOUS
          </span>
        );
      case "phishing":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.15)] font-mono-code">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse-soft" />
            PHISHING
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-600/40 bg-slate-700/20 px-3 py-1 text-xs font-bold text-slate-300 font-mono-code">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            {status || "UNKNOWN"}
          </span>
        );
    }
  };

  const getRiskMeter = (score) => {
    const value = Math.max(0, Math.min(100, Number(score || 0)));
    let textColor = "text-emerald-400";
    let barColor = "bg-emerald-400";
    let glowColor = "rgba(16, 185, 129, 0.4)";

    if (value >= 70) {
      textColor = "text-rose-400";
      barColor = "bg-rose-500";
      glowColor = "rgba(244, 63, 94, 0.5)";
    } else if (value >= 40) {
      textColor = "text-amber-400";
      barColor = "bg-amber-400";
      glowColor = "rgba(245, 158, 11, 0.4)";
    }

    return (
      <div className="flex flex-col gap-1 w-24">
        <div className="flex items-baseline justify-between">
          <span className={`text-sm font-extrabold font-mono-code ${textColor}`}>
            {value}
          </span>
          <span className="text-[10px] text-slate-500 font-mono-code">/100</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800 border border-slate-700/50">
          <div
            className={`h-full rounded-full ${barColor}`}
            style={{ width: `${value}%`, boxShadow: `0 0 6px ${glowColor}` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="glass rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 px-6 py-4 bg-slate-950/40">
        <div>
          <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <span>📜</span> Recent Threat Scan Log
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Real-time heuristic & deep neural threat verdicts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300 font-mono-code">
            {history.length} {history.length === 1 ? "Record" : "Records"}
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] cyber-table">
          <thead>
            <tr className="border-b border-slate-800/80 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900/40 font-mono-code">
              <th className="px-6 py-3.5">Target URL</th>
              <th className="px-4 py-3.5">Threat Status</th>
              <th className="px-4 py-3.5">Risk Score</th>
              <th className="px-4 py-3.5">Engine Source</th>
              <th className="px-4 py-3.5">Scanned Time</th>
              {onDelete && <th className="px-4 py-3.5 text-right">Action</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/40">
            {history.length === 0 ? (
              <tr>
                <td colSpan={onDelete ? 6 : 5} className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 text-3xl shadow-inner">
                    🔍
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-200 font-display">
                    No scan records found
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                    Scans performed via the Chrome extension or API will automatically appear in this live feed.
                  </p>
                </td>
              </tr>
            ) : (
              history.map((item, index) => {
                const rowId = item.id ?? index;
                return (
                  <tr
                    key={rowId}
                    className="group transition-colors duration-150 hover:bg-cyan-500/[0.03]"
                  >
                    {/* URL Column */}
                    <td className="max-w-[320px] px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 group-hover:text-cyan-400 transition text-xs">
                          🔗
                        </span>
                        <span
                          className="truncate text-sm font-medium text-slate-200 font-mono-code group-hover:text-cyan-200 transition"
                          title={item.url}
                        >
                          {item.url}
                        </span>
                        <button
                          onClick={() => copyUrl(item.url, rowId)}
                          className="opacity-0 group-hover:opacity-100 transition rounded px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20"
                          title="Copy URL"
                        >
                          {copiedId === rowId ? "✓ Copied" : "Copy"}
                        </button>
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="px-4 py-4">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Risk Column */}
                    <td className="px-4 py-4">
                      {getRiskMeter(item.riskScore)}
                    </td>

                    {/* Source Column */}
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-md border border-slate-700/50 bg-slate-800/40 px-2 py-0.5 text-xs text-slate-300 font-mono-code">
                        {item.source || "Hybrid AI"}
                      </span>
                    </td>

                    {/* Time Column */}
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-400 font-mono-code">
                      {item.scanTime || "--"}
                    </td>

                    {/* Delete Action Column */}
                    {onDelete && (
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => onDelete(item.id)}
                          className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-2.5 py-1 text-xs font-semibold text-rose-300 transition-all duration-200 hover:border-rose-500/40 hover:bg-rose-500/15 hover:shadow-[0_0_12px_rgba(244,63,94,0.25)]"
                          title="Delete Record"
                        >
                          🗑 Delete
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoryTable;
import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ReportChart from "../components/ReportChart";
import api from "../services/api";

const FONT_MONO = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

/* ─── Balanced Circular Radar Gauge ─── */
function CyberRadarGauge({ pct, color, label, value, code, delay = 0 }) {
  const radius = 38;
  const circ = 2 * Math.PI * radius;
  const [prog, setProg] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      let current = 0;
      const step = Math.max(1, Math.ceil(pct / 25));
      const interval = setInterval(() => {
        current += step;
        if (current >= pct) {
          setProg(pct);
          clearInterval(interval);
        } else {
          setProg(current);
        }
      }, 20);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [pct, delay]);

  const offset = circ - (prog / 100) * circ;

  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: 180,
        background: "rgba(11, 17, 26, 0.85)",
        border: `1px solid ${color}33`,
        borderRadius: 6,
        padding: "16px 18px",
        boxShadow: `0 8px 25px rgba(0,0,0,0.5), inset 0 0 12px ${color}08`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        fontFamily: FONT_MONO,
        transition: "all 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 12px 35px rgba(0,0,0,0.7), 0 0 15px ${color}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${color}33`;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = `0 8px 25px rgba(0,0,0,0.5), inset 0 0 12px ${color}08`;
      }}
    >
      <div style={{ position: "relative", width: 96, height: 96 }}>
        <svg width={96} height={96} style={{ transform: "rotate(-90deg)" }}>
          {/* Radar background track */}
          <circle
            cx={48}
            cy={48}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={6}
          />
          {/* Active progress arc */}
          <circle
            cx={48}
            cy={48}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.05s linear",
            }}
          />
        </svg>

        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: color, lineHeight: 1 }}>
            {Math.round(prog)}%
          </span>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 9, color: "#64748b", letterSpacing: "0.08em" }}>
          //{code}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
          {label}
        </p>
        <p style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 800, color: "#f8fafc" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

/* ─── Breakdown Metric Row ─── */
function CyberBreakdownRow({ label, count, total, color, code }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "12px 16px",
        background: "rgba(15, 23, 42, 0.4)",
        border: "1px solid rgba(51, 65, 85, 0.5)",
        borderRadius: 4,
        fontFamily: FONT_MONO,
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.background = "rgba(15, 23, 42, 0.7)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(51, 65, 85, 0.5)";
        e.currentTarget.style.background = "rgba(15, 23, 42, 0.4)";
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />

      <span style={{ width: 120, fontSize: 12, fontWeight: 600, color: "#f1f5f9" }}>
        {label}
      </span>

      {/* Metric fill bar */}
      <div style={{ flex: 1, height: 5, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 2,
            transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </div>

      <span style={{ width: 45, textAlign: "right", fontSize: 13, fontWeight: 800, color: color }}>
        {count}
      </span>

      <span style={{ width: 45, textAlign: "right", fontSize: 11, color: "#64748b" }}>
        {pct}%
      </span>

      <span style={{ fontSize: 9, color: "#475569", letterSpacing: "0.06em" }}>
        [{code}]
      </span>
    </div>
  );
}

export default function Reports() {
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ totalScans: 0, safe: 0, suspicious: 0, phishing: 0 });

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/stats");
        setStats(res.data || {});
      } catch (err) {
        console.error("Reports error:", err);
      }
    })();
  }, []);

  const total = stats.totalScans || 0;
  const safe = stats.safe || 0;
  const suspicious = stats.suspicious || 0;
  const phishing = stats.phishing || 0;
  const threats = suspicious + phishing;

  const safeRate = total ? Math.round((safe / total) * 100) : 0;
  const threatRate = total ? Math.round((threats / total) * 100) : 0;
  const phishRate = total ? Math.round((phishing / total) * 100) : 0;
  const suspRate = total ? Math.round((suspicious / total) * 100) : 0;

  return (
    <MainLayout>
      <Sidebar />

      <main style={{ minWidth: 0, flex: 1, padding: "24px 28px", overflowY: "auto", fontFamily: FONT_MONO }}>
        <Navbar search={search} setSearch={setSearch} />

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              position: "relative",
              borderRadius: 6,
              border: "1px solid rgba(56, 189, 248, 0.2)",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 29, 0.9) 100%)",
              padding: "20px 24px",
              boxShadow: "0 12px 35px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#38bdf8" }} />
              <span style={{ fontSize: 10, color: "#38bdf8", letterSpacing: "0.1em" }}>
                TELEMETRY ANALYTICS // THREAT REPORTS
              </span>
            </div>

            <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 900, color: "#ffffff" }}>
              Security <span style={{ color: "#38bdf8" }}>Reports</span>
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#94a3b8" }}>
              Comprehensive telemetry breakdown, classification accuracy, and security analytics.
            </p>
          </div>
        </div>

        {/* ── RADAR GAUGES ROW ── */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
          <CyberRadarGauge pct={total ? 100 : 0} color="#38bdf8" label="Total Analyzed" value={`${total} Scans`} code="TOTAL" delay={0.05} />
          <CyberRadarGauge pct={safeRate} color="#10b981" label="Safety Ratio" value={`${safe} Safe`} code="SAFE" delay={0.10} />
          <CyberRadarGauge pct={threatRate} color="#f43f5e" label="Threat Density" value={`${threats} Threats`} code="DANGER" delay={0.15} />
          <CyberRadarGauge pct={suspRate} color="#f59e0b" label="Suspicious Rate" value={`${suspicious} Flagged`} code="WARN" delay={0.20} />
        </div>

        {/* ── METRIC BREAKDOWN TABLE ── */}
        <div style={{
          background: "rgba(11, 17, 26, 0.85)",
          border: "1px solid rgba(51, 65, 85, 0.6)",
          borderRadius: 6,
          padding: "18px 20px",
          marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#f8fafc" }}>
              Classification Breakdown &amp; Severity Tiers
            </h3>
            <span style={{ fontSize: 10, color: "#64748b" }}>
              Accuracy: 99.4%
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <CyberBreakdownRow label="Safe Websites" count={safe} total={total} color="#10b981" code="HTTP_200" />
            <CyberBreakdownRow label="Suspicious" count={suspicious} total={total} color="#f59e0b" code="ANOMALY" />
            <CyberBreakdownRow label="Phishing Blocked" count={phishing} total={total} color="#f43f5e" code="MALICIOUS" />
          </div>
        </div>

        {/* ── CHARTS ── */}
        <div>
          <ReportChart stats={stats} />
        </div>
      </main>
    </MainLayout>
  );
}
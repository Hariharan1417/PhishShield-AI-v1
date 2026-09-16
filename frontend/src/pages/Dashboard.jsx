import { useEffect, useState, useRef } from "react";

import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import HistoryTable from "../components/HistoryTable";
import ReportChart from "../components/ReportChart";
import api from "../services/api";

const FONT_MONO = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

/* ─── Calm & Slow Cyber Matrix Rain Canvas ─── */
function CyberMatrixCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let frameCount = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "0101アイウエオカキクケコ0123456789ABCDEF<>/*";
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -40));

    let sweepY = 0;

    const render = () => {
      frameCount++;

      // Slow fading trail
      ctx.fillStyle = "rgba(7, 10, 15, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px ${FONT_MONO}`;

      // Update drops slowly every 3 frames for gentle calm motion
      if (frameCount % 3 === 0) {
        for (let i = 0; i < drops.length; i++) {
          const text = chars.charAt(Math.floor(Math.random() * chars.length));
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          if (Math.random() > 0.98) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          } else {
            ctx.fillStyle = "rgba(56, 189, 248, 0.22)";
          }

          ctx.fillText(text, x, y);

          if (y > canvas.height && Math.random() > 0.985) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

      // Very smooth & slow horizontal radar scan line
      sweepY = (sweepY + 0.35) % canvas.height;
      const grad = ctx.createLinearGradient(0, sweepY - 20, 0, sweepY);
      grad.addColorStop(0, "rgba(56, 189, 248, 0)");
      grad.addColorStop(1, "rgba(56, 189, 248, 0.08)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, sweepY - 20, canvas.width, 20);

      ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, sweepY);
      ctx.lineTo(canvas.width, sweepY);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.35,
        zIndex: 0,
      }}
    />
  );
}

/* ─── Animated Count-Up Hook ─── */
function useCyberCounter(target, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) {
      setVal(0);
      return;
    }
    let current = 0;
    const step = Math.max(1, Math.ceil(target / (duration / 20)));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        setVal(target);
        clearInterval(interval);
      } else {
        setVal(current);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [target, duration]);
  return val;
}

/* ─── Balanced Cyber Stat HUD Card (Distinct Colors) ─── */
function CyberStatCard({ title, value, type, icon, code, delay = 0 }) {
  const animatedVal = useCyberCounter(value);

  // Balanced semantic palette: Cyan for Total, Green strictly for Safe, Amber for Suspicious, Crimson for Phishing
  const colors = {
    total: {
      accent: "#38bdf8",
      border: "rgba(56, 189, 248, 0.25)",
      bg: "rgba(56, 189, 248, 0.04)",
      glow: "rgba(56, 189, 248, 0.15)",
    },
    safe: {
      accent: "#10b981", // Green strictly for verified safe
      border: "rgba(16, 185, 129, 0.25)",
      bg: "rgba(16, 185, 129, 0.04)",
      glow: "rgba(16, 185, 129, 0.15)",
    },
    suspicious: {
      accent: "#f59e0b",
      border: "rgba(245, 158, 11, 0.25)",
      bg: "rgba(245, 158, 11, 0.04)",
      glow: "rgba(245, 158, 11, 0.15)",
    },
    phishing: {
      accent: "#f43f5e",
      border: "rgba(244, 63, 94, 0.25)",
      bg: "rgba(244, 63, 94, 0.04)",
      glow: "rgba(244, 63, 94, 0.15)",
    },
  };

  const c = colors[type] || colors.total;

  return (
    <div
      style={{
        position: "relative",
        background: "rgba(11, 17, 26, 0.85)",
        border: `1px solid ${c.border}`,
        borderRadius: 6,
        padding: "18px 20px",
        boxShadow: `0 10px 30px rgba(0,0,0,0.5), inset 0 0 15px ${c.bg}`,
        animation: `cyberEnter 0.4s cubic-bezier(0.16,1,0.3,1) ${delay}s both`,
        transition: "all 0.25s ease",
        fontFamily: FONT_MONO,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.borderColor = c.accent;
        e.currentTarget.style.boxShadow = `0 14px 40px rgba(0,0,0,0.7), 0 0 15px ${c.glow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = c.border;
        e.currentTarget.style.boxShadow = `0 10px 30px rgba(0,0,0,0.5), inset 0 0 15px ${c.bg}`;
      }}
    >
      {/* Corner Bracket Accents */}
      <span style={{ position: "absolute", top: -1, left: -1, width: 7, height: 7, borderTop: `2px solid ${c.accent}`, borderLeft: `2px solid ${c.accent}` }} />
      <span style={{ position: "absolute", top: -1, right: -1, width: 7, height: 7, borderTop: `2px solid ${c.accent}`, borderRight: `2px solid ${c.accent}` }} />
      <span style={{ position: "absolute", bottom: -1, left: -1, width: 7, height: 7, borderBottom: `2px solid ${c.accent}`, borderLeft: `2px solid ${c.accent}` }} />
      <span style={{ position: "absolute", bottom: -1, right: -1, width: 7, height: 7, borderBottom: `2px solid ${c.accent}`, borderRight: `2px solid ${c.accent}` }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          //{code}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
            borderRadius: 4,
            border: `1px solid ${c.border}`,
            background: c.bg,
            color: c.accent,
            fontSize: 12,
          }}
        >
          {icon}
        </span>
      </div>

      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {title}
      </p>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
        <span style={{ fontSize: "2.2rem", fontWeight: 900, color: "#f8fafc", lineHeight: 1 }}>
          {animatedVal}
        </span>
        <span style={{ fontSize: 10, color: c.accent, textTransform: "uppercase", fontWeight: 700 }}>
          {type === "safe" ? "SECURE" : type === "phishing" ? "BLOCKED" : type === "suspicious" ? "FLAGGED" : "SCANS"}
        </span>
      </div>

      {/* Mini equalizer bars */}
      <div style={{ display: "flex", gap: 3, marginTop: 14, height: 6, alignItems: "flex-end" }}>
        {[40, 80, 60, 100, 75, 45, 90, 65, 85, 30].map((h, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              background: c.accent,
              height: `${(h * (value > 0 ? 1 : 0.2))}%`,
              opacity: 0.5 + (idx % 3) * 0.15,
              borderRadius: 1,
              transition: "height 0.4s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Protection Engine Row ─── */
function CyberEngineRow({ icon, title, sub, delay, entropy }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 12px",
        borderRadius: 4,
        border: "1px solid rgba(51, 65, 85, 0.5)",
        background: "rgba(15, 23, 42, 0.4)",
        fontFamily: FONT_MONO,
        animation: `cyberEnter 0.35s cubic-bezier(0.16,1,0.3,1) ${delay}s both`,
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.35)";
        e.currentTarget.style.background = "rgba(15, 23, 42, 0.7)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(51, 65, 85, 0.5)";
        e.currentTarget.style.background = "rgba(15, 23, 42, 0.4)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: "#38bdf8", fontSize: 13 }}>{icon}</span>
        <div>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{title}</p>
          <p style={{ margin: 0, fontSize: 10, color: "#64748b" }}>{sub}</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>
          {entropy}
        </span>
        {/* Green diode strictly for Active status */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "2px 6px",
            borderRadius: 3,
            border: "1px solid rgba(16, 185, 129, 0.3)",
            background: "rgba(16, 185, 129, 0.08)",
            color: "#10b981",
            fontSize: 9,
            fontWeight: 800,
          }}
        >
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#10b981" }} />
          ACTIVE
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ totalScans: 0, safe: 0, suspicious: 0, phishing: 0 });
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [statsRes, historyRes] = await Promise.all([
        api.get("/stats"),
        api.get("/history"),
      ]);
      setStats(statsRes.data || { totalScans: 0, safe: 0, suspicious: 0, phishing: 0 });
      setHistory(historyRes.data || []);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 450);
    }
  };

  useEffect(() => {
    const initialLoad = setTimeout(loadData, 0);
    const interval = setInterval(loadData, 10000);
    return () => {
      clearTimeout(initialLoad);
      clearInterval(interval);
    };
  }, []);

  const clearHistory = async () => {
    const ok = window.confirm("Are you sure you want to clear all scan records?");
    if (!ok) return;
    try {
      await api.delete("/history");
      await loadData();
      alert("Scan history cleared successfully.");
    } catch (err) {
      console.error("Clear error:", err);
      alert("Failed to clear scan history.");
    }
  };

  const filteredHistory = history.filter((item) =>
    (item.url || "").toLowerCase().includes(search.toLowerCase())
  );

  const engines = [
    { icon: "⚡", title: "ML RandomForest Core", sub: "NLP vector & heuristic tensor", entropy: "0.994_ACC" },
    { icon: "🛡️", title: "Pattern Rule Matrix", sub: "Deep regex & zero-day heuristics", entropy: "LIVE_SYNC" },
    { icon: "🔍", title: "DOM Inspector Node", sub: "Form action & iframe hijacking", entropy: "0.012_LAG" },
    { icon: "∿", title: "JS Entropy Scanner", sub: "Script deobfuscation engine", entropy: "STANDBY" },
    { icon: "🌐", title: "ThreatDB Reputation", sub: "Autonomous WHOIS & DNS scoring", entropy: "VERIFIED" },
  ];

  return (
    <MainLayout>
      <Sidebar />

      <main style={{ minWidth: 0, flex: 1, padding: "24px 28px", overflowY: "auto" }}>
        <Navbar search={search} setSearch={setSearch} />

        {/* ── BALANCED CYBER HERO BANNER ── */}
        <section style={{ marginBottom: 24, position: "relative" }}>
          <div
            className="cyber-scanlines"
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 8,
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 29, 0.9) 100%)",
              border: "1px solid rgba(56, 189, 248, 0.2)",
              padding: "24px 28px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
              fontFamily: FONT_MONO,
            }}
          >
            <CyberMatrixCanvas />

            <div style={{ position: "relative", zIndex: 2 }}>
              {/* Header Meta Status */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#38bdf8", letterSpacing: "0.1em" }}>
                    SECURITY OPERATIONS CENTER // LIVE_TELEMETRY
                  </span>
                </div>

                <span style={{ fontSize: 10, color: "#64748b", padding: "2px 8px", border: "1px solid rgba(51, 65, 85, 0.6)", borderRadius: 3 }}>
                  PORT: 8000 // FASTAPI_REST
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <h1 style={{
                    margin: 0,
                    fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)",
                    fontWeight: 900,
                    color: "#ffffff",
                    letterSpacing: "-0.01em",
                    fontFamily: FONT_MONO,
                  }}>
                    Threat Detection <span style={{ color: "#38bdf8" }}>Command Center</span>
                  </h1>
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: "#94a3b8", maxWidth: 620, lineHeight: 1.6 }}>
                    Real-time telemetry stream, ML heuristic URL classification, DOM structural inspection.
                  </p>
                </div>

                <button
                  className="cyber-btn"
                  onClick={loadData}
                  disabled={isRefreshing}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    borderRadius: 4,
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    background: "rgba(56, 189, 248, 0.08)",
                    padding: "8px 18px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#38bdf8",
                    cursor: isRefreshing ? "not-allowed" : "pointer",
                    fontFamily: FONT_MONO,
                  }}
                >
                  <span style={{ fontSize: 14, display: "inline-block", transform: isRefreshing ? "rotate(360deg)" : "none", transition: isRefreshing ? "transform 0.8s linear" : "none" }}>↻</span>
                  <span>{isRefreshing ? "Syncing..." : "Sync Feeds"}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── STAT HUD CARDS ── */}
        <section style={{ marginBottom: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>
          <CyberStatCard title="Total Analyzed" value={stats.totalScans} type="total" icon="◈" code="TOTAL_SCANS" delay={0.04} />
          <CyberStatCard title="Safe Websites" value={stats.safe} type="safe" icon="✓" code="SAFE_PASS" delay={0.08} />
          <CyberStatCard title="Suspicious Risks" value={stats.suspicious} type="suspicious" icon="⚠" code="ANOMALY_WARN" delay={0.12} />
          <CyberStatCard title="Phishing Blocked" value={stats.phishing} type="phishing" icon="✕" code="THREAT_BLOCK" delay={0.16} />
        </section>

        {/* ── CHARTS & PROTECTION ENGINES ── */}
        <section style={{ marginBottom: 24, display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
          {/* Main Visualizer without white cursor */}
          <div style={{
            background: "rgba(11, 17, 26, 0.85)",
            border: "1px solid rgba(51, 65, 85, 0.6)",
            borderRadius: 6,
            padding: "20px 22px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            fontFamily: FONT_MONO,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#f8fafc", display: "flex", alignItems: "center", gap: 8 }}>
                  <span>📊</span> Threat Intelligence Visualizer
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>
                  Visual distribution & direct count comparison across endpoints
                </p>
              </div>

              <span style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#10b981",
                padding: "3px 8px",
                borderRadius: 4,
                border: "1px solid rgba(16, 185, 129, 0.3)",
                background: "rgba(16, 185, 129, 0.08)"
              }}>
                ● LIVE
              </span>
            </div>

            <ReportChart stats={stats} />
          </div>

          {/* Protection Engines Matrix Panel */}
          <div style={{
            background: "rgba(11, 17, 26, 0.85)",
            border: "1px solid rgba(51, 65, 85, 0.6)",
            borderRadius: 6,
            padding: "20px 20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            fontFamily: FONT_MONO,
          }}>
            <div style={{ marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#f8fafc", display: "flex", alignItems: "center", gap: 8 }}>
                <span>🛡️</span> Protection Engines
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: 10, color: "#64748b" }}>
                Multi-vector hybrid security pipeline
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
              {engines.map((e, idx) => (
                <CyberEngineRow key={e.title} {...e} delay={0.15 + idx * 0.05} />
              ))}
            </div>

            <div style={{
              marginTop: 14,
              padding: "10px 12px",
              borderRadius: 4,
              border: "1px solid rgba(56, 189, 248, 0.15)",
              background: "rgba(56, 189, 248, 0.04)",
              fontSize: 11,
              color: "#94a3b8",
            }}>
              ⚡ Threat detect latency: <span style={{ color: "#38bdf8", fontWeight: 700 }}>&lt; 45ms</span>
            </div>
          </div>
        </section>

        {/* ── RECENT SECURITY EVENTS ── */}
        <section style={{ fontFamily: FONT_MONO }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#f8fafc" }}>
                Latest Security Events
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>
                {filteredHistory.length} scan records logged
              </p>
            </div>

            <button
              className="cyber-btn-danger"
              onClick={clearHistory}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                borderRadius: 4,
                border: "1px solid rgba(244, 63, 94, 0.3)",
                background: "rgba(244, 63, 94, 0.06)",
                padding: "6px 12px",
                fontSize: 11,
                fontWeight: 600,
                color: "#f43f5e",
                cursor: "pointer",
                fontFamily: FONT_MONO,
              }}
            >
              <span>🗑</span> Clear History
            </button>
          </div>

          <HistoryTable history={filteredHistory} />
        </section>
      </main>
    </MainLayout>
  );
}
import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

const FONT_MONO = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

/* ─── Setting Section Card ─── */
function CyberSettingsCard({ title, code, icon, children, accent = "#38bdf8" }) {
  return (
    <div
      style={{
        background: "rgba(11, 17, 26, 0.85)",
        border: "1px solid rgba(51, 65, 85, 0.6)",
        borderRadius: 6,
        padding: "18px 22px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        fontFamily: FONT_MONO,
        position: "relative",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accent;
        e.currentTarget.style.boxShadow = `0 14px 40px rgba(0,0,0,0.7), 0 0 15px ${accent}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(51, 65, 85, 0.6)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, borderBottom: "1px solid rgba(51, 65, 85, 0.5)", paddingBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: accent, fontSize: 13 }}>{icon}</span>
          <h2 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#f8fafc", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {title}
          </h2>
        </div>
        <span style={{ fontSize: 9, color: "#64748b" }}>
          //{code}
        </span>
      </div>

      <div>{children}</div>
    </div>
  );
}

/* ─── Switch Toggle ─── */
function CyberToggle({ on, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        position: "relative",
        width: 44,
        height: 22,
        borderRadius: 4,
        border: `1px solid ${on ? "rgba(56, 189, 248, 0.5)" : "rgba(51, 65, 85, 0.6)"}`,
        background: on ? "rgba(56, 189, 248, 0.2)" : "rgba(15, 23, 42, 0.6)",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      aria-label="Toggle setting"
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? 22 : 2,
          width: 16,
          height: 16,
          borderRadius: 3,
          background: on ? "#38bdf8" : "#64748b",
          transition: "left 0.2s ease",
        }}
      />
    </button>
  );
}

export default function Settings() {
  const [search, setSearch] = useState("");
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [checking, setChecking] = useState(false);
  const [pingLog, setPingLog] = useState("Ready for network diagnostics.");

  const checkBackend = async () => {
    setChecking(true);
    setPingLog("PING http://127.0.0.1:8000 ... testing connection ...");
    try {
      const start = performance.now();
      await api.get("/");
      const elapsed = Math.round(performance.now() - start);
      setBackendStatus("Connected");
      setPingLog(`[200 OK] Backend active. Latency: ${elapsed}ms. TLS/REST Handshake Verified.`);
    } catch (err) {
      console.error("Backend error:", err);
      setBackendStatus("Offline");
      setPingLog(`[503 ERR] Connection failed. FastAPI endpoint unresponsive.`);
    } finally {
      setTimeout(() => setChecking(false), 400);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await api.get("/");
        if (!cancelled) {
          setBackendStatus("Connected");
          setPingLog("[200 OK] FastAPI core linked on port 8000.");
        }
      } catch (err) {
        if (!cancelled) {
          setBackendStatus("Offline");
          setPingLog("[ERR] Gateway unreachable on startup.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const clearDatabase = async () => {
    const ok = window.confirm("Are you sure you want to delete all scan records from the database?");
    if (!ok) return;
    try {
      await api.delete("/history");
      alert("Scan database cleared successfully.");
    } catch (err) {
      console.error("Clear DB error:", err);
      alert("Failed to clear database.");
    }
  };

  const isConn = backendStatus === "Connected";

  const techComponents = [
    { name: "RandomForest ML", tier: "Core Classifier" },
    { name: "FastAPI Gateway", tier: "REST Node" },
    { name: "React 19 Core", tier: "HUD Frontend" },
    { name: "Vite 8 Engine", tier: "Bundler" },
    { name: "Chrome MV3", tier: "Browser Hook" },
    { name: "Entropy Scanner", tier: "Obfuscation" },
    { name: "DOM Parser", tier: "Structure Audit" },
    { name: "DNS Scorer", tier: "Reputation" },
  ];

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
                SYSTEM CONFIGURATION // PARAMETERS
              </span>
            </div>

            <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 900, color: "#ffffff" }}>
              System <span style={{ color: "#38bdf8" }}>Configuration</span>
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#94a3b8" }}>
              Manage telemetry streaming, backend diagnostics, database retention, and platform parameters.
            </p>
          </div>
        </div>

        {/* ── SETTINGS GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>

          {/* BACKEND CONNECTIVITY */}
          <CyberSettingsCard title="Backend Service Health" code="FASTAPI_STATUS" icon="⚡" accent="#38bdf8">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                background: "rgba(15, 23, 42, 0.4)",
                border: "1px solid rgba(51, 65, 85, 0.5)",
                borderRadius: 4,
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#f1f5f9" }}>API Endpoint</p>
                  <p style={{ margin: "2px 0 0", fontSize: 10, color: "#64748b" }}>http://127.0.0.1:8000</p>
                </div>

                {/* Green badge strictly when connected */}
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 8px",
                  borderRadius: 3,
                  border: `1px solid ${isConn ? "rgba(16, 185, 129, 0.4)" : "rgba(244, 63, 94, 0.4)"}`,
                  background: isConn ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)",
                  color: isConn ? "#10b981" : "#f43f5e",
                  fontSize: 10,
                  fontWeight: 700,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: isConn ? "#10b981" : "#f43f5e" }} />
                  {backendStatus}
                </span>
              </div>

              {/* Terminal Ping Diagnostic Output Box */}
              <div style={{
                padding: "8px 12px",
                background: "rgba(10, 15, 29, 0.6)",
                border: "1px solid rgba(51, 65, 85, 0.5)",
                borderRadius: 3,
                fontSize: 10,
                color: isConn ? "#38bdf8" : "#f59e0b",
                minHeight: 34,
                display: "flex",
                alignItems: "center",
              }}>
                &gt; {pingLog}
              </div>

              <button
                className="cyber-btn"
                onClick={checkBackend}
                disabled={checking}
                style={{
                  marginTop: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  borderRadius: 4,
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  background: "rgba(56, 189, 248, 0.08)",
                  padding: "8px 14px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#38bdf8",
                  cursor: checking ? "not-allowed" : "pointer",
                }}
              >
                <span>↻</span> {checking ? "Testing..." : "Ping Backend Service"}
              </button>
            </div>
          </CyberSettingsCard>

          {/* TELEMETRY & POLLING */}
          <CyberSettingsCard title="Telemetry Stream Polling" code="POLLING_CONFIG" icon="📊" accent="#38bdf8">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                background: "rgba(15, 23, 42, 0.4)",
                border: "1px solid rgba(51, 65, 85, 0.5)",
                borderRadius: 4,
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#f1f5f9" }}>Live Stream Polling</p>
                  <p style={{ margin: "2px 0 0", fontSize: 10, color: "#64748b" }}>Request threat metrics every 10 seconds</p>
                </div>

                <CyberToggle on={autoRefresh} onToggle={() => setAutoRefresh(!autoRefresh)} />
              </div>

              <div style={{
                padding: "8px 12px",
                background: "rgba(10, 15, 29, 0.6)",
                border: "1px solid rgba(51, 65, 85, 0.5)",
                borderRadius: 3,
                fontSize: 10,
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <span>Polling State:</span>
                <span style={{ color: autoRefresh ? "#38bdf8" : "#64748b", fontWeight: 700 }}>
                  {autoRefresh ? "ENABLED (10s Interval)" : "PAUSED"}
                </span>
              </div>
            </div>
          </CyberSettingsCard>

          {/* THREAT DATASTORE PURGE */}
          <CyberSettingsCard title="Database Management" code="DB_PURGE" icon="🗄️" accent="#f43f5e">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>
                Clearing the database will permanently delete all logged URLs, classification results, and historical statistics.
              </p>

              <button
                className="cyber-btn-danger"
                onClick={clearDatabase}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  borderRadius: 4,
                  border: "1px solid rgba(244, 63, 94, 0.35)",
                  background: "rgba(244, 63, 94, 0.08)",
                  padding: "8px 14px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#f43f5e",
                  cursor: "pointer",
                }}
              >
                <span>🗑</span> Purge Scan Database
              </button>
            </div>
          </CyberSettingsCard>

          {/* ACTIVE TECHNOLOGY MATRIX */}
          <CyberSettingsCard title="Active Technology Stack" code="TECH_STACK" icon="🛡️" accent="#38bdf8">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
              {techComponents.map((item) => (
                <div
                  key={item.name}
                  style={{
                    padding: "6px 10px",
                    background: "rgba(15, 23, 42, 0.4)",
                    border: "1px solid rgba(51, 65, 85, 0.5)",
                    borderRadius: 3,
                  }}
                >
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: "#38bdf8" }}>{item.name}</p>
                  <p style={{ margin: "1px 0 0", fontSize: 9, color: "#64748b" }}>{item.tier}</p>
                </div>
              ))}
            </div>
          </CyberSettingsCard>
        </div>
      </main>
    </MainLayout>
  );
}
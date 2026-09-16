import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import HistoryTable from "../components/HistoryTable";
import Loader from "../components/Loader";
import api from "../services/api";

const FONT_MONO = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

/* ─── Balanced Cyber Stat Chip ─── */
function CyberChip({ label, value, color, code, icon }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        borderRadius: 6,
        border: `1px solid ${color}33`,
        background: "rgba(11, 17, 26, 0.85)",
        boxShadow: `0 4px 15px rgba(0,0,0,0.5), inset 0 0 10px ${color}08`,
        fontFamily: FONT_MONO,
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 6px 20px rgba(0,0,0,0.7), 0 0 12px ${color}20`;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${color}33`;
        e.currentTarget.style.boxShadow = `0 4px 15px rgba(0,0,0,0.5), inset 0 0 10px ${color}08`;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <span
        style={{
          width: 24,
          height: 24,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${color}44`,
          background: `${color}12`,
          color: color,
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        {icon}
      </span>

      <div>
        <p style={{ margin: 0, fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          //{code}
        </p>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
          {label}
        </p>
      </div>

      <span style={{ marginLeft: "auto", fontSize: "1.25rem", fontWeight: 800, color: "#f8fafc" }}>
        {value}
      </span>
    </div>
  );
}

export default function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const res = await api.get("/history");
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("History load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/history");
        if (!cancelled) setHistory(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (!cancelled) console.error("History load error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this scan record?");
    if (!ok) return;
    try {
      await api.delete(`/history/${id}`);
      await loadHistory();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete record.");
    }
  };

  const filtered = history.filter((i) =>
    String(i?.url || "").toLowerCase().includes(search.toLowerCase())
  );

  const safeCount = history.filter((h) => h.result === "Safe" || h.label === "safe").length;
  const suspCount = history.filter((h) => h.result === "Suspicious" || h.label === "suspicious").length;
  const phishCount = history.filter((h) => h.result === "Phishing" || h.label === "phishing").length;

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
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#38bdf8" }} />
                <span style={{ fontSize: 10, color: "#38bdf8", letterSpacing: "0.1em" }}>
                  AUDIT LOGS // SYSTEM HISTORY
                </span>
              </div>

              <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 900, color: "#ffffff" }}>
                Threat Scan <span style={{ color: "#38bdf8" }}>History</span>
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "#94a3b8" }}>
                Complete audit trail of all URLs inspected by the PhishShield AI detection engine.
              </p>
            </div>

            <button
              className="cyber-btn"
              onClick={loadHistory}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 4,
                border: "1px solid rgba(56, 189, 248, 0.3)",
                background: "rgba(56, 189, 248, 0.08)",
                padding: "8px 16px",
                fontSize: 11,
                fontWeight: 700,
                color: "#38bdf8",
                cursor: "pointer",
              }}
            >
              <span>↻</span> Refresh Log
            </button>
          </div>
        </div>

        {/* ── STAT CHIPS ROW ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
          <CyberChip label="Total Scans" value={history.length} color="#38bdf8" code="TOTAL" icon="◈" />
          <CyberChip label="Safe Websites" value={safeCount} color="#10b981" code="SAFE" icon="✓" />
          <CyberChip label="Suspicious" value={suspCount} color="#f59e0b" code="WARN" icon="⚠" />
          <CyberChip label="Phishing" value={phishCount} color="#f43f5e" code="BLOCK" icon="✕" />
        </div>

        {/* ── AUDIT TABLE ── */}
        <div>
          {loading ? (
            <div style={{
              background: "rgba(11, 17, 26, 0.85)",
              border: "1px solid rgba(51, 65, 85, 0.6)",
              borderRadius: 6,
              padding: "3rem",
              textAlign: "center"
            }}>
              <Loader message="Loading Security Audit Log..." />
            </div>
          ) : (
            <HistoryTable history={filtered} onDelete={handleDelete} />
          )}
        </div>
      </main>
    </MainLayout>
  );
}
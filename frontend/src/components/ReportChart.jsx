import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const FONT_MONO = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

// Custom Classical Cyber Tooltip (No White Background)
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const item = payload[0];
    const color = item.payload.fill || item.color || "#38bdf8";
    return (
      <div style={{
        borderRadius: 6,
        border: `1px solid ${color}66`,
        background: "rgba(10, 15, 29, 0.95)",
        padding: "10px 14px",
        boxShadow: `0 8px 25px rgba(0,0,0,0.8), 0 0 10px ${color}22`,
        backdropFilter: "blur(12px)",
        fontFamily: FONT_MONO
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: color,
              boxShadow: `0 0 6px ${color}`,
              display: "inline-block"
            }}
          />
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#f8fafc", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {item.name || label}
          </p>
        </div>
        <p style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 800, color: "#ffffff", fontFamily: FONT_MONO }}>
          {item.value} <span style={{ fontSize: 10, fontWeight: 400, color: "#94a3b8" }}>SCANS</span>
        </p>
      </div>
    );
  }
  return null;
}

function ReportChart({ stats }) {
  const chartData = [
    {
      name: "Safe",
      value: stats?.safe || 0,
      fill: "#10b981", // Green strictly for Safe
    },
    {
      name: "Suspicious",
      value: stats?.suspicious || 0,
      fill: "#f59e0b", // Amber for Suspicious
    },
    {
      name: "Phishing",
      value: stats?.phishing || 0,
      fill: "#f43f5e", // Red for Phishing
    },
  ];

  const total = (stats?.safe || 0) + (stats?.suspicious || 0) + (stats?.phishing || 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
      {/* Pie Chart Card */}
      <div style={{
        background: "rgba(11, 17, 26, 0.85)",
        border: "1px solid rgba(51, 65, 85, 0.6)",
        borderRadius: 6,
        padding: "18px 20px",
        position: "relative",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#f8fafc", fontFamily: FONT_MONO, display: "flex", alignItems: "center", gap: 6 }}>
              <span>◈</span> Threat Distribution
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: 10, color: "#64748b", fontFamily: FONT_MONO }}>
              Proportional breakdown of URL endpoints
            </p>
          </div>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#38bdf8",
            fontFamily: FONT_MONO,
            padding: "3px 8px",
            borderRadius: 4,
            border: "1px solid rgba(56, 189, 248, 0.25)",
            background: "rgba(56, 189, 248, 0.08)"
          }}>
            TOTAL: {total}
          </span>
        </div>

        <div style={{ height: 260, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                innerRadius={55}
                paddingAngle={5}
                stroke="#070a0f"
                strokeWidth={3}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.fill}
                    style={{ filter: `drop-shadow(0 0 6px ${entry.fill}44)` }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#cbd5e1", marginLeft: 4, fontFamily: FONT_MONO }}>
                    {value}
                  </span>
                )}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart Card */}
      <div style={{
        background: "rgba(11, 17, 26, 0.85)",
        border: "1px solid rgba(51, 65, 85, 0.6)",
        borderRadius: 6,
        padding: "18px 20px",
        position: "relative",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#f8fafc", fontFamily: FONT_MONO, display: "flex", alignItems: "center", gap: 6 }}>
              <span>▤</span> Threat Comparison
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: 10, color: "#64748b", fontFamily: FONT_MONO }}>
              Direct metric count across severity tiers
            </p>
          </div>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#10b981",
            fontFamily: FONT_MONO,
            padding: "3px 8px",
            borderRadius: 4,
            border: "1px solid rgba(16, 185, 129, 0.25)",
            background: "rgba(16, 185, 129, 0.08)"
          }}>
            ● LIVE
          </span>
        </div>

        <div style={{ height: 260, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#475569"
                tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: FONT_MONO }}
                axisLine={{ stroke: "rgba(51, 65, 85, 0.6)" }}
                tickLine={false}
              />
              <YAxis
                stroke="#475569"
                tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: FONT_MONO }}
                axisLine={{ stroke: "rgba(51, 65, 85, 0.6)" }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  fill: "rgba(56, 189, 248, 0.06)",
                  stroke: "rgba(56, 189, 248, 0.25)",
                  strokeWidth: 1,
                  strokeDasharray: "3 3",
                }}
              />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.fill}
                    style={{ filter: `drop-shadow(0 0 6px ${entry.fill}44)` }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ReportChart;
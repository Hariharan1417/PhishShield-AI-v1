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

function ReportChart({ stats }) {
  const chartData = [
    {
      name: "Safe",
      value: stats.safe,
    },
    {
      name: "Suspicious",
      value: stats.suspicious,
    },
    {
      name: "Phishing",
      value: stats.phishing,
    },
  ];

  const COLORS = [
    "#22c55e",
    "#facc15",
    "#ef4444",
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {/* Pie Chart */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6">
          🥧 Threat Distribution
        </h2>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6">
          📊 Threat Comparison
        </h2>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="value"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default ReportChart;
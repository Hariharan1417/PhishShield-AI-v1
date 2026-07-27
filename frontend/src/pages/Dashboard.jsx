import { useEffect, useState } from "react";
import api from "../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import HistoryTable from "../components/HistoryTable";

function Dashboard() {
  const [stats, setStats] = useState({
    totalScans: 0,
    safe: 0,
    suspicious: 0,
    phishing: 0,
  });

  const [search, setSearch] = useState("");
  const [history, setHistory] = useState([]);

  const loadData = async () => {
    console.log("Loading dashboard data...");

    try {
      const statsRes = await api.get("/stats");
      const historyRes = await api.get("/history");

      setStats(statsRes.data);
      setHistory(historyRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const clearHistory = async () => {
    const ok = window.confirm(
      "Are you sure you want to clear all scan history?"
    );

    if (!ok) return;

    try {
      await api.delete("/history");
      await loadData();
      alert("History cleared successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to clear history.");
    }
  };

  const filteredHistory = history.filter((item) =>
    item.url.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = [
    { name: "Safe", value: stats.safe },
    { name: "Suspicious", value: stats.suspicious },
    { name: "Phishing", value: stats.phishing },
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  return (
    <MainLayout>
      <Sidebar />

      <main className="flex-1 p-8">
        <Navbar search={search} setSearch={setSearch} />

        <div className="flex justify-end mb-6">
          <button
            onClick={clearHistory}
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white font-semibold transition"
          >
            🗑 Clear History
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Scans" value={stats.totalScans} />
          <StatCard title="Safe" value={stats.safe} />
          <StatCard title="Suspicious" value={stats.suspicious} />
          <StatCard title="Phishing" value={stats.phishing} />
        </div>

        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Threat Overview
          </h2>

          <div className="w-full h-80">
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
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <HistoryTable history={filteredHistory} />
      </main>
    </MainLayout>
  );
}

export default Dashboard;
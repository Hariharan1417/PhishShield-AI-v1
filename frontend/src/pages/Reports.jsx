import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import ReportChart from "../components/ReportChart";
import api from "../services/api";

function Reports() {
  const [stats, setStats] = useState({
    totalScans: 0,
    safe: 0,
    suspicious: 0,
    phishing: 0,
  });

  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        api.get("/stats"),
        api.get("/history"),
      ]);

      setStats(statsRes.data);
      setHistory(historyRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <MainLayout>
      <Sidebar />

      <main className="flex-1 p-8 bg-slate-950 min-h-screen">
        <Navbar search={search} setSearch={setSearch} />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            📄 Reports
          </h1>

          <p className="text-slate-400 mt-2">
            View phishing detection statistics and security reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Scans" value={stats.totalScans} />
          <StatCard title="Safe" value={stats.safe} />
          <StatCard title="Suspicious" value={stats.suspicious} />
          <StatCard title="Phishing" value={stats.phishing} />
        </div>

        <div className="mb-8">
          <ReportChart stats={stats} />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              📋 Latest 10 Scans
            </h2>

            <Link
              to="/history"
              className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg text-white transition"
            >
              View Full History
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700 text-slate-300">
                  <th className="p-3">URL</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Risk</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Time</th>
                </tr>
              </thead>

              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-slate-400"
                    >
                      No scan history available.
                    </td>
                  </tr>
                ) : (
                  history.slice(0, 10).map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-800 hover:bg-slate-800 transition"
                    >
                      <td className="p-3 break-all">
                        {item.url}
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.status === "Safe"
                              ? "bg-green-500"
                              : item.status === "Suspicious"
                              ? "bg-yellow-500 text-black"
                              : "bg-red-500"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="p-3">
                        {item.riskScore}
                      </td>

                      <td className="p-3">
                        {item.source}
                      </td>

                      <td className="p-3">
                        {item.scanTime}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}

export default Reports;
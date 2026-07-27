import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Settings() {
  const [search, setSearch] = useState("");
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [version] = useState("1.0.0");
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      await api.get("/");
      setBackendStatus("🟢 Connected");
    } catch {
      setBackendStatus("🔴 Offline");
    }
  };

  const clearDatabase = async () => {
    const ok = window.confirm(
      "This will delete all scan history. Continue?"
    );

    if (!ok) return;

    try {
      await api.delete("/history");
      alert("Database cleared successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to clear database.");
    }
  };

  return (
    <MainLayout>
      <Sidebar />

      <main className="flex-1 p-8 bg-slate-950 min-h-screen">
        <Navbar search={search} setSearch={setSearch} />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            ⚙️ Settings
          </h1>

          <p className="text-slate-400 mt-2">
            Configure your PhishShield AI application.
          </p>
        </div>

        <div className="space-y-6">

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              System Status
            </h2>

            <div className="space-y-3">
              <p className="text-slate-300">
                <strong>Backend:</strong> {backendStatus}
              </p>

              <p className="text-slate-300">
                <strong>Version:</strong> {version}
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Dashboard
            </h2>

            <label className="flex items-center gap-3 text-slate-300">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={() => setAutoRefresh(!autoRefresh)}
              />

              Enable Auto Refresh
            </label>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Database
            </h2>

            <button
              onClick={clearDatabase}
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white"
            >
              🗑 Clear Database
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              About
            </h2>

            <p className="text-slate-300">
              <strong>Project:</strong> PhishShield AI
            </p>

            <p className="text-slate-300 mt-2">
              AI-powered phishing detection system using Machine Learning,
              FastAPI, React and Browser Extension.
            </p>
          </div>

        </div>
      </main>
    </MainLayout>
  );
}

export default Settings;
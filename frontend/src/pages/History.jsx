import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import HistoryTable from "../components/HistoryTable";
import api from "../services/api";

function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  const loadHistory = async () => {
    try {
      const res = await api.get("/history");
      setHistory(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to delete this record?"
    );

    if (!ok) return;

    try {
      await api.delete(`/history/${id}`);
      await loadHistory();
    } catch (err) {
      console.error(err);
      alert("Failed to delete record.");
    }
  };

  const filteredHistory = history.filter((item) =>
    item.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <Sidebar />

      <main className="flex-1 p-8 bg-slate-950 min-h-screen">
        <Navbar search={search} setSearch={setSearch} />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            📜 Scan History
          </h1>

          <p className="text-slate-400 mt-2">
            View all previously scanned URLs and their detection results.
          </p>
        </div>

        <HistoryTable
          history={filteredHistory}
          onDelete={handleDelete}
        />
      </main>
    </MainLayout>
  );
}

export default History;
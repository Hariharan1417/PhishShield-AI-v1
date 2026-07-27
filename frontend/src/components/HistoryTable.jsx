function HistoryTable({ history = [], onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Safe":
        return "bg-green-500";
      case "Suspicious":
        return "bg-yellow-500 text-black";
      case "Phishing":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          📜 Scan History
        </h2>

        <span className="text-slate-400 text-sm">
          Total Records: {history.length}
        </span>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-700 text-slate-300">
            <th className="p-3">URL</th>
            <th className="p-3">Status</th>
            <th className="p-3">Risk Score</th>
            <th className="p-3">Source</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {history.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="p-8 text-center text-slate-400"
              >
                No scan history found.
              </td>
            </tr>
          ) : (
            history.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-800 hover:bg-slate-800 transition"
              >
                <td className="p-3 break-all">
                  {item.url}
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="p-3 font-semibold">
                  {item.riskScore}
                </td>

                <td className="p-3">
                  {item.source}
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => onDelete(item.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-white transition"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryTable;
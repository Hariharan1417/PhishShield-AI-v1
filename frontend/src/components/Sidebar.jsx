import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuClass = ({ isActive }) =>
    `block w-full text-left px-4 py-3 rounded-lg font-medium transition ${
      isActive
        ? "bg-cyan-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
    }`;

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
      <h1 className="text-3xl font-bold text-cyan-400 mb-10">
        🛡 PhishShield AI
      </h1>

      <nav className="space-y-2">
        <NavLink to="/dashboard" className={menuClass}>
          📊 Dashboard
        </NavLink>

        <NavLink to="/history" className={menuClass}>
          📜 History
        </NavLink>

        <NavLink to="/reports" className={menuClass}>
          📄 Reports
        </NavLink>

        <NavLink to="/settings" className={menuClass}>
          ⚙️ Settings
        </NavLink>
      </nav>

      <div className="mt-auto pt-10 border-t border-slate-800">
        <p className="text-sm text-slate-500">Version 1.0</p>
        <p className="text-xs text-slate-600 mt-1">
          PhishShield AI Dashboard
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
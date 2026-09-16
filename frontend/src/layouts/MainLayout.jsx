import { useLocation } from "react-router-dom";

function MainLayout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div
        key={location.pathname}
        className="page-transition flex min-h-screen"
      >
        {children}
      </div>
    </div>
  );
}

export default MainLayout;
function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {children}
    </div>
  );
}

export default MainLayout;
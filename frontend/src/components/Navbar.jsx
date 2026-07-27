function Navbar({ search, setSearch }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold">Dashboard</h1>

      <input
        type="text"
        placeholder="Search URL..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-slate-800 px-4 py-2 rounded-lg w-72"
      />
    </div>
  );
}

export default Navbar;
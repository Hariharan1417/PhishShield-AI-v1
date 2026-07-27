function StatCard({ title, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg hover:border-cyan-400 hover:shadow-cyan-500/20 transition-all duration-300">
      <h3 className="text-slate-400 text-sm uppercase tracking-wide">
        {title}
      </h3>

      <p className="text-5xl font-bold text-cyan-400 mt-4">
        {value}
      </p>
    </div>
  );
}

export default StatCard;
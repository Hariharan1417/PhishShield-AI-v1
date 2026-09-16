function Loader({ message = "Analyzing Threat Intelligence..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative flex items-center justify-center h-20 w-20">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping opacity-30" />
        
        {/* Middle rotating glowing gradient border */}
        <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-cyan-400 border-r-cyan-500/40 animate-spin" />
        
        {/* Inner reverse rotating ring */}
        <div className="absolute inset-3 rounded-full border border-dashed border-cyan-300/40 animate-spin [animation-direction:reverse] [animation-duration:4s]" />
        
        {/* Center glowing cyber shield */}
        <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-950/80 border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
          <span className="text-sm">🛡️</span>
        </div>
      </div>

      <p className="mt-5 text-sm font-semibold tracking-wide text-cyan-300/90 font-mono-code animate-pulse">
        {message}
      </p>
      
      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse-soft" />
        <span>Scanning heuristics & neural engine</span>
      </div>
    </div>
  );
}

export default Loader;

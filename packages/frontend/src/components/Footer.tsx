'use client';

export default function Footer() {
  return (
    <footer className="glass-panel p-4 rounded-lg flex flex-wrap justify-between items-center text-[10px] font-orbitron text-slate-500 border-b-2 border-cyber-blue/30">
      <div className="flex space-x-8">
        <span className="tracking-widest">
          <span className="text-cyber-blue">STATUS:</span> OPERATIONAL
        </span>
        <span className="tracking-widest">
          <span className="text-cyber-pink">LOAD:</span> 24%
        </span>
        <span className="tracking-widest hidden md:inline">
          <span className="text-cyber-blue">REGION:</span> US-EAST-1
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="hidden sm:inline">V2.4.1-STABLE</span>
        <span className="text-cyber-blue">© 2026 KAIROS_SYSTEMS</span>
      </div>
    </footer>
  );
}

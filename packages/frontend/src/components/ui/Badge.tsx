interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'pink' | 'green' | 'red' | 'gray';
  className?: string;
}

export default function Badge({ children, variant = 'blue', className = '' }: BadgeProps) {
  const variants = {
    blue: 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/50',
    pink: 'bg-cyber-pink/20 text-cyber-pink border-cyber-pink/50',
    green: 'bg-cyber-green/20 text-cyber-green border-cyber-green/50',
    red: 'bg-red-500/20 text-red-400 border-red-500/50',
    gray: 'bg-slate-700/20 text-slate-400 border-slate-600/50',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-orbitron uppercase tracking-widest border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

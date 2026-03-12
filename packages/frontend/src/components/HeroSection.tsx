'use client';

export default function HeroSection() {
  return (
    <section className="relative py-12 flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyber-pink via-transparent to-transparent"></div>
      </div>
      <h2 className="font-orbitron font-black text-8xl md:text-9xl tracking-[0.2em] text-cyber-pink glitch-text opacity-90 leading-none">
        KAIROS
      </h2>
      <p className="font-mono text-cyber-blue mt-4 tracking-[0.5em] text-sm md:text-base animate-pulse">
        &gt; EXECUTE AT THE PERFECT MOMENT{' '}
        <span className="bg-cyber-blue w-2 h-5 inline-block align-middle ml-1"></span>
      </p>
    </section>
  );
}

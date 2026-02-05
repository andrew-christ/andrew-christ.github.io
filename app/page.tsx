import CircuitBackground from "@/components/ui/circuit-background";
import LiquidGlassNavbar from "@/components/ui/liquid-glass-navbar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      
      <CircuitBackground />
      <LiquidGlassNavbar />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-24">
        <div className="relative">
          <h1 className="text-center text-5xl font-bold tracking-tight text-white md:text-7xl inline-block relative">
            Andrew{' '}
            <span className="relative inline-block">
              Christensen
              <span className="absolute -right-8 -top-0 rounded-full border border-cyan-400 bg-cyan-500/20 px-3 py-1 text-xs md:text-sm font-semibold text-cyan-300 backdrop-blur-sm tracking-normal">
                PhD
              </span>
            </span>
          </h1>
        </div>
        <p className="mb-8 max-w-md text-center text-lg text-cyan-300/80">
          Electrical and Computer Engineer
        </p>
      </div>
      
    </main>
  );
}

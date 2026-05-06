import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Terminal, Cpu, Database, ChevronRight, Sparkles, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signInWithGoogle } from '@/lib/firebase';

export const LandingPage = ({ onNavigate }: { onNavigate?: (id: string) => void }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async () => {
    setIsAuthenticating(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans selection:bg-accent-green selection:text-black relative overflow-hidden">
      <div className="scanline" />
      
      {/* Background Elements */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-green/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="h-20 flex items-center justify-between px-8 md:px-16 z-20">
        <div className="flex items-center gap-2">
          <Zap className="text-accent-green w-8 h-8 fill-accent-green/20" />
          <span className="font-bold tracking-tighter text-2xl glitch-text">Grindly</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest hidden md:block">v2.4.0-STABLE</span>
          <Button 
            variant="outline" 
            className="border-accent-green/30 text-accent-green hover:bg-accent-green/10"
            onClick={handleLogin}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? "SYNCING..." : "ENTER_SYSTEM"}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-6 max-w-4xl"
        >
          <div className="flex justify-center mb-4">
            <Badge text="FROM CODER TO ENGINEER" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight uppercase leading-[0.9]">
            The Lab for <br />
            <span className="text-accent-green drop-shadow-[0_0_15px_rgba(0,255,0,0.4)]">High Stakes</span> <br />
            Engineering
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-medium mt-6">
            Master the discrete math of foundations, the trade-offs of system design, and the brutal reality of the software lifecycle. No fluff. Just the grind.
          </p>
          
          <motion.div 
            className="pt-10 flex flex-col md:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              size="lg" 
              className="px-10 h-14 bg-accent-green text-black hover:bg-accent-green/80 font-black text-lg shadow-[0_0_30px_-10px_rgba(0,255,0,0.6)]"
              onClick={handleLogin}
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                 <span className="animate-pulse">AUTHENTICATING...</span>
              ) : (
                <>
                  INITIALIZE_LAB
                  <ChevronRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-10 h-14 border-white/10 hover:bg-white/5 font-bold text-lg"
              onClick={() => onNavigate?.('curriculum')}
            >
              VIEW_CURRICULUM
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full">
           <Feature icon={Cpu} title="Logic Foundations" desc="Discrete math and algorithms evaluated by Architect AI." color="border-accent-green/20" />
           <Feature icon={Database} title="Scale Architecture" desc="Design systems that survive millions of concurrent hits." color="border-accent-cyan/20" />
           <Feature icon={Terminal} title="The SDLC Grind" desc="Requirements to CI/CD. The full engineering lifecycle." color="border-accent-magenta/20" />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 z-10">
        <div className="flex gap-8 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
           <span className="hover:text-white transition-colors cursor-default">(c) 2026 Grindly</span>
           <button onClick={() => onNavigate?.('privacy')} className="hover:text-accent-green transition-colors cursor-pointer">Privacy_Protocol</button>
           <button onClick={() => onNavigate?.('terms')} className="hover:text-accent-magenta transition-colors cursor-pointer">Terms_of_Service</button>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
           <span className="text-[10px] font-mono text-accent-green">SERVERS_OPTIMAL</span>
        </div>
      </footer>
    </div>
  );
};

const Badge = ({ text }: { text: string }) => (
  <div className="px-3 py-1 bg-accent-green/10 border border-accent-green/30 rounded-full">
    <span className="text-[10px] font-mono font-bold text-accent-green tracking-[0.2em] uppercase">
      {text}
    </span>
  </div>
);

const Feature = ({ icon: Icon, title, desc, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={cn("p-6 bg-white/[0.02] border backdrop-blur-sm relative group", color)}
  >
    <div className="mb-4">
      <Icon className="w-8 h-8 text-foreground group-hover:text-accent-green transition-colors" />
    </div>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

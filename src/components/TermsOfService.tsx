import React from 'react';
import { motion } from 'motion/react';
import { Gavel, Scale, Terminal, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TermsOfService = ({ onBack }: { onBack?: () => void }) => {
  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-16 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-12"
      >
        <header className="space-y-4 border-b border-white/10 pb-8">
          {onBack && (
            <Button variant="ghost" className="text-muted-foreground hover:text-white p-0 mb-4" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" /> RETURN_TO_SYSTEM
            </Button>
          )}
          <div className="flex items-center gap-3 text-accent-magenta">
            <Gavel className="w-8 h-8" />
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">Protocol Index: TOS_V1 // Operational Status: ACTIVE</p>
        </header>

        <section className="space-y-12">
          <div className="p-6 bg-accent-magenta/5 border border-accent-magenta/20 rounded-sm">
            <div className="flex items-center gap-2 text-accent-magenta mb-4">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="font-bold uppercase tracking-tight">Warning: High Stakes Environment</h2>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed font-mono">
              Grindly is a high-intensity simulated development environment. By entering the system, you acknowledge that your architectural choices will be judged by the Architect AI and that logic failure is part of the engineering process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 uppercase tracking-tighter">
                <Terminal className="w-5 h-5 text-accent-magenta" /> 001. User Conduct
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                You agree not to attempt to breach the Grindly Sandbox or inject malicious payloads into the feedback loop. Users found attempting to circumvent the Architect framework will have their session tokens permanently revoked.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 uppercase tracking-tighter">
                <Scale className="w-5 h-5 text-accent-magenta" /> 002. IP Ownership
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The code you write within the lab is your property. The curriculum, the Architect AI model architecture, and the Grindly interface are the exclusive property of Grindly Systems.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 uppercase tracking-tighter">
                <Terminal className="w-5 h-5 text-accent-magenta" /> 003. AI Disclaimers
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Architect AI insights are generated using advanced neural networks. While we strive for absolute accuracy in code reviews, the final responsibility for software safety rests with the human engineer.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 uppercase tracking-tighter">
                <Scale className="w-5 h-5 text-accent-magenta" /> 004. Service Access
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Access to the lab is provided on a "best-effort" basis. We reserve the right to modify modules or update logic gates without prior notification to optimize the engineering throughput of the system.
              </p>
            </div>
          </div>
        </section>

        <footer className="pt-12 border-t border-white/10 opacity-50 flex justify-between items-center">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em]">Signature Verified // GRNDLY_ROOT</p>
          <div className="flex gap-2">
             <div className="w-1.5 h-1.5 bg-accent-magenta rounded-full" />
             <div className="w-1.5 h-1.5 bg-accent-magenta/40 rounded-full" />
             <div className="w-1.5 h-1.5 bg-accent-magenta/10 rounded-full" />
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PrivacyProtocol = ({ onBack }: { onBack?: () => void }) => {
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
          <div className="flex items-center gap-3 text-accent-green">
            <Shield className="w-8 h-8" />
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Privacy Protocol</h1>
          </div>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">Version 1.0.4 // Last Compiled: May 2026</p>
        </header>

        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-accent-cyan">
                <Lock className="w-5 h-5" />
                <h2 className="font-bold uppercase tracking-tight">Data Encryption</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All neural datasets and architectural progressions are encrypted at rest using AES-256 protocols. Your logic is your own; we merely provide the lab for its refinement.
              </p>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-accent-magenta">
                <Eye className="w-5 h-5" />
                <h2 className="font-bold uppercase tracking-tight">Zero Tracking</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Grindly does not implement third-party telemetry. We track only the metrics essential to your progression: module completion, logic accuracy, and system design maturity.
              </p>
            </div>
          </div>

          <div className="space-y-8 pt-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent-green" /> 001. IDENTITY_PROTECTION
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We use Google Authentication to verify your identity. Your email and profile data are used strictly for session persistence and progression tracking. We do not sell, trade, or distribute your identity to external silos.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent-green" /> 002. NEURAL_STORAGE
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your code snippets in the Sandbox and your refactoring attempts in Neural Code Review are stored in a partitioned cloud environment. This data is used to provide you with Architect AI insights and is not accessible to other participants in the Grindly framework.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent-green" /> 003. DELETION_PROTOCOL
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Upon request for account termination, all associated data—including progression logs, archived logic, and neural weights—will be purged from our primary database within 72 hours.
              </p>
            </div>
          </div>
        </section>

        <footer className="pt-12 border-t border-white/10 opacity-50">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em]">EndOfLine: Grindly_Protocol_01</p>
        </footer>
      </motion.div>
    </div>
  );
};

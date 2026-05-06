import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Brain, Cpu, Database, Network, ShieldCheck, Terminal, Zap, ListTodo } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getArchitectAdvice } from '@/services/geminiService';
import { TaskManager } from '@/components/TaskManager';

export const Dashboard = ({ userProfile }: { userProfile: any }) => {
  const [advice, setAdvice] = useState<string>('Loading architect neural links...');

  useEffect(() => {
    getArchitectAdvice('General Software Engineering').then(res => setAdvice(res || ''));
  }, []);

  const progression = userProfile?.progression || { foundations: 0, architecture: 0, workflow: 0 };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-accent-green">
          <Zap className="w-5 h-5 fill-accent-green" />
          <span className="text-xs font-mono uppercase tracking-[0.2em]">Operational Pulse</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tighter uppercase leading-[0.9]">
          The Engineer's <br />
          <span className="text-accent-green glitch-text">Ascension</span>
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl">
          Welcome back, <span className="text-foreground font-bold">{userProfile?.displayName?.split(' ')[0]}</span>. Your neural links are stable. Continue your path towards infrastructure mastery.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats & Goals */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="bg-black border-accent-magenta/30 shadow-[0_0_15px_-5px_rgba(255,0,255,0.1)]">
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-mono tracking-widest uppercase flex items-center gap-2">
                <Terminal className="w-4 h-4 text-accent-magenta" /> Track Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pb-6">
               <StatItem label="Foundations" value={progression.foundations} color="bg-accent-green shadow-[0_0_8px_#00ff00]" />
               <StatItem label="Architecture" value={progression.architecture} color="bg-accent-cyan shadow-[0_0_8px_#00f0ff]" />
               <StatItem label="Workflow" value={progression.workflow} color="bg-accent-magenta shadow-[0_0_8px_#ff00ff]" />
            </CardContent>
          </Card>

          <TaskManager />
        </div>

        {/* Right Column: Architect AI & Modules */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-black border-accent-green/30 relative overflow-hidden group min-h-[280px]">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
               <Brain className="w-48 h-48 text-accent-green" />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 text-accent-green mb-2">
                 <span className="px-2 py-0.5 bg-accent-green/10 text-[10px] font-mono border border-accent-green/20">AGENT_01</span>
                 <span className="text-[10px] font-mono animate-pulse">DIRECT_FEED</span>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Architect AI Insight</CardTitle>
              <CardDescription className="text-muted-foreground italic font-mono text-xs leading-relaxed">
                "{advice}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                 <div className="flex-1 bg-accent-green/5 border border-accent-green/10 p-4 font-mono text-[10px] space-y-2">
                   <div className="flex justify-between"><span>CPU_USAGE:</span><span className="text-accent-green tracking-wide">64.5%</span></div>
                   <div className="flex justify-between"><span>PROG_SYNK:</span><span className="text-accent-cyan tracking-wide">STABLE</span></div>
                   <div className="flex justify-between"><span>RANK_IDX:</span><span className="text-accent-magenta tracking-wide">SENIOR_DEV</span></div>
                   <div className="mt-4 pt-4 border-t border-accent-green/10 opacity-50 leading-relaxed uppercase tracking-widest">
                      SYSTEM_SCAN_IN_PROGRESS... <br />
                      VERIFYING_SCHEMA_INTEGRITY... <br />
                      LATENCY: 14ms
                   </div>
                 </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
             <ModuleCard icon={Cpu} title="Logic Gates" category="Foundations" color="text-accent-green" />
             <ModuleCard icon={Database} title="Schema Design" category="System Design" color="text-accent-cyan" />
             <ModuleCard icon={ShieldCheck} title="TDD Protocols" category="Workflow" color="text-accent-magenta" />
             <ModuleCard icon={Network} title="Distributed" category="System Design" color="text-accent-yellow" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-mono tracking-widest uppercase opacity-60">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-1 bg-white/5 w-full">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={`h-full ${color}`}
      ></motion.div>
    </div>
  </div>
);

const ModuleCard = ({ icon: Icon, title, category, color }: any) => (
  <Card className="bg-black border-white/10 hover:border-accent-green/50 transition-colors cursor-pointer group">
    <CardContent className="p-4 pt-6 space-y-3">
       <Icon className={`w-8 h-8 ${color} group-hover:scale-110 transition-transform`} />
       <div>
         <p className="text-[10px] font-mono tracking-widest uppercase opacity-40">{category}</p>
         <h4 className="font-bold tracking-tight">{title}</h4>
       </div>
    </CardContent>
  </Card>
);

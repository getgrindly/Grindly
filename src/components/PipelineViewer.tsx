import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Server, 
  ShieldCheck, 
  Package, 
  Settings,
  ChevronRight,
  Activity,
  Terminal,
  Cpu
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StepStatus = 'pending' | 'running' | 'success' | 'failed';

interface PipelineStep {
  id: string;
  name: string;
  status: StepStatus;
  duration?: string;
  logs: string[];
}

export const PipelineViewer = () => {
  const [activePipeline, setActivePipeline] = useState<PipelineStep[]>([
    { id: '1', name: 'Linting & Static Analysis', status: 'pending', logs: [] },
    { id: '2', name: 'Unit Tests', status: 'pending', logs: [] },
    { id: '3', name: 'Container Build', status: 'pending', logs: [] },
    { id: '4', name: 'Security Audit', status: 'pending', logs: [] },
    { id: '5', name: 'Deploy to Staging', status: 'pending', logs: [] },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Ready for deployment trigger...']);

  const runPipeline = async () => {
    setIsRunning(true);
    setLogs(['[SYSTEM] Initializing pipeline GRINDLY-PROT-42...']);
    
    const updated = activePipeline.map(step => ({ ...step, status: 'pending' as StepStatus, logs: [] }));
    setActivePipeline(updated);

    for (let i = 0; i < updated.length; i++) {
      setCurrentStepIdx(i);
      setActivePipeline(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running' } : s));
      
      const stepLogs = [
        `> Executing ${updated[i].name}...`,
        `> Loading dependencies...`,
        `> Process ID: ${Math.floor(Math.random() * 9000) + 1000}`
      ];
      
      for (const log of stepLogs) {
        setLogs(prev => [...prev, log]);
        await new Promise(r => setTimeout(r, 400));
      }

      const success = Math.random() > 0.1;
      const finalStatus: StepStatus = success ? 'success' : 'failed';
      
      setActivePipeline(prev => prev.map((s, idx) => idx === i ? { ...s, status: finalStatus, duration: `${(Math.random() * 2 + 0.5).toFixed(1)}s` } : s));
      setLogs(prev => [...prev, success ? `✓ ${updated[i].name} completed.` : `✗ ${updated[i].name} failed.`]);
      
      if (!success) break;
      await new Promise(r => setTimeout(r, 800));
    }
    
    setIsRunning(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tighter uppercase italic flex items-center gap-3">
            <Activity className="w-8 h-8 text-accent-magenta" /> CI/CD Protocols
          </h1>
          <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">Pipeline ID: GRNDLY-PR-7429 // Production Grade</p>
        </div>
        <Button 
          onClick={runPipeline} 
          disabled={isRunning}
          className="bg-accent-magenta hover:bg-accent-magenta/80 text-white border-none h-12 px-8 font-mono text-xs uppercase tracking-widest gap-2 shadow-[0_0_20px_rgba(255,0,210,0.3)]"
        >
          {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Trigger_Deployment
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pipeline Map */}
        <div className="lg:col-span-12">
          <div className="relative flex justify-between items-center px-12 py-16 bg-black border border-white/5 rounded-sm overflow-hidden">
             {/* Connection Line */}
             <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 -translate-y-1/2 z-0" />
             
             {activePipeline.map((step, idx) => (
               <div key={step.id} className="relative z-10 flex flex-col items-center gap-4">
                 <motion.div 
                   animate={step.status === 'running' ? { scale: [1, 1.1, 1], boxShadow: ["0 0 0px #ff00d2", "0 0 20px #ff00d2", "0 0 0px #ff00d2"] } : {}}
                   className={cn(
                     "w-16 h-16 rounded flex items-center justify-center border transition-all duration-500",
                     step.status === 'pending' && "bg-black border-white/10 text-white/20",
                     step.status === 'running' && "bg-accent-magenta/10 border-accent-magenta text-accent-magenta",
                     step.status === 'success' && "bg-accent-green/10 border-accent-green text-accent-green",
                     step.status === 'failed' && "bg-destructive/10 border-destructive text-destructive",
                   )}
                 >
                   {idx === 0 && <ShieldCheck className="w-7 h-7" />}
                   {idx === 1 && <Cpu className="w-7 h-7" />}
                   {idx === 2 && <Package className="w-7 h-7" />}
                   {idx === 3 && <Settings className="w-7 h-7" />}
                   {idx === 4 && <Server className="w-7 h-7" />}
                 </motion.div>
                 
                 <div className="text-center space-y-1">
                   <p className={cn(
                     "text-[10px] font-mono font-bold uppercase tracking-tight max-w-[100px]",
                     step.status === 'running' ? "text-accent-magenta" : "text-muted-foreground"
                   )}>
                     {step.name}
                   </p>
                   {step.duration && (
                     <p className="text-[8px] font-mono opacity-40">{step.duration}</p>
                   )}
                 </div>

                 {step.status === 'running' && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                       <Badge className="bg-accent-magenta text-white text-[8px] font-mono uppercase">Processing...</Badge>
                    </div>
                 )}
               </div>
             ))}
          </div>
        </div>

        {/* Live Logs */}
        <Card className="lg:col-span-8 bg-black border-white/10 flex flex-col h-[400px]">
           <CardHeader className="py-3 border-b border-white/5 flex flex-row items-center justify-between">
              <CardTitle className="text-xs uppercase font-mono tracking-widest opacity-60 flex items-center gap-2">
                <Terminal className="w-3 h-3" /> System_Logs.stdout
              </CardTitle>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
              </div>
           </CardHeader>
           <CardContent className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-1">
              {logs.map((log, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -5 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  key={i} 
                  className={cn(
                    "leading-relaxed",
                    log.startsWith('✓') ? "text-accent-green" : 
                    log.startsWith('✗') ? "text-destructive" : 
                    log.startsWith('>') ? "text-muted-foreground" : "text-white/60"
                  )}
                >
                  <span className="opacity-20 mr-2">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                  {log}
                </motion.div>
              ))}
              {isRunning && <div className="w-1.5 h-3 bg-accent-magenta animate-pulse inline-block" />}
           </CardContent>
        </Card>

        {/* Resources */}
        <div className="lg:col-span-4 space-y-4">
           <Card className="bg-black border-white/10">
             <CardHeader className="py-3 border-b border-white/5">
                <CardTitle className="text-[10px] uppercase font-mono tracking-widest opacity-60">Cluster_Resources</CardTitle>
             </CardHeader>
             <CardContent className="p-4 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-muted-foreground">NEURAL_CPUS</span>
                    <span className="text-accent-cyan">42%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-accent-cyan" 
                      animate={{ width: isRunning ? '72%' : '42%' }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-muted-foreground">LOGIC_MEM</span>
                    <span className="text-accent-magenta">89.4 GB</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-accent-magenta" 
                      animate={{ width: isRunning ? '85%' : '65%' }}
                    />
                  </div>
                </div>
             </CardContent>
           </Card>

           <div className="p-4 bg-accent-magenta/5 border border-accent-magenta/20 rounded font-mono text-[10px] text-accent-magenta space-y-2">
              <div className="flex items-center gap-2">
                 <ShieldCheck className="w-3 h-3" />
                 <span>ENFORCED_PROTOCOL: AUTO_MERGE_OFF</span>
              </div>
              <p className="opacity-60 leading-relaxed italic">
                Production deployments require manual sign-off despite automated pipeline success markers.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Database, 
  Server, 
  Globe, 
  Layers, 
  Shield, 
  Zap,
  Trash2,
  Plus,
  Network
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Node {
  id: string;
  type: 'gateway' | 'service' | 'db' | 'cache' | 'bus';
  label: string;
  x: number;
  y: number;
}

const ICONS = {
  gateway: Globe,
  service: Server,
  db: Database,
  cache: Zap,
  bus: Network
};

export const ArchitectureCanvas = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', type: 'gateway', label: 'API Gateway', x: 50, y: 150 },
    { id: '2', type: 'service', label: 'User Service', x: 250, y: 150 },
    { id: '3', type: 'db', label: 'Postgres', x: 450, y: 150 },
  ]);

  const canvasRef = useRef<HTMLDivElement>(null);

  const addNode = (type: Node['type']) => {
    const newNode: Node = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: `New ${type}`,
      x: 100,
      y: 100
    };
    setNodes([...nodes, newNode]);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
        <div className="flex items-center gap-2">
           <Layers className="text-accent-cyan w-5 h-5" />
           <h2 className="text-xl font-bold uppercase tracking-tight">System Architect</h2>
        </div>
        <div className="flex gap-2">
           {(['gateway', 'service', 'db', 'cache', 'bus'] as const).map(type => (
             <Button 
               key={type} 
               variant="outline" 
               size="sm" 
               className="text-[10px] font-mono uppercase h-8 border-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/10"
               onClick={() => addNode(type)}
             >
               <Plus className="w-3 h-3 mr-1" />
               {type}
             </Button>
           ))}
        </div>
      </header>

      <div 
        ref={canvasRef}
        className="flex-1 relative overflow-hidden bg-black cyber-grid"
        style={{ backgroundSize: '40px 40px' }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-20">
           <svg width="100%" height="100%">
             {/* Simple straight line connections for now */}
             {nodes.length > 1 && nodes.slice(0, -1).map((node, i) => {
               const next = nodes[i+1];
               return (
                 <line 
                   key={i} 
                   x1={node.x + 80} 
                   y1={node.y + 40} 
                   x2={next.x + 80} 
                   y2={next.y + 40} 
                   stroke="currentColor" 
                   strokeWidth="1" 
                   className="text-accent-cyan"
                   strokeDasharray="4 4"
                 />
               );
             })}
           </svg>
        </div>

        {nodes.map(node => {
          const Icon = ICONS[node.type];
          return (
            <motion.div
              key={node.id}
              drag
              dragMomentum={false}
              onDragEnd={(_, info) => {
                setNodes(nodes.map(n => n.id === node.id ? { ...n, x: n.x + info.delta.x, y: n.y + info.delta.y } : n));
              }}
              className="absolute cursor-grab active:cursor-grabbing z-20 group"
              style={{ left: node.x, top: node.y }}
            >
              <Card className="w-40 bg-black border-accent-cyan/40 shadow-[0_0_15px_-5px_rgba(0,240,255,0.3)]">
                 <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => removeNode(node.id)}
                      className="bg-black border border-accent-magenta p-1 hover:bg-accent-magenta/20"
                    >
                      <Trash2 className="w-3 h-3 text-accent-magenta" />
                    </button>
                 </div>
                 <CardContent className="p-4 flex flex-col items-center gap-3">
                    <Icon className="w-8 h-8 text-accent-cyan" />
                    <div className="text-center space-y-1">
                       <p className="text-[9px] font-mono uppercase text-accent-cyan/60 tracking-wider font-bold">TYPE::{node.type}</p>
                       <p className="text-xs font-bold truncate w-28">{node.label}</p>
                    </div>
                 </CardContent>
              </Card>
            </motion.div>
          );
        })}

        <div className="absolute bottom-8 right-8 text-[10px] font-mono text-muted-foreground bg-black/80 px-4 py-2 border border-accent-cyan/20 z-30">
          DRAG_COMPONENTS_TO_RESTRUCTURE :: v1.0.4-BETA
        </div>
      </div>
    </div>
  );
};

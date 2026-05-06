import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, ChevronRight, Target, Cpu, Database, ShieldCheck, Network, Layers, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TRACKS } from '@/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const CurriculumView = ({ onBack }: { onBack?: () => void }) => {
  const [selectedTrackId, setSelectedTrackId] = React.useState<string | null>(null);

  const selectedTrack = TRACKS.find(t => t.id === selectedTrackId);

  if (selectedTrack) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-accent-green p-0 font-mono text-[10px]" 
            onClick={() => setSelectedTrackId(null)}
          >
            <ArrowLeft className="w-3 h-3 mr-2" /> BACK_TO_CURRICULUM
          </Button>
          <div className="flex items-center gap-3">
             <span className="text-4xl font-black text-accent-green/20 font-mono">0{TRACKS.indexOf(selectedTrack) + 1}</span>
             <h1 className="text-4xl font-bold tracking-tighter uppercase">{selectedTrack.title}</h1>
          </div>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">{selectedTrack.id}_track_v1.0</p>
        </header>

        <div className="space-y-16">
          {selectedTrack.lessons.map((lesson, idx) => (
            <motion.div 
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-6 pb-12 border-b border-white/5 last:border-0"
            >
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="border-accent-green/30 text-accent-green text-[10px] font-mono">
                  MOD_{idx + 1}
                </Badge>
                <Badge variant="outline" className="border-white/10 text-muted-foreground text-[10px] font-mono uppercase">
                  {lesson.category}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold tracking-tight">{lesson.title}</h3>
                <div className="prose prose-invert max-w-none prose-sm font-mono text-muted-foreground leading-relaxed">
                  <p className="border-l-2 border-accent-green/20 pl-4 italic">
                    {lesson.description}
                  </p>
                  <p className="pt-4 whitespace-pre-wrap">
                    {lesson.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <footer className="pt-12 border-t border-white/5 opacity-50 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
           <span>Protocol Index: {selectedTrack.id}_ACTIVE</span>
           <span>Architect_Verified</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <header className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-accent-green">
             <BookOpen className="w-5 h-5" />
             <span className="text-[10px] font-mono tracking-[0.3em] uppercase">Academic_Master_Protocol</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase">Engineering Curriculum</h1>
          <p className="text-muted-foreground max-w-2xl">
            A complete visualization of the Grindly engineering tracks. Master these disciplines to evolve from a 
            standard developer to a high-throughput systems architect.
          </p>
        </div>
        {onBack && (
          <Button variant="outline" size="sm" className="border-white/10 hover:border-accent-green/50 font-mono text-[10px]" onClick={onBack}>
            <ArrowLeft className="w-3 h-3 mr-2" /> EXIT_ARCHIVE
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 gap-16">
        {TRACKS.map((track, trackIdx) => (
          <motion.div 
            key={track.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: trackIdx * 0.1 }}
            className="relative cursor-pointer group"
            onClick={() => setSelectedTrackId(track.id)}
          >
            {/* Timeline Line */}
            <div className="absolute left-[-2rem] top-0 bottom-0 w-px bg-gradient-to-b from-accent-green/50 via-accent-green/10 to-transparent hidden md:block" />
            <div className="absolute left-[-2.25rem] top-2 w-2 h-2 rounded-full bg-accent-green shadow-[0_0_8px_#00ff00] hidden md:block" />

            <div className="space-y-6">
              <div className="flex items-end gap-4 group-hover:translate-x-2 transition-transform">
                <span className="text-5xl font-black text-white/5 font-mono select-none">0{trackIdx + 1}</span>
                <div className="pb-2">
                  <h2 className="text-2xl font-bold tracking-tight uppercase text-accent-green group-hover:text-white transition-colors">{track.title}</h2>
                  <p className="text-xs text-muted-foreground font-mono italic uppercase tracking-widest">{track.id}_track_v1.0</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {track.lessons.map((lesson, lessonIdx) => (
                  <Card key={lesson.id} className="bg-black/40 border-white/5 hover:border-accent-green/30 transition-all group/card overflow-hidden">
                    <CardHeader className="p-4 pb-2 border-b border-white/5 bg-white/[0.02]">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-[8px] font-mono border-accent-green/20 text-accent-green/50 uppercase">
                          {lesson.category}
                        </Badge>
                        <span className="text-[10px] font-mono text-white/10">MOD_{lessonIdx + 1}</span>
                      </div>
                      <CardTitle className="text-sm font-bold group-hover/card:text-accent-green transition-colors">{lesson.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {lesson.description}
                      </p>
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between opacity-40 group-hover/card:opacity-100 transition-opacity">
                         <div className="flex gap-1">
                            <div className="w-1 h-1 rounded-full bg-accent-green" />
                            <div className="w-1 h-1 rounded-full bg-accent-green" />
                         </div>
                         <div className="flex items-center gap-1 text-[8px] font-mono uppercase tracking-tighter text-accent-green">
                           View Details <ChevronRight className="w-3 h-3" />
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <footer className="pt-20 pb-10 border-t border-white/5">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-12 h-12 rounded-full border border-accent-green/20 flex items-center justify-center bg-accent-green/5">
            <Target className="w-6 h-6 text-accent-green" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-mono uppercase tracking-[0.2em] text-accent-green">Operational Excellence</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              The curriculum is dynamically updated based on global engineering trends and neural feedback from our most active participants.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

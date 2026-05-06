import React from 'react';
import { motion } from 'motion/react';
import { TRACKS } from '@/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lesson, TrackId } from '@/types';
import { ChevronRight, Layers, Layout, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import confetti from 'canvas-confetti';

export const TrackList = ({ trackId }: { trackId?: string }) => {
  const [selectedLesson, setSelectedLesson] = React.useState<Lesson | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  const completeLesson = async () => {
    if (!auth.currentUser || !selectedLesson) return;
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00ff00', '#00f0ff']
    });

    const userRef = doc(db, 'users', auth.currentUser.uid);
    const category = selectedLesson.category.toLowerCase();
    
    let trackField = 'progression.foundations';
    if (category.includes('architecture') || category.includes('database') || category.includes('design')) {
      trackField = 'progression.architecture';
    } else if (category.includes('workflow') || category.includes('testing')) {
      trackField = 'progression.workflow';
    }

    await updateDoc(userRef, {
      [trackField]: increment(10)
    });

    setSelectedLesson(null);
  };

  if (selectedLesson) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedLesson(null)}
          className="mb-4 text-accent-green"
        >
          &larr; BACK_TO_LAB
        </Button>
        
        <header className="space-y-4 pb-8 border-b border-accent-green/10">
          <Badge variant="outline" className="border-accent-green/50 text-accent-green uppercase font-mono text-[9px]">
            {selectedLesson.category}
          </Badge>
          <h1 className="text-5xl font-black uppercase tracking-tight italic">{selectedLesson.title}</h1>
          <p className="text-muted-foreground">{selectedLesson.description}</p>
        </header>

        <div className="prose prose-invert prose-green max-w-none prose-sm font-sans tracking-tight leading-relaxed">
           <ReactMarkdown>{selectedLesson.content}</ReactMarkdown>
        </div>

        <div className="pt-12 border-t border-accent-green/10">
           <Card className="bg-accent-green/5 border-accent-green/20">
             <CardHeader>
               <CardTitle className="text-sm flex items-center gap-2 tracking-widest uppercase">
                  <Info className="w-4 h-4" /> Lab Practical
               </CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-sm text-muted-foreground">Complete the theoretical study of this module to sync progression.</p>
                <Button 
                  onClick={completeLesson}
                  className="mt-4 bg-accent-green text-black hover:bg-accent-green/80 font-bold px-8"
                >
                  COMPLETE_MODULE
                </Button>
             </CardContent>
           </Card>
        </div>
      </div>
    );
  }

  const displayedTracks = trackId ? TRACKS.filter(t => t.id === trackId) : TRACKS;
  
  // Extract all unique categories
  const categories = Array.from(new Set(TRACKS.flatMap(t => t.lessons.map(l => l.category))));

  const filteredTracks = displayedTracks.map(track => ({
    ...track,
    lessons: track.lessons.filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !activeCategory || lesson.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
  })).filter(track => track.lessons.length > 0);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold tracking-tighter uppercase">Curated Tracks</h2>
          <p className="text-muted-foreground">Select a discipline to deepen your engineering intuition.</p>
        </div>
        
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <div className="flex gap-2">
            <input 
              type="text"
              placeholder="Search modules..."
              className="bg-black border border-white/10 px-3 py-1.5 text-xs font-mono focus:border-accent-green outline-none w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge 
              variant={!activeCategory ? "default" : "outline"} 
              className={cn("text-[8px] uppercase font-mono cursor-pointer", !activeCategory && "bg-accent-green text-black")}
              onClick={() => setActiveCategory(null)}
            >
              All
            </Badge>
            {categories.map(cat => (
              <Badge 
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                className={cn("text-[8px] uppercase font-mono cursor-pointer", activeCategory === cat && "bg-accent-green text-black")}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
        {filteredTracks.map(track => (
          <div key={track.id} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
               <Layers className="text-accent-cyan w-5 h-5" />
               <h3 className="text-xl font-bold uppercase tracking-tight">{track.title}</h3>
            </div>
            <div className="space-y-4">
              {track.lessons.map(lesson => (
                <motion.div
                  key={lesson.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedLesson(lesson)}
                  className="group flex items-center justify-between p-4 bg-black border border-white/10 hover:border-accent-cyan/50 cursor-pointer transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono uppercase text-accent-cyan/50 tracking-widest">{lesson.category}</p>
                    </div>
                    <h4 className="font-bold">{lesson.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{lesson.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 text-accent-cyan transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
        {filteredTracks.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10">
            <p className="text-muted-foreground font-mono uppercase tracking-widest">No modules matching criteria found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

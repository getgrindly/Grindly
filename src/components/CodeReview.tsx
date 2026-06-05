import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, CheckCircle2, ShieldAlert, Sparkles, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { REVIEW_CHALLENGES } from '@/constants';
import { evaluateCode } from '@/services/geminiService';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import confetti from 'canvas-confetti';

export const CodeReview = () => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const challenge = REVIEW_CHALLENGES[challengeIndex];
  const [userCode, setUserCode] = useState(challenge.badCode);
  const [result, setResult] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);

  useEffect(() => {
    setUserCode(challenge.badCode);
    setResult(null);
  }, [challengeIndex]);

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    const feedback = await evaluateCode(userCode, challenge.principles);
    setResult(feedback);
    setIsEvaluating(false);

    if (feedback && feedback.score >= 80) {
      if (!completedChallenges.includes(challengeIndex)) {
        setCompletedChallenges([...completedChallenges, challengeIndex]);
      }
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ff00', '#00f0ff', '#ff00ff']
      });

      // Update progression in Firestore or local fallback
      if (auth.currentUser) {
        try {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          await updateDoc(userRef, {
            'progression.workflow': increment(5)
          });
        } catch (e) {
          console.warn("Cloud connection bypassed in code review. Storing progression locally.", e);
          const key = 'grindly_progression_' + auth.currentUser.uid;
          const current = JSON.parse(localStorage.getItem(key) || '{"foundations":0,"architecture":0,"workflow":0}');
          current.workflow = (current.workflow || 0) + 5;
          localStorage.setItem(key, JSON.stringify(current));
          window.dispatchEvent(new Event('grindly-sync'));
        }
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tighter uppercase glitch-text">Neural Code Review</h2>
          <div className="flex items-center gap-4">
             <p className="text-muted-foreground text-sm">Refactor the logic below to meet established engineering standards.</p>
             <div className="flex gap-1">
               {REVIEW_CHALLENGES.map((_, i) => (
                 <div 
                  key={i} 
                  className={cn(
                    "w-8 h-1 rounded-full bg-white/5 overflow-hidden",
                    challengeIndex === i && "bg-white/10"
                  )}
                 >
                   {completedChallenges.includes(i) && (
                     <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-accent-green" />
                   )}
                   {challengeIndex === i && !completedChallenges.includes(i) && (
                     <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="h-full bg-accent-magenta" />
                   )}
                 </div>
               ))}
             </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 border-white/10"
            onClick={() => setChallengeIndex(Math.max(0, challengeIndex - 1))}
            disabled={challengeIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 border-white/10"
            onClick={() => setChallengeIndex(Math.min(REVIEW_CHALLENGES.length - 1, challengeIndex + 1))}
            disabled={challengeIndex === REVIEW_CHALLENGES.length - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        {/* Editor Half */}
        <div className="flex flex-col gap-4">
           <Card className="bg-black border-accent-magenta/30 flex-1 flex flex-col overflow-hidden">
             <CardHeader className="py-3 items-center flex flex-row justify-between border-b border-accent-magenta/10">
                <CardTitle className="text-xs uppercase tracking-widest font-mono text-accent-magenta">Editor_Input</CardTitle>
                <div className="flex gap-2">
                  {challenge.principles.map(p => (
                    <Badge key={p} variant="outline" className="text-[9px] border-accent-magenta/50 text-accent-magenta">{p}</Badge>
                  ))}
                </div>
             </CardHeader>
             <textarea
               className="flex-1 bg-transparent p-6 font-mono text-sm resize-none focus:outline-none text-accent-magenta/80"
               value={userCode}
               onChange={(e) => setUserCode(e.target.value)}
             />
           </Card>
           <Button 
             className="bg-accent-magenta text-black hover:bg-accent-magenta/80 font-bold"
             onClick={handleEvaluate}
             disabled={isEvaluating}
           >
             {isEvaluating ? "Analyzing Logic..." : "Submit for Architecture Review"}
           </Button>
        </div>

        {/* Feedback Half */}
        <div className="flex flex-col gap-4 overflow-hidden">
           {result ? (
             <ScrollArea className="flex-1">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="space-y-4 pb-8"
               >
                 <Card className="bg-black border-accent-green/40">
                   <CardHeader className="flex flex-row items-center justify-between">
                     <CardTitle className="text-xl flex items-center gap-2">
                       <CheckCircle2 className="text-accent-green" />
                       Evaluation Result
                     </CardTitle>
                     <div className="text-4xl font-bold text-accent-green">{result.score}%</div>
                   </CardHeader>
                   <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">Maintainability</p>
                          <p className="text-sm font-medium">{result.maintainability}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">Scalability</p>
                          <p className="text-sm font-medium">{result.scalability}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">Architect Suggestions</p>
                        <ul className="space-y-2">
                          {result.suggestions.map((s: string, i: number) => (
                            <li key={i} className="text-xs flex items-start gap-2">
                               <Sparkles className="w-3 h-3 text-accent-green flex-shrink-0 mt-0.5" />
                               {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                   </CardContent>
                 </Card>

                 <Card className="bg-black border-white/10">
                   <CardHeader className="py-3 border-b border-white/5">
                      <CardTitle className="text-xs uppercase font-mono">Suggested Refactoring</CardTitle>
                   </CardHeader>
                   <CardContent className="p-4 pt-6">
                      <pre className="text-xs font-mono text-accent-cyan p-4 bg-white/5 overflow-x-auto">
                        {result.refactoredCode}
                      </pre>
                   </CardContent>
                 </Card>
               </motion.div>
             </ScrollArea>
           ) : (
             <div className="flex-1 border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-8 opacity-40">
                <Brain className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold uppercase tracking-tight">Pending Evaluation</h3>
                <p className="text-sm max-w-[280px]">The Architect AI is awaiting your refactored submission. Focus on clean code principles.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { CheckSquare, Square, Plus, Trash2, Zap, AlertCircle, ChevronDown, ChevronUp, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { doc, updateDoc, onSnapshot, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;
    
    const uid = auth.currentUser.uid;
    const loadLocalTasks = () => {
      const saved = localStorage.getItem('grindly_tasks_' + uid);
      if (saved) {
        setTasks(JSON.parse(saved));
      } else {
        const defaultRoadmap: Task[] = [
          { id: '1', text: 'Initialize local coding sandbox', completed: true, priority: 'high' },
          { id: '2', text: 'Optimize TypeScript build pipeline', completed: false, priority: 'medium' },
          { id: '3', text: 'Conduct distributed systems audit', completed: false, priority: 'low' }
        ];
        localStorage.setItem('grindly_tasks_' + uid, JSON.stringify(defaultRoadmap));
        setTasks(defaultRoadmap);
      }
      setLoading(false);
    };

    const userRef = doc(db, 'users', uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().tasks) {
        setTasks(docSnap.data().tasks || []);
        localStorage.setItem('grindly_tasks_' + uid, JSON.stringify(docSnap.data().tasks || []));
      } else {
        loadLocalTasks();
      }
      setLoading(false);
    }, (error) => {
      console.warn("Cloud task synchronization bypassed. Running local task database.", error);
      loadLocalTasks();
    });
    
    return () => unsubscribe();
  }, []);

  const syncTasks = async (newTasks: Task[], performCloudWrite: () => Promise<void>) => {
    setTasks(newTasks);
    if (auth.currentUser) {
      localStorage.setItem('grindly_tasks_' + auth.currentUser.uid, JSON.stringify(newTasks));
    }
    
    try {
      await performCloudWrite();
    } catch (e) {
      console.warn("Cloud task record update bypassed. Local state preserved.", e);
    }
  };

  const addTask = async () => {
    if (!newTask.trim() || !auth.currentUser) return;
    
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      text: newTask,
      completed: false,
      priority: priority
    };

    const updated = [...tasks, task];
    await syncTasks(updated, async () => {
      const userRef = doc(db, 'users', auth.currentUser!.uid);
      await updateDoc(userRef, {
        tasks: arrayUnion(task)
      });
    });

    setNewTask('');
    setPriority('medium');
  };

  const updateTaskPriority = async (task: Task, nextPriority: 'low' | 'medium' | 'high') => {
    if (!auth.currentUser) return;
    
    const updatedTasks = tasks.map(t => 
      t.id === task.id ? { ...t, priority: nextPriority } : t
    );

    await syncTasks(updatedTasks, async () => {
      const userRef = doc(db, 'users', auth.currentUser!.uid);
      await updateDoc(userRef, { tasks: updatedTasks });
    });
  };

  const toggleTask = async (task: Task) => {
    if (!auth.currentUser) return;
    
    const updatedTasks = tasks.map(t => 
      t.id === task.id ? { ...t, completed: !t.completed } : t
    );

    await syncTasks(updatedTasks, async () => {
      const userRef = doc(db, 'users', auth.currentUser!.uid);
      await updateDoc(userRef, { tasks: updatedTasks });
    });
  };

  const deleteTask = async (task: Task) => {
    if (!auth.currentUser) return;
    
    const updatedTasks = tasks.filter(t => t.id !== task.id);

    await syncTasks(updatedTasks, async () => {
      const userRef = doc(db, 'users', auth.currentUser!.uid);
      await updateDoc(userRef, {
        tasks: arrayRemove(task)
      });
    });
  };

  return (
    <Card className="bg-black border-white/10 h-full flex flex-col">
      <CardHeader className="py-4 border-b border-white/5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-accent-magenta" />
          <CardTitle className="text-sm font-mono tracking-widest uppercase">Engineer Roadmap</CardTitle>
        </div>
        <Badge variant="outline" className="text-[10px] border-accent-magenta/30 text-accent-magenta">
          {tasks.filter(t => !t.completed).length} ACTIVE_THREADS
        </Badge>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input 
              placeholder="New technical objective..." 
              className="bg-black border-white/10 text-xs font-mono h-9"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <Button size="icon" className="bg-accent-magenta text-white h-9 w-9 shrink-0" onClick={addTask}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-1">
             {(['low', 'medium', 'high'] as const).map((p) => (
               <button
                 key={p}
                 onClick={() => setPriority(p)}
                 className={cn(
                   "px-2 py-0.5 rounded text-[8px] font-mono uppercase transition-all border",
                   priority === p 
                    ? (p === 'high' ? "bg-destructive/20 border-destructive text-destructive shadow-[0_0_8px_rgba(239,68,68,0.3)]" : 
                       p === 'medium' ? "bg-accent-magenta/20 border-accent-magenta text-accent-magenta shadow-[0_0_8px_rgba(255,0,210,0.3)]" : 
                       "bg-accent-cyan/20 border-accent-cyan text-accent-cyan shadow-[0_0_8px_rgba(0,240,255,0.3)]")
                    : "bg-white/5 border-transparent text-muted-foreground hover:bg-white/10"
                 )}
               >
                 {p}
               </button>
             ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5 group hover:border-accent-magenta/30 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <button onClick={() => toggleTask(task)} className="text-accent-magenta shrink-0">
                    {task.completed ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 opacity-40" />}
                  </button>
                  <div className="flex flex-col">
                    <span className={`text-xs font-mono ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {task.text}
                    </span>
                    <span className={cn(
                      "text-[8px] font-mono uppercase tracking-widest",
                      task.priority === 'high' ? "text-destructive" : 
                      task.priority === 'medium' ? "text-accent-magenta" : "text-accent-cyan"
                    )}>
                      {task.priority}_priority
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => updateTaskPriority(task, task.priority === 'low' ? 'medium' : task.priority === 'medium' ? 'high' : 'high')}
                      className="p-0.5 text-muted-foreground hover:text-white"
                    >
                      <ChevronUp className="w-2.5 h-2.5" />
                    </button>
                    <button 
                      onClick={() => updateTaskPriority(task, task.priority === 'high' ? 'medium' : task.priority === 'medium' ? 'low' : 'low')}
                      className="p-0.5 text-muted-foreground hover:text-white"
                    >
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <button 
                    onClick={() => deleteTask(task)}
                    className="p-1 text-muted-foreground hover:text-accent-magenta transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

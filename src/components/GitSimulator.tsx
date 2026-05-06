import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GitBranch, GitCommit, GitPullRequest, Terminal, History, CheckCircle2, AlertCircle, RefreshCw, ArrowDown, ArrowUp, Zap, Trash2, GitMerge, ListFilter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AnimatePresence } from 'motion/react';

export const GitSimulator = () => {
  const [branch, setBranch] = useState('main');
  const [branches, setBranches] = useState(['main']);
  const [stashes, setStashes] = useState<string[][]>([]);
  const [stagedFiles, setStagedFiles] = useState<string[]>([]);
  const [commitMessage, setCommitMessage] = useState('');
  const [history, setHistory] = useState<Array<{hash: string, msg: string, branch: string}>>([
    { hash: 'a1b2c3d', msg: 'initial architect commit', branch: 'main' }
  ]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [logFilter, setLogFilter] = useState('');
  const [showStashList, setShowStashList] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [remoteAhead, setRemoteAhead] = useState(false);
  const [conflict, setConflict] = useState<{ file: string; incoming: string; current: string } | null>(null);

  const log = (msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTerminalOutput(prev => [...prev, `[${time}] ${msg}`]);
  };

  React.useEffect(() => {
    log('$ git init');
    log('Initialized empty Grindly repository');
  }, []);

  const addFile = (file: string) => {
    if (!stagedFiles.includes(file)) {
      setStagedFiles([...stagedFiles, file]);
      log(`$ git add ${file}`);
    }
  };

  const commit = () => {
    if (!commitMessage || stagedFiles.length === 0) return;
    
    const hash = Math.random().toString(16).substr(2, 7);
    setHistory([{ hash, msg: commitMessage, branch }, ...history]);
    setStagedFiles([]);
    setCommitMessage('');
    log(`$ git commit -m "${commitMessage}"`);
    log(`[${branch} ${hash}] ${commitMessage}`);
    log(` ${stagedFiles.length} files changed`);
  };

  const handleStash = () => {
    if (stagedFiles.length === 0) {
      log(`! No local changes to save`);
      return;
    }
    setStashes([stagedFiles, ...stashes]);
    setStagedFiles([]);
    log(`$ git stash`);
    log(`Saved working directory and index state WIP on ${branch}: ${history[0].hash.substring(0, 7)}`);
  };

  const handleStashPop = () => {
    if (stashes.length === 0) return;
    const [popped, ...remaining] = stashes;
    setStagedFiles([...stagedFiles, ...popped]);
    setStashes(remaining);
    setShowStashList(false);
    log(`$ git stash pop`);
    log(`On branch ${branch}`);
    log(`Changes to be committed:`);
    popped.forEach(f => log(`  modified: ${f}`));
  };

  const fetchRemotes = () => {
    setIsFetching(true);
    log(`$ git fetch origin`);
    setTimeout(() => {
      setIsFetching(false);
      setRemoteAhead(true);
      log(`remote: Enumerating objects: 3, done.`);
      log(`remote: Total 3 (delta 1), reused 0 (delta 0), pack-reused 0`);
      log(`From grindly-vault.git`);
      log(`   ${history[0].hash.substring(0, 7)}..${Math.random().toString(16).substr(2, 7)}  main -> origin/main`);
    }, 1200);
  };

  const pullRemotes = () => {
    if (!remoteAhead) {
      log(`$ git pull origin ${branch}`);
      log(`Already up to date.`);
      return;
    }
    log(`$ git pull origin ${branch}`);
    setTimeout(() => {
      setRemoteAhead(false);
      const hash = Math.random().toString(16).substr(2, 7);
      setHistory([{ hash, msg: 'Reconciled with origin', branch: 'main' }, ...history]);
      log(`Updating ${history[0].hash.substring(0, 7)}..${hash}`);
      log(`Fast-forward`);
    }, 800);
  };

  const push = () => {
    if (remoteAhead) {
      log(`! Rejected: Remote contains work you do not have locally.`);
      log(`! Hint: Use 'git pull' before pushing again.`);
      return;
    }
    setIsPushing(true);
    log(`$ git push origin ${branch}`);
    setTimeout(() => {
      setIsPushing(false);
      log(`Writing objects: 100% (3/3), 294 bytes, done.`);
      log(`To grindly-vault.git`);
      log(`   ${history[0].hash.substring(0, 7)}..${history[0].hash.substring(0, 7)}  ${branch} -> ${branch}`);
    }, 1500);
  };

  const checkoutNewBranch = () => {
    const name = prompt('New branch name:')?.trim();
    if (name && !branches.includes(name)) {
      setBranches([...branches, name]);
      setBranch(name);
      log(`$ git checkout -b ${name}`);
      log(`Switched to a new branch '${name}'`);
    } else if (name) {
      setBranch(name);
      log(`$ git checkout ${name}`);
      log(`Switched to branch '${name}'`);
    }
  };

  const switchBranch = (name: string) => {
    setBranch(name);
    log(`$ git checkout ${name}`);
    log(`Switched to branch '${name}'`);
  };

  const deleteBranch = (name: string) => {
    if (name === 'main') {
      log(`! error: cannot delete the main protocol branch`);
      return;
    }
    if (name === branch) {
      log(`! error: cannot delete the active branch '${name}'`);
      return;
    }
    log(`$ git branch -d ${name}`);
    setTimeout(() => {
      setBranches(branches.filter(b => b !== name));
      log(`Deleted branch ${name} (was ${history.find(h => h.branch === name)?.hash || '0000000'}).`);
    }, 600);
  };

  const resolveConflict = (resolution: 'current' | 'incoming') => {
    if (!conflict) return;
    const hash = Math.random().toString(16).substr(2, 7);
    setHistory([{ hash, msg: `Resolved conflict in ${conflict.file}`, branch: 'main' }, ...history]);
    log(`Resolved conflict using ${resolution} version`);
    log(`Fixed: ${conflict.file}`);
    setConflict(null);
  };

  const merge = () => {
    if (branch === 'main') {
      const fromBranch = prompt('Merge from branch:');
      if (fromBranch && branches.includes(fromBranch) && fromBranch !== 'main') {
        if (Math.random() > 0.4) { // Higher chance for simulation
          setConflict({
            file: 'architecture.json',
            current: '"load_balancer": "nginx"',
            incoming: '"load_balancer": "envoy"'
          });
          log(`$ git merge ${fromBranch}`);
          log(`CONFLICT (content): Merge conflict in architecture.json`);
          log(`Automatic merge failed; fix conflicts and then commit the result.`);
        } else {
          const hash = Math.random().toString(16).substr(2, 7);
          setHistory([{ hash, msg: `Merge branch '${fromBranch}'`, branch: 'main' }, ...history]);
          log(`$ git merge ${fromBranch}`);
          log(`Updating ${history[0].hash.substring(0, 7)}..${hash}`);
          log(`Fast-forward`);
        }
      }
    } else {
      log(`! merge error: merge only permitted to main protocol`);
    }
  };

  const rebase = () => {
    if (branch === 'main') {
      log(`! rebase error: do not rebase the main protocol branch`);
      return;
    }
    log(`$ git rebase main`);
    setTimeout(() => {
      // Simulate moving commits to a new base
      const updatedHistory = history.map(h => 
        h.branch === branch ? { ...h, hash: Math.random().toString(16).substr(2, 7), msg: h.msg + ' (rebased)' } : h
      );
      setHistory(updatedHistory);
      log(`First, rewinding head to replay your work on top of it...`);
      log(`Applying: ${history.find(h => h.branch === branch)?.msg || 'Local work'}`);
      log(`Successfully rebased and updated refs/heads/${branch}.`);
    }, 1000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter uppercase glitch-text">Source Control Simulation</h2>
          <p className="text-muted-foreground text-sm font-mono italic">Grindly_Git_Protocol :: Version 1.1.0</p>
        </div>
        <div className="flex gap-2">
          {history.length > 1 && (
            <div className="flex gap-1 mr-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-8 w-8 text-muted-foreground hover:text-accent-cyan", isFetching && "animate-spin text-accent-cyan")}
                onClick={fetchRemotes}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-8 w-8 text-muted-foreground hover:text-accent-magenta", remoteAhead && "animate-bounce text-accent-magenta")}
                onClick={pullRemotes}
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 border-white/10 text-muted-foreground text-[10px] uppercase font-mono hover:text-accent-cyan"
            onClick={handleStash}
          >
            Stash
          </Button>
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 border-white/10 text-muted-foreground text-[10px] uppercase font-mono hover:text-accent-cyan disabled:opacity-20"
              onClick={() => setShowStashList(!showStashList)}
              disabled={stashes.length === 0}
            >
              Pop ({stashes.length})
            </Button>
            <AnimatePresence>
              {showStashList && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-10 right-0 w-64 bg-black border border-white/10 p-4 z-30 shadow-2xl space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-accent-cyan">Stash Entries</span>
                    <Badge variant="outline" className="text-[8px]">{stashes.length}</Badge>
                  </div>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {stashes.map((s, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono text-muted-foreground">stash@{i}</span>
                          <button 
                            onClick={handleStashPop}
                            className="text-[8px] uppercase font-bold text-accent-cyan hover:underline"
                          >
                            Apply & Pop
                          </button>
                        </div>
                        <div className="p-2 bg-white/5 rounded text-[8px] font-mono text-white/40">
                          {s.length} files: {s.slice(0, 2).join(', ')}{s.length > 2 && '...'}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2 pr-2 border-r border-white/10 mr-2">
            <Badge variant="outline" className="text-[9px] border-accent-cyan/30 text-accent-cyan flex gap-1 items-center">
              <Zap className="w-2.5 h-2.5" /> {branch.toUpperCase()}
            </Badge>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 border-accent-cyan/30 text-accent-cyan text-[10px] uppercase font-mono"
            onClick={checkoutNewBranch}
          >
            <GitBranch className="w-3 h-3 mr-2" />
            New
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
        {/* Branches UI */}
        <div className="lg:col-span-1 border border-white/10 bg-black/40 p-4 flex flex-col space-y-4">
          <div className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground flex items-center gap-2">
             <GitBranch className="w-3 h-3" /> Branches
          </div>
          <div className="space-y-1">
            {branches.map(b => (
              <button
                key={b}
                onClick={() => switchBranch(b)}
                className={cn(
                  "w-full text-left px-3 py-2 text-xs font-mono transition-all flex items-center justify-between group",
                  branch === b ? "bg-accent-cyan/10 text-accent-cyan border-l-2 border-accent-cyan" : "text-muted-foreground hover:bg-white/5"
                )}
              >
                <span>{b}</span>
                {branch === b && <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_#00f0ff]" />}
                {b !== 'main' && branch !== b && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 hover:text-accent-magenta"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBranch(b);
                    }}
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </Button>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Workspace */}
        <Card className="lg:col-span-2 bg-black border-white/10 overflow-hidden flex flex-col relative">
          <CardHeader className="py-3 border-b border-white/5 flex flex-row items-center justify-between">
             <CardTitle className="text-xs uppercase font-mono tracking-widest opacity-60">Working Workspace</CardTitle>
             <GitPullRequest className="w-3 h-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {['main.js', 'architecture.json', 'README.md', 'api_v2.ts'].map(file => (
               <div key={file} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded group hover:border-white/20 transition-all">
                  <span className="text-sm font-mono">{file}</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-7 text-[10px] font-bold text-accent-green opacity-0 group-hover:opacity-100"
                    onClick={() => addFile(file)}
                  >
                    ADD
                  </Button>
               </div>
            ))}
          </CardContent>

          {/* Conflict Resolution Overlay */}
          <AnimatePresence>
            {conflict && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="absolute inset-0 bg-black/95 z-20 flex flex-col p-6 backdrop-blur-sm"
              >
                <div className="text-accent-magenta font-mono text-[10px] mb-4 uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Merge Conflict Detected
                </div>
                <div className="flex-1 border border-accent-magenta/20 rounded bg-accent-magenta/5 overflow-hidden flex flex-col">
                  <div className="p-2 bg-accent-magenta/10 border-b border-accent-magenta/20 text-[10px] font-mono text-center">
                    {conflict.file}
                  </div>
                  
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    <div className="space-y-2">
                      <div className="text-[9px] uppercase font-mono text-accent-cyan flex justify-between">
                        <span>Current Changes</span>
                        <Badge variant="outline" className="text-[8px] border-accent-cyan/30 text-accent-cyan">HEAD</Badge>
                      </div>
                      <div className="p-3 bg-black border border-accent-cyan/10 text-xs font-mono text-accent-cyan/80 rounded leading-relaxed">
                        {conflict.current}
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full h-8 text-[9px] bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 uppercase font-mono"
                        onClick={() => resolveConflict('current')}
                      >
                        Keep Current
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[9px] uppercase font-mono text-accent-magenta flex justify-between">
                        <span>Incoming Changes</span>
                        <Badge variant="outline" className="text-[8px] border-accent-magenta/30 text-accent-magenta">REMOTE</Badge>
                      </div>
                      <div className="p-3 bg-black border border-accent-magenta/10 text-xs font-mono text-accent-magenta/80 rounded leading-relaxed">
                        {conflict.incoming}
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full h-8 text-[9px] bg-accent-magenta/10 hover:bg-accent-magenta/20 text-accent-magenta border border-accent-magenta/30 uppercase font-mono"
                        onClick={() => resolveConflict('incoming')}
                      >
                        Accept Incoming
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Staging & Commits */}
        <div className="space-y-6 flex flex-col">
           <Card className="bg-black border-accent-cyan/30 flex-1 shadow-[0_0_15px_-5px_rgba(0,240,255,0.1)]">
             <CardHeader className="py-3 border-b border-accent-cyan/10">
                <CardTitle className="text-xs uppercase font-mono tracking-widest text-accent-cyan">Staging Area</CardTitle>
             </CardHeader>
             <CardContent className="p-4 space-y-2">
                {stagedFiles.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-10 text-center">No files staged for commit.</p>
                ) : (
                  stagedFiles.map(file => (
                    <div key={file} className="flex items-center gap-2 text-accent-cyan font-mono text-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      {file}
                    </div>
                  ))
                )}
             </CardContent>
           </Card>

           <div className="bg-black/50 border border-accent-cyan/20 p-4 space-y-4">
              <Input 
                placeholder="Commit message..." 
                className="bg-black border-white/10 text-xs font-mono focus-visible:ring-accent-cyan"
                value={commitMessage}
                onChange={e => setCommitMessage(e.target.value)}
              />
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-accent-cyan text-black hover:bg-accent-cyan/80 font-bold text-xs"
                  onClick={commit}
                  disabled={!commitMessage || stagedFiles.length === 0}
                >
                  <GitCommit className="w-4 h-4 mr-2" />
                  COMMIT
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 border-accent-green/40 text-accent-green hover:bg-accent-green/10 font-bold text-xs"
                  onClick={push}
                  disabled={isPushing || history.length < 2}
                >
                  {isPushing ? 'PUSHING...' : 'PUSH_ORIGIN'}
                </Button>
              </div>
              <Button 
                variant="ghost"
                className="w-full h-8 text-[10px] font-mono text-muted-foreground hover:text-white"
                onClick={merge}
              >
                Merge into active branch
              </Button>
              <Button 
                variant="ghost"
                className="w-full h-8 text-[10px] font-mono text-muted-foreground hover:text-accent-cyan"
                onClick={rebase}
              >
                Rebase onto main
              </Button>
           </div>
        </div>

        {/* History & Terminal */}
        <div className="flex flex-col gap-6 overflow-hidden">
           <Card className="bg-black border-white/10 h-1/2 flex flex-col overflow-hidden">
             <CardHeader className="py-3 border-b border-white/5 flex flex-row items-center justify-between">
                <CardTitle className="text-xs uppercase font-mono tracking-widest opacity-60">Commit History</CardTitle>
                <div className="relative flex items-center">
                   <ListFilter className="w-3 h-3 absolute left-2 text-muted-foreground" />
                   <input 
                     type="text" 
                     placeholder="Filter logs..."
                     className="bg-white/5 border border-white/10 rounded px-7 py-1 text-[9px] font-mono focus:outline-none focus:border-accent-cyan/50 w-32"
                     value={logFilter}
                     onChange={(e) => setLogFilter(e.target.value)}
                   />
                </div>
             </CardHeader>
             <ScrollArea className="flex-1 p-4">
                <div className="space-y-0">
                   {history
                    .filter(h => h.msg.toLowerCase().includes(logFilter.toLowerCase()) || h.hash.includes(logFilter))
                    .map((h, i, arr) => (
                    <div key={h.hash} className="flex gap-4 relative group">
                        {/* Graph Column */}
                        <div className="w-8 flex flex-col items-center shrink-0">
                           {/* Vertical connector */}
                           <div className={cn(
                             "w-px h-full bg-white/10 relative",
                             i === 0 && "h-1/2 mt-auto", // Start of line
                             i === arr.length - 1 && "h-1/2 mb-auto" // End of line
                           )}>
                              {/* Node */}
                              <div className={cn(
                                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 z-10",
                                i === 0 ? "bg-accent-cyan border-accent-cyan shadow-[0_0_8px_#00f0ff]" : "bg-black border-white/20 group-hover:border-accent-cyan/50"
                              )} />
                           </div>
                        </div>

                        <div className="flex-1 min-w-0 py-3 border-b border-white/5 group-last:border-0">
                           <div className="flex justify-between items-start gap-4">
                              <p className={cn(
                                "text-[11px] font-bold truncate transition-colors",
                                i === 0 ? "text-accent-cyan" : "text-foreground/80"
                              )}>{h.msg}</p>
                              <code className="text-[9px] text-muted-foreground bg-white/5 px-1 rounded font-mono shrink-0">{h.hash}</code>
                           </div>
                           <div className="flex items-center gap-2 mt-1.5 font-mono">
                              <div className={cn(
                                "px-1.5 py-0.5 border rounded text-[8px] uppercase font-bold",
                                h.branch === 'main' ? "border-accent-cyan/20 text-accent-cyan/60" : "border-accent-magenta/20 text-accent-magenta/60"
                              )}>
                                {h.branch}
                              </div>
                              <span className="text-[8px] text-white/20">{(Math.random() * 5).toFixed(0)}m ago</span>
                           </div>
                        </div>
                    </div>
                  ))}
                </div>
             </ScrollArea>
           </Card>

           <Card className="bg-black border-accent-green/20 h-1/2 flex flex-col overflow-hidden">
             <CardHeader className="py-2 border-b border-accent-green/10 bg-accent-green/5 flex flex-row items-center justify-between">
                <CardTitle className="text-[9px] uppercase font-mono tracking-widest text-accent-green">Git_Terminal</CardTitle>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                </div>
             </CardHeader>
             <ScrollArea className="flex-1 p-4 font-mono text-[11px] text-accent-green/80">
                {terminalOutput.map((out, i) => (
                  <div key={i} className="mb-1 leading-tight flex gap-2">
                    <span className="opacity-20 select-none">[{Math.floor(i/10)}:{i%10}]</span>
                    {out}
                  </div>
                ))}
             </ScrollArea>
           </Card>
        </div>
      </div>
    </div>
  );
};

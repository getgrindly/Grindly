import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  File, 
  FolderIcon, 
  Play, 
  Save, 
  Trash2, 
  Plus, 
  Terminal as TerminalIcon,
  X,
  FileCode,
  ChevronRight,
  ChevronDown,
  Hash,
  Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { INITIAL_SANDBOX } from '@/constants';
import { ScrollArea } from '@/components/ui/scroll-area';

export const Sandbox = () => {
  const [files, setFiles] = useState(INITIAL_SANDBOX);
  const [activeFile, setActiveFile] = useState('main.js');
  const [openFiles, setOpenFiles] = useState<string[]>(['main.js', 'api.js']);
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['src', 'config']);
  const [output, setOutput] = useState<string[]>(['System initialization...', 'Awaiting orders...']);

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.js') || filename.endsWith('.ts')) return <FileCode className="w-3.5 h-3.5 text-accent-cyan" />;
    if (filename.endsWith('.json')) return <Hash className="w-3.5 h-3.5 text-accent-magenta" />;
    if (filename.endsWith('.db') || filename === 'schema.sql') return <Database className="w-3.5 h-3.5 text-accent-green" />;
    return <File className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  const fileTree = [
    { type: 'folder', name: 'src', children: ['main.js', 'api.js', 'utils.ts'] },
    { type: 'folder', name: 'config', children: ['architecture.json', 'env.json'] },
    { type: 'file', name: 'README.md' }
  ];

  const toggleFolder = (name: string) => {
    setExpandedFolders(prev => 
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
    );
  };
  const [isSaving, setIsSaving] = useState(false);

  const runCode = () => {
    setOutput(prev => [...prev, `> Executing ${activeFile}...`, `> STATUS: Linting code for architectural flaws...`, `> LOG: Processing logical branches`, `> COMPLETE: Operation efficient. No leaks detected.`]);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setOutput(prev => [...prev, `> Changes persistent in grind-vault_${activeFile}`]);
    }, 800);
  };

  const createNewFile = () => {
    const name = prompt('Filename:');
    if (name && !files[name]) {
      setFiles({
        ...files,
        [name]: { content: '// New module initialization\n' }
      });
      selectFile(name);
    }
  };

  const deleteFile = (name: string) => {
    if (name === 'main.js') return; // Protect entry point
    const newFiles = { ...files };
    delete newFiles[name];
    setFiles(newFiles);
    
    setOpenFiles(openFiles.filter(f => f !== name));
    if (activeFile === name) {
      setActiveFile('main.js');
    }
  };

  const selectFile = (name: string) => {
    setActiveFile(name);
    if (!openFiles.includes(name)) {
      setOpenFiles([...openFiles, name]);
    }
  };

  const closeFile = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    const newOpen = openFiles.filter(f => f !== name);
    setOpenFiles(newOpen);
    if (activeFile === name && newOpen.length > 0) {
      setActiveFile(newOpen[0]);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer */}
        <div className="w-64 border-r border-accent-green/10 flex flex-col bg-black/40">
           <div className="p-4 flex items-center justify-between border-b border-accent-green/10">
              <span className="text-[10px] font-mono tracking-widest text-accent-green uppercase">Explorer</span>
              <Plus 
                className="w-3 h-3 text-muted-foreground hover:text-accent-green cursor-pointer" 
                onClick={createNewFile}
              />
           </div>
           <ScrollArea className="flex-1">
             <div className="p-2 space-y-0.5">
               {fileTree.map(item => (
                 <div key={item.name}>
                    {item.type === 'folder' ? (
                      <div className="space-y-0.5">
                        <div 
                          className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/5 rounded cursor-pointer transition-colors"
                          onClick={() => toggleFolder(item.name)}
                        >
                          {expandedFolders.includes(item.name) ? <ChevronDown className="w-3 h-3 text-white/50" /> : <ChevronRight className="w-3 h-3 text-white/50" />}
                          <FolderIcon className="w-3.5 h-3.5 text-accent-cyan/60" />
                          <span className="text-[11px] font-mono text-white/80">{item.name}</span>
                        </div>
                        {expandedFolders.includes(item.name) && (
                          <div className="pl-4 space-y-0.5 border-l border-white/5 ml-4.5">
                             {item.children?.map(filename => (
                               <div
                                 key={filename}
                                 className={cn(
                                   "w-full flex items-center group gap-2 px-3 py-1.5 text-[11px] font-mono transition-all cursor-pointer rounded-sm",
                                   activeFile === filename ? "bg-accent-green/10 text-accent-green shadow-[inset_-5px_0_10px_-5px_rgba(0,255,0,0.2)]" : "text-muted-foreground hover:bg-white/5"
                                 )}
                                 onClick={() => selectFile(filename)}
                               >
                                 {getFileIcon(filename)}
                                 <span className="flex-1 truncate">{filename}</span>
                               </div>
                             ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "w-full flex items-center group gap-2 px-3 py-1.5 text-[11px] font-mono transition-all cursor-pointer rounded-sm ml-4.5",
                          activeFile === item.name ? "bg-accent-green/10 text-accent-green shadow-[inset_-5px_0_10px_-5px_rgba(0,255,0,0.2)]" : "text-muted-foreground hover:bg-white/5"
                        )}
                        onClick={() => selectFile(item.name!)}
                      >
                        {getFileIcon(item.name!)}
                        <span className="flex-1">{item.name}</span>
                      </div>
                    )}
                 </div>
               ))}
             </div>
           </ScrollArea>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-black">
           <div className="h-10 border-b border-accent-green/10 flex items-center px-4 justify-between bg-black/60">
                    <div className="flex h-full">
                {openFiles.map(file => (
                  <div 
                    key={file}
                    onClick={() => selectFile(file)}
                    className={cn(
                      "flex items-center gap-2 px-4 h-full border-r border-accent-green/10 cursor-pointer text-[10px] font-mono transition-all",
                      activeFile === file ? "bg-black text-accent-green border-t border-t-accent-green" : "bg-white/[0.02] text-muted-foreground hover:bg-white/[0.05]"
                    )}
                  >
                    {getFileIcon(file)}
                    {file}
                    <X 
                      className="w-2.5 h-2.5 hover:text-accent-magenta opacity-0 group-hover:opacity-100" 
                      onClick={(e) => closeFile(e, file)}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-accent-green" onClick={runCode}>
                   <Play className="h-3.5 w-3.5 fill-current" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className={cn("h-7 w-7 text-muted-foreground hover:text-accent-cyan", isSaving && "animate-pulse text-accent-cyan")}
                  onClick={handleSave}
                >
                   <Save className="h-3.5 w-3.5" />
                </Button>
              </div>
           </div>
           
           <div className="flex-1 relative flex">
              <div className="w-12 bg-black/40 border-r border-accent-green/5 font-mono text-[10px] text-accent-green/20 pt-6 text-right pr-3 select-none">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                className="flex-1 bg-transparent p-6 pt-6 font-mono text-sm resize-none focus:outline-none text-accent-green/80"
                spellCheck={false}
                value={files[activeFile]?.content || ''}
                onChange={(e) => {
                  const newFiles = { ...files };
                  newFiles[activeFile].content = e.target.value;
                  setFiles(newFiles);
                }}
              />
           </div>
        </div>
      </div>

      {/* Terminal */}
      <div className="h-40 border-t border-accent-green/20 bg-black/80 flex flex-col overflow-hidden">
         <div className="h-8 border-b border-accent-green/10 flex items-center px-4 gap-2">
            <TerminalIcon className="w-3 h-3 text-accent-green" />
            <span className="text-[10px] font-mono tracking-widest text-accent-green uppercase">Architect Terminal v2.4.0</span>
         </div>
         <ScrollArea className="flex-1 p-4 font-mono text-[11px]">
            {output.map((line, i) => (
              <div key={i} className="flex gap-2 mb-1">
                <span className="text-muted-foreground">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                <span className={cn(line.startsWith('>') ? "text-accent-cyan" : "text-foreground")}>{line}</span>
              </div>
            ))}
         </ScrollArea>
      </div>
    </div>
  );
};

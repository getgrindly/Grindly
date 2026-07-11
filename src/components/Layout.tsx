import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  Code2, 
  Terminal, 
  LayoutDashboard, 
  Cpu, 
  Settings, 
  ChevronRight,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  Layers,
  GitBranch,
  BookOpen,
  Zap,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { auth, logout } from '@/lib/firebase';

interface LayoutProps {
  children: React.ReactNode;
  activeId: string;
  onNavigate: (id: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'foundations', label: 'Foundations', icon: Cpu },
  { id: 'design', label: 'Architecture', icon: Database },
  { id: 'grind-workflow', label: 'The Grind', icon: Layers },
  { id: 'sandbox', label: 'IDE Sandbox', icon: Code2 },
  { id: 'review', label: 'Code Review', icon: Terminal },
  { id: 'git', label: 'Git Flow', icon: GitBranch },
  { id: 'pipeline', label: 'CI/CD Pipelines', icon: Zap },
  { id: 'mentorship', label: 'Mentorship', icon: Users },
  { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
];

export const Layout: React.FC<LayoutProps> = ({ children, activeId, onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const user = auth.currentUser;

  return (
    <div className="flex h-screen bg-background overflow-hidden relative font-sans">
      <div className="scanline" />
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-black border-r border-accent-green/20 flex flex-col z-20"
      >
        <div className="p-6 flex items-center justify-between border-b border-accent-green/10">
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <Zap className="text-accent-green w-6 h-6 fill-accent-green/20" />
              <span className="font-bold tracking-tighter text-xl glitch-text">Grindly</span>
            </motion.div>
          )}
          {!isSidebarOpen && <Zap className="text-accent-green w-6 h-6 mx-auto" />}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 transition-all group relative",
                activeId === item.id 
                  ? "text-accent-green bg-accent-green/5 cyber-border-cyan/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {activeId === item.id && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-accent-green shadow-[0_0_10px_#00ff00]"
                />
              )}
              <item.icon className={cn("w-5 h-5", activeId === item.id && "drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]")} />
              {isSidebarOpen && (
                <span className="font-medium tracking-tight whitespace-nowrap">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-accent-green/10 space-y-4">
          {user && isSidebarOpen && (
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-8 h-8 rounded-full border border-accent-cyan/30 overflow-hidden bg-accent-cyan/10 flex items-center justify-center">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon className="w-4 h-4 text-accent-cyan" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-foreground truncate">{user.displayName || 'Guest Architect'}</p>
                <button 
                  onClick={() => logout()}
                  className="text-[9px] font-mono text-muted-foreground hover:text-accent-magenta uppercase flex items-center gap-1"
                >
                  <LogOut className="w-2 h-2" />
                  Terminate Session
                </button>
              </div>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-muted-foreground hover:text-accent-green"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="w-4 h-4 mr-2" /> : <Menu className="w-4 h-4" />}
            {isSidebarOpen && "Minimize Terminal"}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full bg-black relative">
        <header className="h-16 border-b border-accent-green/10 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="text-accent-green">SYS_STATUS:</span> 
            <span className="text-foreground animate-pulse">OPTIMAL</span>
            <span className="mx-2 opacity-20">|</span>
            <span className="text-accent-cyan">MODULE:</span>
            <span className="text-foreground uppercase">{activeId}</span>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex h-1.5 w-32 bg-muted overflow-hidden">
                <motion.div 
                  initial={{ width: "30%" }}
                  animate={{ width: "65%" }}
                  className="bg-accent-magenta h-full shadow-[0_0_10px_#ff00ff]"
                />
             </div>
             <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Architect progression</span>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-black cyber-grid">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

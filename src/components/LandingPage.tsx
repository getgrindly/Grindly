import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Terminal, 
  Cpu, 
  Database, 
  ChevronRight, 
  Sparkles, 
  LogIn, 
  Users, 
  Star, 
  Award, 
  Code2, 
  Github, 
  Linkedin, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  User, 
  X, 
  ShieldCheck, 
  Send 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signInGuest } from '@/lib/firebase';
const raymondAvatar = 'https://www.image2url.com/r2/default/images/1780618521207-cb89bb0a-2459-487b-8716-97055fc04d3d.png';

export const LandingPage = ({ onNavigate }: { onNavigate?: (id: string) => void }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [githubUser, setGithubUser] = useState('');
  const [email, setEmail] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('fullstack');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinedSuccess, setJoinedSuccess] = useState(false);
  const [accessKey, setAccessKey] = useState('');

  const handleLogin = async () => {
    setIsAuthenticating(true);
    try {
      await signInGuest();
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleCommunitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUser || !email) return;

    setIsSubmitting(true);
    // Simulate high-performance server encryption protocol
    setTimeout(() => {
      const cryptoKey = `GRND-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}-2026`;
      setAccessKey(cryptoKey);
      setIsSubmitting(false);
      setJoinedSuccess(true);
    }, 1800);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-foreground flex flex-col font-sans selection:bg-accent-green selection:text-black relative overflow-x-hidden">
      <div className="scanline opacity-30" />
      
      {/* Dynamic Cyber Orbs */}
      <div className="absolute top-[5%] left-[10%] w-[500px] h-[500px] bg-accent-green/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-[50%] right-[-10%] w-[600px] h-[600px] bg-green-600/[0.04] blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-cyan/5 blur-[130px] rounded-full pointer-events-none" />

      {/* Modern Top Navigation Bar */}
      <nav className="h-20 flex items-center justify-between px-6 md:px-16 z-20 sticky top-0 bg-[#050505]/80 backdrop-blur-md border-b border-white/[0.03]">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-sm bg-accent-green flex items-center justify-center shadow-[0_0_15px_rgba(0,255,0,0.4)]">
            <Zap className="text-black w-5 h-5 fill-black/10" />
          </div>
          <div className="flex items-center">
            <span className="font-bold tracking-tight text-xl text-white">Grindly</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-mono text-muted-foreground uppercase tracking-widest">
          <button onClick={() => scrollToSection('metrics')} className="hover:text-white transition-colors">Track_Record</button>
          <button onClick={() => scrollToSection('bootcamps')} className="hover:text-white transition-colors">Curriculum_Matrix</button>
          <button onClick={() => scrollToSection('instructor')} className="hover:text-white transition-colors">Lead_Mentor</button>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            className="h-10 px-6 bg-transparent border border-white/10 hover:border-accent-green text-white hover:bg-accent-green/5 font-mono text-xs uppercase tracking-widest rounded-none shadow-sm transition-all"
            onClick={handleLogin}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? "SYNCING..." : "ENTER_LAB_SYSTEM"}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative flex flex-col items-center justify-center pt-20 pb-24 md:pt-32 md:pb-36 px-6 text-center z-10 border-b border-white/[0.02]">
        {/* Subtle dot matrix grid in the background of hero */}
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(rgba(0,255,0,0.15)_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8 max-w-5xl"
        >
          {/* Badge */}
          <div className="flex justify-center">
            <div className="px-4 py-1.5 bg-[#050e06] border border-accent-green/30 shadow-[0_0_15px_rgba(0,255,0,0.15)] rounded-none flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-accent-green animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-accent-green tracking-[0.25em] uppercase">
                From Coder to Systems Architect
              </span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.95] uppercase">
            Master the Craft.<br/> Conquer the <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-green via-green-400 to-emerald-500 drop-shadow-[0_0_30px_rgba(0,255,0,0.35)]">Grind.</span>
          </h1>

          <p className="text-muted-foreground text-base sm:text-xl max-w-3xl mx-auto leading-relaxed font-normal">
            No fluff. No toy projects. Spend your valuable energy building actual high-throughput systems. Master modern full-stack architectures (<strong className="text-white">React, Next.js, Node.js, and Supabase / Databases</strong>) through the ultimate, performance-tested educational workflow.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-10 h-14 bg-gradient-to-r from-accent-green to-emerald-600 text-black hover:from-accent-green/90 hover:to-emerald-600/90 font-mono text-sm uppercase font-bold tracking-widest rounded-none shadow-[0_0_25px_rgba(0,255,0,0.4)] border-none"
              onClick={() => scrollToSection('bootcamps')}
            >
              Browse_Bootcamps
              <ArrowRight className="ml-2 w-4 h-4 text-black" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-10 h-14 border-white/10 hover:border-accent-green text-white hover:bg-white/5 font-mono text-sm uppercase tracking-widest rounded-none"
              onClick={() => setIsCommunityOpen(true)}
            >
              Join_Dev_Community
            </Button>
          </div>
        </motion.div>
      </header>

      {/* Social Proof & Metrics Grid */}
      <section id="metrics" className="bg-[#08080a] border-b border-white/[0.03] py-14 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x divide-white/[0.05]">
            <div className="flex items-center gap-5 md:justify-center">
              <div className="w-12 h-12 bg-accent-green/10 flex items-center justify-center border border-accent-green/20">
                <Users className="w-6 h-6 text-accent-green" />
              </div>
              <div>
                <h3 className="text-3xl font-bold tracking-tight text-white leading-none">10K+</h3>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">Global Students Trained</p>
              </div>
            </div>

            <div className="flex items-center gap-5 md:justify-center md:pl-8">
              <div className="w-12 h-12 bg-accent-green/10 flex items-center justify-center border border-accent-green/20">
                <Star className="w-6 h-6 text-accent-green" />
              </div>
              <div>
                <h3 className="text-3xl font-bold tracking-tight text-white leading-none">4.9 / 5</h3>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">Exceptional Student Satisfaction</p>
              </div>
            </div>

            <div className="flex items-center gap-5 md:justify-center md:pl-8">
              <div className="w-12 h-12 bg-accent-green/10 flex items-center justify-center border border-accent-green/20">
                <Award className="w-6 h-6 text-accent-green" />
              </div>
              <div>
                <h3 className="text-3xl font-bold tracking-tight text-white leading-none">Lead Tech</h3>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">Mentorship from FAANG & Elite Startups</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum & Bootcamps Section */}
      <section id="bootcamps" className="py-24 px-6 relative z-10 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[10px] font-mono tracking-[0.4em] text-accent-green uppercase font-bold">Curriculum Matrix v3.0</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white uppercase">Professional Education Tracks</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto font-mono">
            Optimized pathways mapped down to production benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Track 1: Full-Stack Mastery */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="p-8 bg-[#09090b] border border-white/5 hover:border-accent-green/40 transition-all rounded-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-accent-green/[0.07] border border-accent-green/20 flex items-center justify-center">
                  <Database className="w-6 h-6 text-accent-green" />
                </div>
                <div className="px-2.5 py-0.5 bg-[#0a140f] border border-accent-green/30 text-accent-green text-[8px] font-mono font-bold uppercase tracking-wider">
                  Tier_1_Core
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 font-mono">Full-Stack Mastery</h3>
              <p className="text-xs font-mono text-accent-green/70 uppercase mb-4 tracking-wider">Next.js, Node.js, & PostgreSQL</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                From low-level relational schema design and complex joins to building blazingly fast full-stack architectures in Next.js. Master serverless rendering, secure backend authentication, transactional storage, and responsive performance.
              </p>

              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0" />
                  <span>Interactive SQL Schema Modeling</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0" />
                  <span>Strict TypeScript API Protocols</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0" />
                  <span>Real-time Middleware & Edge Functions</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
              <Button 
                variant="outline" 
                className="w-full h-11 border-white/10 hover:border-accent-green text-[10px] font-mono uppercase tracking-widest text-white/80"
                onClick={() => onNavigate?.('curriculum')}
              >
                Inspect_Syllabus
              </Button>
            </div>
          </motion.div>

          {/* Track 2: AI & Automation Integration */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="p-8 bg-[#09090b] border border-white/5 hover:border-accent-green/40 transition-all rounded-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-accent-green/[0.07] border border-accent-green/20 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-accent-green" />
                </div>
                <div className="px-2.5 py-0.5 bg-[#0a140f] border border-accent-green/30 text-accent-green text-[8px] font-mono font-bold uppercase tracking-wider">
                  Tier_2_Adv
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 font-mono">AI & Automation</h3>
              <p className="text-xs font-mono text-accent-green/70 uppercase mb-4 tracking-wider">TS @google/genai SDK & Agent Pipelines</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Acquire the leverage of modern artificial intelligence. Interface directly with Google's state-of-the-art models. You will design functional vector indices, streaming responses, structured JSON models, and build autonomous agents.
              </p>

              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0" />
                  <span>Generative Content Streaming via SDK</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0" />
                  <span>Structured Response Validation JSON</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0" />
                  <span>Multi-Agent Task Routing Networks</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
              <Button 
                variant="outline" 
                className="w-full h-11 border-white/10 hover:border-accent-green text-[10px] font-mono uppercase tracking-widest text-white/80"
                onClick={() => onNavigate?.('curriculum')}
              >
                Inspect_Syllabus
              </Button>
            </div>
          </motion.div>

          {/* Track 3: Technical Interview Grind */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="p-8 bg-[#09090b] border border-white/5 hover:border-accent-green/40 transition-all rounded-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-accent-green/[0.07] border border-accent-green/20 flex items-center justify-center">
                  <Terminal className="w-6 h-6 text-accent-green" />
                </div>
                <div className="px-2.5 py-0.5 bg-[#0a140f] border border-accent-green/30 text-accent-green text-[8px] font-mono font-bold uppercase tracking-wider">
                  Tier_3_Elite
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 font-mono">Interview Grind</h3>
              <p className="text-xs font-mono text-accent-green/70 uppercase mb-4 tracking-wider">System Design & Heavy DSA</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Excel at premium interviews globally. Go far deeper than basic array maneuvers; you'll code graph representations, optimize dynamic loops, structure complex cache engines, and design distributed environments for massive throughput.
              </p>

              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0" />
                  <span>Graph Traversal & Greedy Algorithm Proofs</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0" />
                  <span>Distributed Database Partition Shards</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0" />
                  <span>High-Stress Load Balancing Simulation</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
              <Button 
                variant="outline" 
                className="w-full h-11 border-white/10 hover:border-accent-green text-[10px] font-mono uppercase tracking-widest text-white/80"
                onClick={() => onNavigate?.('curriculum')}
              >
                Inspect_Syllabus
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Instructor Spotlight - Raymond Oyondi */}
      <section id="instructor" className="py-24 bg-[#08080a] border-y border-white/[0.03] px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Raymond Avatar Container with High Tech Bezel Decorations */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative p-3 bg-black border border-white/10 shadow-[0_0_40px_rgba(0,255,0,0.15)] group max-w-sm w-full">
              {/* Interface Corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-green -translate-x-1 -translate-y-1" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent-green translate-x-1 -translate-y-1" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent-green -translate-x-1 translate-y-1" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-green translate-x-1 translate-y-1" />
              
              <div className="overflow-hidden bg-[#111] relative aspect-square">
                <img 
                  src={raymondAvatar} 
                  alt="Raymond Oyondi Portrait" 
                  className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 hover:brightness-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay Tag */}
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 border border-white/10 text-[8px] font-mono text-accent-green uppercase tracking-widest flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-ping" />
                  <span>ACTIVE_SYSTEM_LEAD</span>
                </div>
              </div>

              {/* Status metrics footer on photo frame */}
              <div className="mt-3 pt-3 border-t border-white/5 flex justify-between text-[8px] font-mono text-muted-foreground uppercase tracking-widest">
                <span>Core Node: Minneapolis_HQ_26</span>
                <span>Uptime: 99.98%</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent-green font-black">Platform Founder & Core Oracle</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-none uppercase">Raymond Oyondi</h2>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Lead Full-Stack Engineer & Mentor</p>
            </div>

            <div className="space-y-4 text-muted-foreground text-sm md:text-base leading-relaxed">
              <p>
                Raymond Oyondi is a seasoned, battle-tested software architect who designs solutions built to survive brutal scale. Having built transactional portals, security layers, and enterprise services, he founded <strong className="text-white">Grindly</strong> to completely abolish hand-holding tutorial fatigue.
              </p>
              <p>
                "My core philosophy is architecturally simple: <em className="text-accent-green font-semibold not-italic">you do not learn real engineering by copy-pasting a basic todo list</em>. You learn it by analyzing CAP theorem limitations, modeling perfect database normalizations, structuring CI/CD deployment logic, and writing code under strict peer-grade constraints."
              </p>
              <p className="font-mono text-xs text-white pt-2 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-accent-green" /> Learn real craft, scale correctly, and build systems you are proud to ship.
              </p>
            </div>

            <div className="pt-4 flex gap-4">
              <Button 
                onClick={() => setIsCommunityOpen(true)}
                className="bg-accent-green text-black hover:bg-accent-green/80 hover:text-black font-extrabold px-8 h-12 font-mono text-xs uppercase tracking-widest"
              >
                REQUEST_COMMUNITY_PASS
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* Developers Discord / Slack CTA Feature Box */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full z-10 text-center">
        <div className="relative p-10 md:p-14 bg-gradient-to-br from-[#051009] to-[#040406] border border-white/5 rounded-sm overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-green/[0.02] blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <MessageSquare className="w-12 h-12 text-accent-green mx-auto transform hover:rotate-12 transition-transform duration-300" />
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight uppercase">The Developer Syndicate</h2>
            <p className="text-muted-foreground text-sm leading-relaxed font-mono">
              Join 5,000+ engineers sharing design feedback, coordinating collaborative reviews, troubleshooting infrastructure errors, and sharing elite job referral pathways.
            </p>
            <div className="pt-4">
              <Button 
                className="h-12 px-10 bg-white text-black hover:bg-white/90 font-mono text-xs uppercase tracking-widest flex items-center gap-2 mx-auto"
                onClick={() => setIsCommunityOpen(true)}
              >
                Get_Syndicate_Invite
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <footer className="p-8 border-t border-white/5 bg-[#030303] flex flex-col md:flex-row justify-between items-center gap-6 z-10 text-center relative">
        <div className="flex flex-col md:flex-row items-center gap-6 text-[10px] font-mono text-muted-foreground uppercase tracking-widest col-span-2">
           <span className="hover:text-white transition-colors cursor-default">(c) 2026 Grindly</span>
           <button onClick={() => onNavigate?.('privacy')} className="hover:text-accent-green transition-colors cursor-pointer">Privacy_Protocol</button>
           <button onClick={() => onNavigate?.('terms')} className="hover:text-accent-green transition-colors cursor-pointer">Terms_of_Service</button>
        </div>

        <div className="flex items-center gap-6">
          <a href="https://github.com/raymondoyondi" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-white transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <a href="https://linkedin.com/in/raymondoyondi" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-white transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse" />
             <span className="text-[10px] font-mono text-accent-green font-semibold">HQ_GRID_ONLINE</span>
          </div>
        </div>
      </footer>

      {/* Developer Community Signup Register Modal */}
      <AnimatePresence>
        {isCommunityOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0a0a0c] border border-accent-green/30 p-8 rounded-none relative space-y-6 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button onClick={() => { setIsCommunityOpen(false); setJoinedSuccess(false); }} className="text-muted-foreground hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!joinedSuccess ? (
                <form onSubmit={handleCommunitySubmit} className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-accent-green uppercase tracking-widest font-black">SECURE_ONBOARDING_PROTOCOL</span>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Syndicate Access Application</h3>
                    <p className="text-xs text-muted-foreground">Submit credentials to authorize your cryptographic Syndicate keys.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">GitHub_Handle</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. octocat" 
                        value={githubUser}
                        onChange={(e) => setGithubUser(e.target.value)}
                        className="w-full h-11 bg-black border border-white/10 px-4 text-xs font-mono text-white focus:outline-none focus:border-accent-green"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">Operational_Email</label>
                      <input 
                        type="email" 
                        required
                        placeholder="e.g. pilot@grindly.io" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-11 bg-black border border-white/10 px-4 text-xs font-mono text-white focus:outline-none focus:border-accent-green"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">Focus_Discipline</label>
                      <select 
                        value={selectedTrack}
                        onChange={(e) => setSelectedTrack(e.target.value)}
                        className="w-full h-11 bg-black border border-white/10 px-3 text-xs font-mono text-white focus:outline-none focus:border-accent-green"
                      >
                        <option value="fullstack">Full-Stack Architect (Next.js & Servers)</option>
                        <option value="ai">AI Pipeline Systems (LLM Integrations)</option>
                        <option value="dsa">DSA & System Design (Interview Grind)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-accent-green text-black hover:bg-accent-green/90 hover:text-black font-mono text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Verifying_Credentials...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-black" />
                          Request_Secure_Pass
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 text-center py-6"
                >
                  <div className="mx-auto w-14 h-14 bg-accent-green/10 border border-accent-green flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(0,255,0,0.2)]">
                     <ShieldCheck className="w-7 h-7 text-accent-green" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Access Protocol Authorized</h3>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      Credentials validated. Welcome to the Syndicate, Agent <strong className="text-white">@{githubUser}</strong>.
                    </p>
                  </div>

                  <div className="bg-black border border-white/5 p-4 space-y-3 rounded-sm font-mono text-left">
                     <div className="flex justify-between border-b border-white/5 pb-1 text-[9px] uppercase tracking-wider text-muted-foreground">
                        <span>Variable</span>
                        <span>Assigned_Value</span>
                     </div>
                     <div className="flex justify-between text-xs">
                        <span className="text-accent-green">ID_ENTITY</span>
                        <span className="text-white">Syndicate_{Math.floor(Math.random() * 900) + 100}</span>
                     </div>
                     <div className="flex justify-between text-xs">
                        <span className="text-accent-green">CR_TOKEN</span>
                        <span className="text-green-400 select-all cursor-copy">{accessKey}</span>
                     </div>
                  </div>

                  <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                    An operational verification email was dispatched to <strong className="text-white">{email}</strong>. Use your CR_TOKEN for terminal privileges.
                  </p>

                  <div className="pt-2">
                    <Button 
                      className="w-full h-11 bg-white text-black hover:bg-white/90 font-mono text-xs uppercase tracking-widest"
                      onClick={() => { setIsCommunityOpen(false); setJoinedSuccess(false); }}
                    >
                      Acknowledge_Protocol
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

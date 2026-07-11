import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Target, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Clock, 
  ArrowRight, 
  Plus, 
  Trash2, 
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Layers,
  Heart,
  Send,
  HelpCircle,
  Code,
  Lock,
  GitPullRequest,
  CheckSquare,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// Types for the Mentorship Module
interface Milestone {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
}

interface Meeting {
  id: string;
  date: string;
  time: string;
  topic: string;
  notes: string;
}

interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: 'foundations' | 'architecture' | 'workflow';
}

interface MentorProfile {
  userId: string;
  displayName: string;
  avatar?: string;
  skills: string[];
  availability: string;
  bio: string;
  company?: string;
  role?: string;
}

interface MenteeApplication {
  userId: string;
  displayName: string;
  goals: string;
  needs: string;
  primaryStack: string;
  commitment: string;
}

interface MentorshipRoomState {
  id: string;
  mentor: MentorProfile;
  mentee: {
    userId: string;
    displayName: string;
    goals: string;
  };
  startDate: string;
  durationWeeks: number;
  currentWeek: number;
  milestones: Milestone[];
  meetings: Meeting[];
  roadmap: RoadmapNode[];
}

// Initial Mock Catalog of Available Mentors
const MOCK_MENTORS: MentorProfile[] = [
  {
    userId: 'mentor-alex',
    displayName: 'Alex Mercer',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120',
    skills: ['React', 'Next.js', 'Node.js'],
    availability: '4 hours / week',
    bio: 'Principal Engineer at Vercel. Obsessed with server components, edge-runtime rendering pipelines, and reducing bundle sizes.',
    company: 'Vercel',
    role: 'Principal Engineer'
  },
  {
    userId: 'mentor-sarah',
    displayName: 'Sarah Connor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
    skills: ['React', 'Supabase', 'Node.js'],
    availability: '3 hours / week',
    bio: 'VP of Engineering. Specialist in scalable database topologies, secure Row-Level Security policy modeling, and real-time synchronisation.',
    company: 'Supabase Partner Corp',
    role: 'VP of Engineering'
  },
  {
    userId: 'mentor-elena',
    displayName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120',
    skills: ['Node.js', 'Next.js', 'Supabase'],
    availability: '5 hours / week',
    bio: 'Distinguished Architect. Specialist in cloud native server architecture, high-performance API design, and distributed transaction isolation.',
    company: 'Cloud Native Lab',
    role: 'Distinguished Architect'
  },
  {
    userId: 'mentor-linus',
    displayName: 'Linus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    skills: ['React', 'Next.js', 'Supabase', 'Node.js'],
    availability: '2 hours / week',
    bio: 'Lead SRE. Dedicated to full-stack containerization, GitOps workflow configuration, and building auto-healing Kubernetes architectures.',
    company: 'Red Hat SRE',
    role: 'Lead Dev SRE'
  }
];

export const MentorshipPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'room' | 'onboard' | 'apply' | 'match' | 'specs'>('room');
  
  // Local persistence and state managers
  const [isMentor, setIsMentor] = useState<boolean>(false);
  const [mentorData, setMentorData] = useState<MentorProfile | null>(null);
  
  const [isMentee, setIsMentee] = useState<boolean>(false);
  const [menteeData, setMenteeData] = useState<MenteeApplication | null>(null);
  
  const [activeRoom, setActiveRoom] = useState<MentorshipRoomState | null>(null);
  const [matchingStep, setMatchingStep] = useState<number>(0);
  const [selectedMentorForMatch, setSelectedMentorForMatch] = useState<MentorProfile | null>(null);
  
  // New entry fields
  const [newMilestoneText, setNewMilestoneText] = useState('');
  const [newMeetingDate, setNewMeetingDate] = useState('');
  const [newMeetingTime, setNewMeetingTime] = useState('');
  const [newMeetingTopic, setNewMeetingTopic] = useState('');
  const [newMeetingNotes, setNewMeetingNotes] = useState('');

  // Form states
  const [mentorSkills, setMentorSkills] = useState<string[]>(['React']);
  const [mentorHours, setMentorHours] = useState<string>('3 hours / week');
  const [mentorBio, setMentorBio] = useState<string>('');

  const [menteeGoal, setMenteeGoal] = useState<string>('Become a High-Performance Next.js Architect');
  const [menteeNeeds, setMenteeNeeds] = useState<string>('Needs code review guidance and custom database layout reviews.');
  const [menteeStack, setMenteeStack] = useState<string>('Next.js');
  const [menteeCommit, setMenteeCommit] = useState<string>('3-month guided commitment');

  // Load state on mount
  useEffect(() => {
    const uid = auth.currentUser?.uid || 'guest-architect';
    
    // Load mentor profile
    const savedMentor = localStorage.getItem(`grindly_mentor_${uid}`);
    if (savedMentor) {
      setIsMentor(true);
      setMentorData(JSON.parse(savedMentor));
    }
    
    // Load mentee application
    const savedMentee = localStorage.getItem(`grindly_mentee_${uid}`);
    if (savedMentee) {
      setIsMentee(true);
      setMenteeData(JSON.parse(savedMentee));
      }
    
    // Load active mentorship room
    const savedRoom = localStorage.getItem(`grindly_room_${uid}`);
    if (savedRoom) {
      setActiveRoom(JSON.parse(savedRoom));
    }
  }, []);

  // Save utility
  const saveStateToLocalAndCloud = async (key: string, data: any, callbackState: any) => {
    const uid = auth.currentUser?.uid || 'guest-architect';
    localStorage.setItem(`${key}_${uid}`, JSON.stringify(data));
    callbackState(data);

    // Bypassed Cloud sync fallback (Firestore integration)
    try {
      const docRef = doc(db, 'mentorship', `${uid}_${key}`);
      await setDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
          });
    } catch (e) {
      console.warn(`Firestore sync bypassed for ${key}: `, e);
    }
  };

  // Onboard as Mentor
  const handleMentorOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid || 'guest-architect';
    const profile: MentorProfile = {
      userId: uid,
      displayName: auth.currentUser?.displayName || 'Guest Architect',
      skills: mentorSkills,
      availability: mentorHours,
      bio: mentorBio,
      company: 'Self-employed / Community Member',
      role: 'Staff Engineer'
    };
    saveStateToLocalAndCloud('grindly_mentor', profile, setMentorData);
    setIsMentor(true);
  };

  // Remove Mentor Profile
  const handleRemoveMentor = () => {
    const uid = auth.currentUser?.uid || 'guest-architect';
    localStorage.removeItem(`grindly_mentor_${uid}`);
    setIsMentor(false);
    setMentorData(null);
  };

  // Onboard as Mentee
  const handleMenteeApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid || 'guest-architect';
    const app: MenteeApplication = {
      userId: uid,
      displayName: auth.currentUser?.displayName || 'Guest Architect',
      goals: menteeGoal,
      needs: menteeNeeds,
      primaryStack: menteeStack,
      commitment: menteeCommit
    };
    saveStateToLocalAndCloud('grindly_mentee', app, setMenteeData);
    setIsMentee(true);
  };

  // Remove Mentee Profile
  const handleRemoveMentee = () => {
    const uid = auth.currentUser?.uid || 'guest-architect';
    localStorage.removeItem(`grindly_mentee_${uid}`);
    setIsMentee(false);
    setMenteeData(null);
  };

  // Trigger Match Simulation Algorithm
  const startMatchingSimulation = () => {
    if (!isMentee || !menteeData) return;
    
    setMatchingStep(1);
    
    // Simulate smart backend parsing and pairing checks
    setTimeout(() => {
      setMatchingStep(2); // Scanning database
      
      setTimeout(() => {
        setMatchingStep(3); // Matching scores calculation

        setTimeout(() => {
          // Find the best fit based on mentee primaryStack
          const targetStack = menteeData.primaryStack.toLowerCase();
          const matched = MOCK_MENTORS.find(m => 
            m.skills.some(skill => skill.toLowerCase().includes(targetStack))
          ) || MOCK_MENTORS[0];
          
          setSelectedMentorForMatch(matched);
          setMatchingStep(4); // Success match found!
        }, 1500);
      }, 1500);
    }, 1500);
  };

  // Confirm Matching and Initialize Room
  const confirmMatchAndInitializeRoom = () => {
    if (!selectedMentorForMatch || !menteeData) return;

    const uid = auth.currentUser?.uid || 'guest-architect';
    
    // Set default roadmap based on stack
    const defaultRoadmap: RoadmapNode[] = [
      { id: 'rm-1', title: 'Foundational Architectural Audit', description: 'Review core codebase structures, layout design, and design patterns.', completed: false, category: 'foundations' },
      { id: 'rm-2', title: 'Data Store Strategy & Schema Design', description: 'Build enterprise schema models, secure RLS rules, and query scopes.', completed: false, category: 'architecture' },
      { id: 'rm-3', title: 'Workflow Orchestration & Pipelines', description: 'Establish optimal multi-stage container builds, CI/CD automated lint/tests, and deployments.', completed: false, category: 'workflow' }
    ];

    const defaultMilestones: Milestone[] = [
      { id: 'm-1', text: 'Set up initial 1:1 sync schedule', completed: false },
      { id: 'm-2', text: 'Complete architectural baseline audit', completed: false },
      { id: 'm-3', text: 'Validate database schemas and secure rules', completed: false }
    ];

    const initialRoom: MentorshipRoomState = {
      id: `room-${uid}-${selectedMentorForMatch.userId}`,
      mentor: selectedMentorForMatch,
      mentee: {
        userId: uid,
        displayName: menteeData.displayName,
        goals: menteeData.goals
      },
      startDate: new Date().toLocaleDateString(),
      durationWeeks: 12,
      currentWeek: 1,
      milestones: defaultMilestones,
      meetings: [
        {
          id: 'meet-1',
          date: new Date().toLocaleDateString(),
          time: '15:00',
          topic: 'Initial Kickoff & Skill Alignment',
          notes: 'Discussed goals, commitment level, and structured the weekly 1:1 cadence.'
        }
      ],
      roadmap: defaultRoadmap
    };

    saveStateToLocalAndCloud('grindly_room', initialRoom, setActiveRoom);
    setMatchingStep(0);
    setSelectedMentorForMatch(null);
    setActiveTab('room');
  };

  // Delete/Reset Mentorship Room Match
  const terminateMentorshipMatch = () => {
    if (window.confirm("Are you sure you want to terminate this mentorship match? Your collaborative roadmap and goal history will be cleared.")) {
      const uid = auth.currentUser?.uid || 'guest-architect';
      localStorage.removeItem(`grindly_room_${uid}`);
      setActiveRoom(null);
    }
  };

  // Add Milestone Task
  const addMilestone = () => {
    if (!newMilestoneText.trim() || !activeRoom) return;
    const nextMilestones = [...activeRoom.milestones, {
      id: `m-${Date.now()}`,
      text: newMilestoneText,
      completed: false
    }];
    
    const updatedRoom = { ...activeRoom, milestones: nextMilestones };
    saveStateToLocalAndCloud('grindly_room', updatedRoom, setActiveRoom);
    setNewMilestoneText('');
  };

  // Toggle Milestone Completion
  const toggleMilestone = (id: string) => {
    if (!activeRoom) return;
    const nextMilestones = activeRoom.milestones.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    );
    const updatedRoom = { ...activeRoom, milestones: nextMilestones };
    saveStateToLocalAndCloud('grindly_room', updatedRoom, setActiveRoom);
  };

  // Delete Milestone Task
  const deleteMilestone = (id: string) => {
    if (!activeRoom) return;
    const nextMilestones = activeRoom.milestones.filter(m => m.id !== id);
    const updatedRoom = { ...activeRoom, milestones: nextMilestones };
    saveStateToLocalAndCloud('grindly_room', updatedRoom, setActiveRoom);
  };

  // Toggle Roadmap Node Completion
  const toggleRoadmapNode = (id: string) => {
    if (!activeRoom) return;
    const nextRoadmap = activeRoom.roadmap.map(node =>
      node.id === id ? { ...node, completed: !node.completed } : node
    );
    const updatedRoom = { ...activeRoom, roadmap: nextRoadmap };
    saveStateToLocalAndCloud('grindly_room', updatedRoom, setActiveRoom);
  };

  // Log/Schedule 1:1 sync meeting
  const addMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingDate || !newMeetingTime || !newMeetingTopic || !activeRoom) return;

    const newSync: Meeting = {
      id: `meet-${Date.now()}`,
      date: newMeetingDate,
      time: newMeetingTime,
      topic: newMeetingTopic,
      notes: newMeetingNotes || 'No notes logged for this session.'
    };

    const nextMeetings = [newSync, ...activeRoom.meetings];
    const updatedRoom = { ...activeRoom, meetings: nextMeetings };
    saveStateToLocalAndCloud('grindly_room', updatedRoom, setActiveRoom);

    // Reset fields
    setNewMeetingDate('');
    setNewMeetingTime('');
    setNewMeetingTopic('');
    setNewMeetingNotes('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-accent-green text-xs font-mono uppercase tracking-widest">
          <Users className="w-4 h-4 animate-pulse" />
          <span>Professional Network / Neural Guidance</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Mentorship <span className="text-accent-green glitch-text">Portal</span>
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl">
          Connect with top engineers. Accelerate your roadmap. Volunteer as a guide or pair with elite mentors to master advanced system architectures.
        </p>
      </header>

      {/* Primary Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-accent-green/20 pb-4">
        <button
          onClick={() => { setActiveTab('room'); setMatchingStep(0); }}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all border ${
            activeTab === 'room'
              ? 'bg-accent-green/10 text-accent-green border-accent-green'
              : 'border-transparent text-muted-foreground hover:text-white hover:bg-white/5'
          }`}
        >
          <Award className="w-4 h-4" />
          Mentorship Room
        </button>
        <button
          onClick={() => { setActiveTab('onboard'); setMatchingStep(0); }}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all border ${
            activeTab === 'onboard'
              ? 'bg-accent-green/10 text-accent-green border-accent-green'
              : 'border-transparent text-muted-foreground hover:text-white hover:bg-white/5'
          }`}
        >
          <Heart className="w-4 h-4" />
          Volunteer as Mentor
        </button>
        <button
          onClick={() => { setActiveTab('apply'); setMatchingStep(0); }}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all border ${
            activeTab === 'apply'
              ? 'bg-accent-green/10 text-accent-green border-accent-green'
              : 'border-transparent text-muted-foreground hover:text-white hover:bg-white/5'
          }`}
        >
          <Target className="w-4 h-4" />
          Apply as Mentee
        </button>
        <button
          onClick={() => { setActiveTab('match'); setMatchingStep(0); }}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all border ${
            activeTab === 'match'
              ? 'bg-accent-green/10 text-accent-green border-accent-green'
              : 'border-transparent text-muted-foreground hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Find My Match
        </button>
        <button
          onClick={() => { setActiveTab('specs'); setMatchingStep(0); }}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all border ${
            activeTab === 'specs'
              ? 'bg-accent-green/10 text-accent-green border-accent-green'
              : 'border-transparent text-muted-foreground hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="w-4 h-4" />
          Architecture & Stories
        </button>
      </div>

      {/* Main Views Container */}
      <div>
        <AnimatePresence mode="wait">

          {/* MENTORSHIP ROOM */}
          {activeTab === 'room' && (
            <motion.div
              key="room-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {activeRoom ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Column: Active Mentor Card & Meeting Cadence Tracker */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Mentor Details Card */}
                    <Card className="bg-black/40 border border-accent-green/20 p-6 space-y-4 rounded-none relative">
                      <div className="absolute top-4 right-4 bg-accent-green/10 text-accent-green text-[10px] font-mono px-2 py-0.5 uppercase tracking-widest border border-accent-green/20">
                        Active Match
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <img 
                          src={activeRoom.mentor.avatar} 
                          alt={activeRoom.mentor.displayName} 
                          className="w-16 h-16 rounded-full border-2 border-accent-green/50 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                            {activeRoom.mentor.displayName}
                            <Award className="w-4 h-4 text-accent-green" />
                          </h3>
                          <p className="text-xs text-muted-foreground">{activeRoom.mentor.role} @ {activeRoom.mentor.company}</p>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-accent-green/10 pt-4">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          "{activeRoom.mentor.bio}"
                        </p>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="text-xs font-mono text-white flex justify-between">
                          <span className="text-muted-foreground">Expertise:</span>
                          <span className="text-accent-green">{activeRoom.mentor.skills.join(', ')}</span>
                        </div>
                        <div className="text-xs font-mono text-white flex justify-between">
                          <span className="text-muted-foreground">Availability:</span>
                          <span className="text-accent-cyan">{activeRoom.mentor.availability}</span>
                        </div>
                        <div className="text-xs font-mono text-white flex justify-between">
                          <span className="text-muted-foreground">Match Date:</span>
                          <span className="text-white">{activeRoom.startDate}</span>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={terminateMentorshipMatch}
                          className="w-full font-mono text-[10px] text-red-400 hover:text-red-300 transition-all uppercase tracking-widest text-left"
                        >
                          × Terminate Active Partnership
                        </button>
                      </div>
                    </Card>

                    {/* Cadence Display / 3-Month Guided Commitment */}
                    <Card className="bg-black/40 border border-accent-green/20 p-6 space-y-4 rounded-none">
                      <div className="flex items-center gap-2 text-accent-green text-xs font-mono uppercase tracking-wider">
                        <Clock className="w-4 h-4" />
                        <span>Cadence & Guided Timeline</span>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">3-Month guided commitment</h4>
                        <p className="text-xs text-muted-foreground">Recommended intervals for 1:1 sessions (Weekly check-ins).</p>
                      </div>

                      {/* Timeline Bar representation */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                          <span>Week 1 (Kickoff)</span>
                          <span className="text-accent-green">Active (Week {activeRoom.currentWeek})</span>
                          <span>Week 12 (Graduation)</span>
                        </div>
                        <div className="h-2 bg-white/5 border border-white/10 relative overflow-hidden">
                          <div 
                            className="h-full bg-accent-green shadow-[0_0_8px_#00ff00]" 
                            style={{ width: `${(activeRoom.currentWeek / 12) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Recommended Milestones per intervals */}
                      <div className="border-t border-accent-green/10 pt-4 space-y-3 font-mono text-[11px]">
                        <div className="flex gap-2 items-start text-white">
                          <span className="text-accent-green">Weeks 1-4:</span>
                          <span className="text-muted-foreground">System Auditing & Foundations Alignments</span>
                        </div>
                        <div className="flex gap-2 items-start text-white">
                          <span className="text-accent-cyan">Weeks 5-8:</span>
                          <span className="text-muted-foreground">Active Database schema & RLS secure building</span>
                        </div>
                        <div className="flex gap-2 items-start text-white">
                          <span className="text-accent-yellow">Weeks 9-12:</span>
                          <span className="text-muted-foreground">CI/CD deployment, SRE optimization, review</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Right Columns: Goal Board & Roadmaps / Meeting Logging */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Progress Roadmaps / Curated learning paths */}
                    <Card className="bg-black/40 border border-accent-green/20 p-6 space-y-4 rounded-none">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-accent-cyan text-xs font-mono uppercase tracking-wider">
                          <Layers className="w-4 h-4" />
                          <span>Curated learning path / Architectural Skills</span>
                        </div>
                        <span className="text-[10px] font-mono text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 border border-accent-cyan/20 uppercase">
                          Progressive Map
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Interactive milestones to unlock advanced architecture mastery. Mark them completed with your mentor.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        {activeRoom.roadmap.map((node) => (
                          <div 
                            key={node.id}
                            onClick={() => toggleRoadmapNode(node.id)}
                            className={`p-4 border font-mono transition-all cursor-pointer relative group ${
                              node.completed 
                                ? 'bg-accent-green/5 border-accent-green text-white' 
                                : 'bg-black/20 border-white/10 text-muted-foreground hover:border-accent-green/50'
                            }`}
                          >
                            <div className="absolute top-2 right-2">
                              {node.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-accent-green" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-white/20 group-hover:border-accent-green/50" />
                              )}
                            </div>
                            <span className="text-[9px] uppercase px-1.5 py-0.5 border border-accent-green/30 text-accent-green inline-block mb-2">
                              {node.category}
                            </span>
                            <h5 className="text-xs font-bold text-white group-hover:text-accent-green transition-all">{node.title}</h5>
                            <p className="text-[10px] text-muted-foreground mt-2 leading-normal">
                              {node.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Milestone & Task Goal Tracking Board */}
                    <Card className="bg-black/40 border border-accent-green/20 p-6 space-y-4 rounded-none">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-accent-green text-xs font-mono uppercase tracking-wider">
                          <CheckSquare className="w-4 h-4" />
                          <span>Goal Tracking Board</span>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">
                          {activeRoom.milestones.filter(m => m.completed).length}/{activeRoom.milestones.length} Done
                        </span>
                      </div>

                      {/* Goal task list */}
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                        {activeRoom.milestones.map((milestone) => (
                          <div 
                            key={milestone.id}
                            className="flex items-center justify-between p-3 bg-white/5 border border-white/10 hover:border-accent-green/20 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => toggleMilestone(milestone.id)}
                                className="text-accent-green transition-all"
                              >
                                {milestone.completed ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                  <div className="w-5 h-5 rounded-none border border-accent-green/40 hover:border-accent-green" />
                                )}
                              </button>
                              <span className={`text-xs ${milestone.completed ? 'line-through text-muted-foreground' : 'text-white font-mono'}`}>
                                {milestone.text}
                              </span>
                            </div>
                            <button 
                              onClick={() => deleteMilestone(milestone.id)}
                              className="text-muted-foreground hover:text-red-400 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add Custom Goal */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add new collaborative milestone goal..."
                          value={newMilestoneText}
                          onChange={(e) => setNewMilestoneText(e.target.value)}
                          className="bg-black border-accent-green/20 text-white rounded-none text-xs font-mono focus:border-accent-cyan"
                          onKeyDown={(e) => { if (e.key === 'Enter') addMilestone(); }}
                        />
                        <Button 
                          onClick={addMilestone}
                          className="bg-accent-green text-black hover:bg-accent-green/80 rounded-none font-mono text-xs uppercase"
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add
                        </Button>
                      </div>
                    </Card>

                    {/* Meeting Cadence Logger */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Form to log/schedule new 1:1 sync meeting */}
                      <Card className="bg-black/40 border border-accent-green/20 p-6 space-y-4 rounded-none">
                        <div className="flex items-center gap-2 text-accent-green text-xs font-mono uppercase tracking-wider">
                          <Calendar className="w-4 h-4" />
                          <span>Schedule 1:1 Session</span>
                        </div>
                        
                        <form onSubmit={addMeeting} className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-muted-foreground uppercase">Date</label>
                              <Input
                                type="date"
                                required
                                value={newMeetingDate}
                                onChange={(e) => setNewMeetingDate(e.target.value)}
                                className="bg-black border-accent-green/20 text-white rounded-none text-xs font-mono"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-muted-foreground uppercase">Time</label>
                              <Input
                                type="time"
                                required
                                value={newMeetingTime}
                                onChange={(e) => setNewMeetingTime(e.target.value)}
                                className="bg-black border-accent-green/20 text-white rounded-none text-xs font-mono"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-muted-foreground uppercase">Sync Topic</label>
                            <Input
                              placeholder="e.g., Supabase RLS Review"
                              required
                              value={newMeetingTopic}
                              onChange={(e) => setNewMeetingTopic(e.target.value)}
                              className="bg-black border-accent-green/20 text-white rounded-none text-xs font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-muted-foreground uppercase">Agendas & Takeaways</label>
                            <textarea
                              placeholder="Notes or agenda for the meeting..."
                              value={newMeetingNotes}
                              onChange={(e) => setNewMeetingNotes(e.target.value)}
                              className="w-full h-16 bg-black border border-accent-green/20 text-white rounded-none p-2 text-xs font-mono focus:outline-none focus:border-accent-cyan"
                            />
                          </div>

                          <Button 
                            type="submit" 
                            className="w-full bg-accent-cyan text-black hover:bg-accent-cyan/80 rounded-none font-mono text-xs uppercase"
                          >
                            Schedule Sync Session
                          </Button>
                        </form>
                      </Card>

                      {/* Log history list */}
                      <Card className="bg-black/40 border border-accent-green/20 p-6 space-y-4 rounded-none flex flex-col">
                        <div className="flex items-center gap-2 text-accent-cyan text-xs font-mono uppercase tracking-wider">
                          <Clock className="w-4 h-4" />
                          <span>1:1 Session Sync Logs</span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 max-h-[290px] pr-2">
                          {activeRoom.meetings.length === 0 ? (
                            <p className="text-xs text-muted-foreground font-mono text-center pt-8">No sync sessions logged yet.</p>
                          ) : (
                            activeRoom.meetings.map((meet) => (
                              <div key={meet.id} className="p-3 bg-white/5 border border-white/10 font-mono space-y-2">
                                <div className="flex justify-between items-center border-b border-white/5 pb-1 text-[10px]">
                                  <span className="text-accent-cyan">{meet.date} @ {meet.time}</span>
                                  <span className="text-muted-foreground">Logged Session</span>
                                </div>
                                <h6 className="text-xs font-bold text-white">{meet.topic}</h6>
                                <p className="text-[10px] text-muted-foreground leading-normal italic">
                                  "{meet.notes}"
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </Card>

                    </div>

                  </div>
                </div>
              ) : (
                <div className="p-12 text-center border border-dashed border-accent-green/20 space-y-6">
                  <div className="mx-auto w-16 h-16 rounded-full bg-accent-green/10 flex items-center justify-center border border-accent-green/20">
                    <Users className="w-8 h-8 text-accent-green" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">No Active Mentorship Link Established</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Complete your mentee application and trigger the matching algorithm to establish an active mentorship partnership.
                    </p>
                  </div>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setActiveTab('apply')}
                      className="px-4 py-2 border border-accent-green bg-accent-green/10 text-accent-green font-mono text-xs uppercase tracking-wider hover:bg-accent-green/20 transition-all"
                    >
                      Apply as Mentee
                    </button>
                    <button
                      onClick={() => setActiveTab('match')}
                      className="px-4 py-2 border border-accent-cyan bg-accent-cyan/10 text-accent-cyan font-mono text-xs uppercase tracking-wider hover:bg-accent-cyan/20 transition-all"
                    >
                      Pair with Mentor
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* VOLUNTEER MENTOR ONBOARDING */}
          {activeTab === 'onboard' && (
            <motion.div
              key="onboard-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto"
            >
              {isMentor && mentorData ? (
                <Card className="bg-black/40 border border-accent-green/20 p-8 space-y-6 rounded-none">
                  <div className="flex items-center gap-2 text-accent-green text-xs font-mono uppercase tracking-widest border-b border-accent-green/15 pb-4">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Your Mentor Profile Is Active!</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent-green/15 border border-accent-green/30 flex items-center justify-center text-white font-bold rounded-full">
                        {mentorData.displayName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{mentorData.displayName}</h4>
                        <p className="text-xs text-muted-foreground">Community Mentor / Guide Profile</p>
                      </div>
                    </div>

                    <div className="space-y-3 font-mono text-xs pt-4 border-t border-accent-green/10">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expertise:</span>
                        <span className="text-accent-green">{mentorData.skills.join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weekly availability:</span>
                        <span className="text-accent-cyan">{mentorData.availability}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground block mb-1">Your Intro Bio:</span>
                        <p className="p-3 bg-white/5 border border-white/10 italic text-white text-[11px] leading-relaxed">
                          "{mentorData.bio || 'No bio entered.'}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-accent-green/10">
                    <button
                      onClick={handleRemoveMentor}
                      className="px-4 py-2 border border-red-500 bg-red-500/10 text-red-400 font-mono text-xs uppercase tracking-wider hover:bg-red-500/20 transition-all"
                    >
                      Disable Mentor Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsMentor(false);
                        setMentorBio(mentorData.bio);
                        setMentorSkills(mentorData.skills);
                        setMentorHours(mentorData.availability);
                      }}
                      className="px-4 py-2 border border-accent-green text-accent-green font-mono text-xs uppercase tracking-wider hover:bg-accent-green/10 transition-all"
                    >
                      Update Profile Info
                    </button>
                  </div>
                </Card>
              ) : (
                <Card className="bg-black/40 border border-accent-green/20 p-8 space-y-6 rounded-none">
                  <div className="space-y-2 border-b border-accent-green/15 pb-4">
                    <h3 className="text-xl font-bold text-white">Volunteer as a Grindly Mentor</h3>
                    <p className="text-xs text-muted-foreground">
                      Help junior and mid-level developers level up their architectural systems skillsets. Share your knowledge of the Grindly Stack.
                    </p>
                  </div>

                  <form onSubmit={handleMentorOnboarding} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-white block uppercase tracking-wider">Expertise in Grindly Stack</label>
                      <p className="text-[11px] text-muted-foreground mb-2">Select the frameworks you can confidently review and teach:</p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['React', 'Next.js', 'Node.js', 'Supabase'].map((tech) => (
                          <button
                            type="button"
                            key={tech}
                            onClick={() => {
                              if (mentorSkills.includes(tech)) {
                                setMentorSkills(mentorSkills.filter(s => s !== tech));
                              } else {
                                setMentorSkills([...mentorSkills, tech]);
                              }
                            }}
                            className={`p-3 border font-mono text-xs transition-all text-center ${
                              mentorSkills.includes(tech)
                                ? 'bg-accent-green/15 border-accent-green text-accent-green'
                                : 'bg-black/40 border-white/10 text-muted-foreground hover:border-white/20'
                            }`}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono text-white block uppercase tracking-wider">Availability (Hours/Week)</label>
                      <select
                        value={mentorHours}
                        onChange={(e) => setMentorHours(e.target.value)}
                        className="w-full bg-black border border-accent-green/20 p-3 text-xs font-mono text-white rounded-none focus:border-accent-cyan"
                      >
                        <option value="1 hour / week">1 hour / week</option>
                        <option value="2 hours / week">2 hours / week</option>
                        <option value="3 hours / week">3 hours / week</option>
                        <option value="4 hours / week">4 hours / week</option>
                        <option value="5+ hours / week">5+ hours / week</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono text-white block uppercase tracking-wider">Mentor Bio & Experience</label>
                      <textarea
                        required
                        value={mentorBio}
                        onChange={(e) => setMentorBio(e.target.value)}
                        placeholder="Detail your engineering background, favorite stack tricks, and teaching style..."
                        className="w-full h-32 bg-black border border-accent-green/20 text-white rounded-none p-3 text-xs font-mono focus:outline-none focus:border-accent-cyan"
                      />
                    </div>

                    <Button 
                      type="submit"
                      disabled={mentorSkills.length === 0}
                      className="w-full bg-accent-green text-black hover:bg-accent-green/80 rounded-none font-mono text-xs uppercase"
                    >
                      Onboard as Volunteer Guide
                    </Button>
                  </form>
                </Card>
              )}
            </motion.div>
          )}

          {/* MENTEE APPLICATION VIEW */}
          {activeTab === 'apply' && (
            <motion.div
              key="apply-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto"
            >
              {isMentee && menteeData ? (
                <Card className="bg-black/40 border border-accent-green/20 p-8 space-y-6 rounded-none">
                  <div className="flex items-center gap-2 text-accent-cyan text-xs font-mono uppercase tracking-widest border-b border-accent-cyan/15 pb-4">
                    <CheckCircle2 className="w-5 h-5 text-accent-cyan" />
                    <span>Your Mentee Application Is Saved</span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-white">{menteeData.displayName}</h4>
                      <p className="text-xs text-muted-foreground">Pending matching checks.</p>
                    </div>

                    <div className="space-y-3 font-mono text-xs pt-4 border-t border-accent-green/10">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Primary architectural focus:</span>
                        <span className="text-accent-cyan font-bold">{menteeData.primaryStack}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Selected program commitment:</span>
                        <span className="text-accent-green">{menteeData.commitment}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-muted-foreground block mb-1">Your Professional Goals:</span>
                        <p className="p-3 bg-white/5 border border-white/10 text-white text-[11px] leading-relaxed">
                          {menteeData.goals}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-muted-foreground block mb-1">Identified Development Needs:</span>
                        <p className="p-3 bg-white/5 border border-white/10 text-white text-[11px] leading-relaxed">
                          {menteeData.needs}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-accent-green/10">
                    <button
                      onClick={handleRemoveMentee}
                      className="px-4 py-2 border border-red-500 bg-red-500/10 text-red-400 font-mono text-xs uppercase tracking-wider hover:bg-red-500/20 transition-all"
                    >
                      Withdraw Application
                    </button>
                    <button
                      onClick={() => {
                        setIsMentee(false);
                        setMenteeGoal(menteeData.goals);
                        setMenteeNeeds(menteeData.needs);
                        setMenteeStack(menteeData.primaryStack);
                        setMenteeCommit(menteeData.commitment);
                      }}
                      className="px-4 py-2 border border-accent-cyan text-accent-cyan font-mono text-xs uppercase tracking-wider hover:bg-accent-cyan/10 transition-all"
                    >
                      Edit Application Details
                    </button>
                    <button
                      onClick={() => setActiveTab('match')}
                      className="px-4 py-2 bg-accent-green text-black font-mono text-xs uppercase tracking-wider hover:bg-accent-green/80 transition-all ml-auto"
                    >
                      Find Match Now →
                    </button>
                  </div>
                </Card>
              ) : (
                <Card className="bg-black/40 border border-accent-green/20 p-8 space-y-6 rounded-none">
                  <div className="space-y-2 border-b border-accent-green/15 pb-4">
                    <h3 className="text-xl font-bold text-white">Apply for Structured Mentorship</h3>
                    <p className="text-xs text-muted-foreground">
                      Accelerate your career track. Submit your development goals and core needs to pair with expert architects.
                    </p>
                  </div>

                  <form onSubmit={handleMenteeApplication} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-white block uppercase tracking-wider">Primary Architectural focus</label>
                      <select
                        value={menteeStack}
                        onChange={(e) => setMenteeStack(e.target.value)}
                        className="w-full bg-black border border-accent-green/20 p-3 text-xs font-mono text-white rounded-none focus:border-accent-cyan"
                      >
                        <option value="React">React UI Optimisations & Core Patterns</option>
                        <option value="Next.js">Next.js Edge & SSR Server Architecture</option>
                        <option value="Node.js">Node.js Scalable Cloud Backends</option>
                        <option value="Supabase">Supabase DB Modeling & Secure Rules</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono text-white block uppercase tracking-wider">Commitment Cadence</label>
                      <select
                        value={menteeCommit}
                        onChange={(e) => setMenteeCommit(e.target.value)}
                        className="w-full bg-black border border-accent-green/20 p-3 text-xs font-mono text-white rounded-none focus:border-accent-cyan"
                      >
                        <option value="3-month guided commitment">3-Month guided commitment (Weekly sync)</option>
                        <option value="6-month extended commitment">6-Month extended commitment (Bi-weekly sync)</option>
                        <option value="Flexible intervals">Flexible intervals (Ad-hoc reviews)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono text-white block uppercase tracking-wider">Professional Goals</label>
                      <textarea
                        required
                        value={menteeGoal}
                        onChange={(e) => setMenteeGoal(e.target.value)}
                        placeholder="Detail what you wish to achieve (e.g. Master system designs, lead engineering teams, clear advanced pipeline blocks)..."
                        className="w-full h-20 bg-black border border-accent-green/20 text-white rounded-none p-3 text-xs font-mono focus:outline-none focus:border-accent-cyan"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono text-white block uppercase tracking-wider">Identified Development Needs</label>
                      <textarea
                        required
                        value={menteeNeeds}
                        onChange={(e) => setMenteeNeeds(e.target.value)}
                        placeholder="Identify specific skills or conceptual blocks you require 1:1 mentorship for..."
                        className="w-full h-20 bg-black border border-accent-green/20 text-white rounded-none p-3 text-xs font-mono focus:outline-none focus:border-accent-cyan"
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-accent-cyan text-black hover:bg-accent-cyan/80 rounded-none font-mono text-xs uppercase"
                    >
                      Submit Mentee Application
                    </Button>
                  </form>
                </Card>
              )}
            </motion.div>
          )}

          {/* FIND MY MATCH / SIMULATOR VIEW */}
          {activeTab === 'match' && (
            <motion.div
              key="match-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-xl mx-auto"
            >
              {!isMentee ? (
                <div className="p-8 text-center border border-accent-green/20 bg-black/40 space-y-4 font-mono">
                  <Lock className="w-8 h-8 text-accent-green mx-auto" />
                  <h4 className="text-sm font-bold text-white uppercase">Application Required</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You must submit a mentee application identifying your professional goals first in order to trigger the smart pairing algorithm.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('apply')}
                    className="bg-accent-green text-black hover:bg-accent-green/80 rounded-none font-mono text-xs uppercase mt-2"
                  >
                    Apply Now
                  </Button>
                </div>
              ) : activeRoom ? (
                <div className="p-8 text-center border border-accent-green/20 bg-black/40 space-y-4 font-mono">
                  <CheckCircle2 className="w-8 h-8 text-accent-green mx-auto" />
                  <h4 className="text-sm font-bold text-white uppercase">Active Connection Established</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You are already matched with a mentor. To link with another, terminate the active partnership in your Mentorship Room first.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('room')}
                    className="bg-accent-green text-black hover:bg-accent-green/80 rounded-none font-mono text-xs uppercase mt-2"
                  >
                    View Active Room
                  </Button>
                </div>
              ) : matchingStep === 0 ? (
                <Card className="bg-black/40 border border-accent-green/20 p-8 space-y-6 rounded-none">
                  <div className="space-y-2 border-b border-accent-green/15 pb-4">
                    <h3 className="text-xl font-bold text-white">Smart Matchmaking Algorithm</h3>
                    <p className="text-xs text-muted-foreground">
                      Our system analyzes architectural goals, tech preferences, and commitment schedules to find the absolute best mentor.
                    </p>
                  </div>

                  <div className="space-y-4 font-mono text-xs">
                    <div className="p-4 bg-white/5 border border-white/10 space-y-2">
                      <h5 className="font-bold text-white">Profile Alignment Details:</h5>
                      <p className="text-muted-foreground">Primary focus: <span className="text-accent-cyan font-bold">{menteeData?.primaryStack}</span></p>
                      <p className="text-muted-foreground">Commitment levels: <span className="text-accent-green">{menteeData?.commitment}</span></p>
                      <p className="text-muted-foreground">Specific request: <span className="text-white italic">"{menteeData?.goals.substring(0, 60)}..."</span></p>
                    </div>
                  </div>

                  <Button 
                    onClick={startMatchingSimulation}
                    className="w-full bg-accent-green text-black hover:bg-accent-green/80 rounded-none font-mono text-xs uppercase flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Trigger Pairing Engine
                  </Button>
                </Card>
              ) : (
                <Card className="bg-black/40 border border-accent-green/20 p-8 rounded-none space-y-6 font-mono">
                  {/* Step 1: Initializing */}
                  {matchingStep === 1 && (
                    <div className="space-y-4 text-center py-6">
                      <div className="w-12 h-12 border-2 border-accent-green border-t-transparent animate-spin mx-auto rounded-full" />
                      <div className="space-y-2">
                        <p className="text-xs text-accent-green uppercase tracking-widest animate-pulse">Initializing Pairing Algorithm...</p>
                        <p className="text-[10px] text-muted-foreground">Establishing secure stack parser interfaces...</p>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Database Scanning */}
                  {matchingStep === 2 && (
                    <div className="space-y-4 text-center py-6">
                      <div className="w-12 h-12 border-2 border-accent-cyan border-t-transparent animate-spin mx-auto rounded-full" />
                      <div className="space-y-2">
                        <p className="text-xs text-accent-cyan uppercase tracking-widest animate-pulse">Parsing Volunteer Mentor Registry...</p>
                        <p className="text-[10px] text-muted-foreground">Filtering database by target: "{menteeData?.primaryStack}" expertise...</p>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Alighment check */}
                  {matchingStep === 3 && (
                    <div className="space-y-4 text-center py-6">
                      <div className="w-12 h-12 border-2 border-accent-yellow border-t-transparent animate-spin mx-auto rounded-full" />
                      <div className="space-y-2">
                        <p className="text-xs text-accent-yellow uppercase tracking-widest animate-pulse">Calculating Compatibility Index...</p>
                        <p className="text-[10px] text-muted-foreground">Aligning weekly commitment schedules and timezone scopes...</p>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Found Match! */}
                  {matchingStep === 4 && selectedMentorForMatch && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-6 text-center py-4"
                    >
                      <div className="w-20 h-20 bg-accent-green/10 border-2 border-accent-green flex items-center justify-center rounded-full mx-auto relative">
                        <img 
                          src={selectedMentorForMatch.avatar} 
                          alt={selectedMentorForMatch.displayName} 
                          className="w-18 h-18 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-accent-green text-black rounded-full p-1 border border-black">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-md font-bold text-white uppercase tracking-wider">Perfect Architect Linked!</h4>
                        <h3 className="text-xl font-black text-accent-green">{selectedMentorForMatch.displayName}</h3>
                        <p className="text-xs text-muted-foreground">{selectedMentorForMatch.role} @ {selectedMentorForMatch.company}</p>
                      </div>

                      <div className="p-4 bg-white/5 border border-white/10 text-left text-xs space-y-2 max-w-sm mx-auto">
                        <p className="text-muted-foreground font-semibold">Match Score Metrics:</p>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span>Framework Alignment:</span>
                          <span className="text-accent-green">100% Verbatim</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span>Commitment Availability:</span>
                          <span className="text-accent-cyan">High Accordance</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic leading-normal pt-1">
                          "{selectedMentorForMatch.displayName} specializes in your selected primary focus: {menteeData?.primaryStack}."
                        </p>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => setMatchingStep(0)}
                          className="flex-1 px-4 py-2 border border-white/10 text-muted-foreground font-mono text-xs uppercase tracking-wider hover:bg-white/5 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={confirmMatchAndInitializeRoom}
                          className="flex-1 px-4 py-2 bg-accent-green text-black font-mono text-xs uppercase tracking-wider hover:bg-accent-green/80 transition-all font-bold"
                        >
                          Lock Match & Enter Room
                        </button>
                      </div>
                    </motion.div>
                  )}
                </Card>
              )}
            </motion.div>
          )}

          {/* SPECIFICATION & ARCHITECTURE TAB */}
          {activeTab === 'specs' && (
            <motion.div
              key="specs-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Developer Implementation User Stories */}
                <Card className="bg-black/40 border border-accent-green/20 p-6 space-y-4 rounded-none">
                  <div className="flex items-center gap-2 text-accent-green text-xs font-mono uppercase tracking-wider">
                    <CheckSquare className="w-5 h-5" />
                    <span>User Stories for Developer Implementation</span>
                  </div>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 font-mono text-xs text-muted-foreground leading-relaxed">
                    <div className="space-y-1.5 border-l-2 border-accent-green pl-3">
                      <h5 className="font-bold text-white text-xs">US-01: Volunteer Onboarding</h5>
                      <p><strong>As a</strong> senior software engineer in the community,</p>
                      <p><strong>I want to</strong> list my expertise, enter my bios, and declare my exact weekly availability,</p>
                      <p><strong>So that</strong> I can onboard seamlessly as a volunteer mentor and guide mentees efficiently.</p>
                      <p className="text-[10px] text-accent-green">✓ Acceptance Criteria: Validates that at least one primary stack expertise is selected before submission.</p>
                    </div>

                    <div className="space-y-1.5 border-l-2 border-accent-cyan pl-3">
                      <h5 className="font-bold text-white text-xs">US-02: Mentee Guided Application</h5>
                      <p><strong>As an</strong> aspiring developer working towards system mastery,</p>
                      <p><strong>I want to</strong> submit a guided mentorship application specifying my goals and needs,</p>
                      <p><strong>So that</strong> the pairing algorithm has sufficient parameters to scan matching mentors.</p>
                      <p className="text-[10px] text-accent-cyan">✓ Acceptance Criteria: Saves goals and needs in robust Firestore documents with immutable owner references.</p>
                    </div>

                    <div className="space-y-1.5 border-l-2 border-accent-yellow pl-3">
                      <h5 className="font-bold text-white text-xs">US-03: Algorithmic Verification</h5>
                      <p><strong>As a</strong> registered user looking for guidelines,</p>
                      <p><strong>I want to</strong> activate an automated matching scan that evaluates framework skills and available hours,</p>
                      <p><strong>So that</strong> I am matched with the absolute best fitting professional mentor without manual intervention.</p>
                    </div>

                    <div className="space-y-1.5 border-l-2 border-purple-400 pl-3">
                      <h5 className="font-bold text-white text-xs">US-04: Structured Room Cadence</h5>
                      <p><strong>As a</strong> matched pair (mentor & mentee),</p>
                      <p><strong>I want to</strong> access a centralized workspace featuring a 12-week commitment tracker and checkable milestones,</p>
                      <p><strong>So that</strong> we can coordinate deliverables and ensure progressive learning.</p>
                    </div>
                  </div>
                </Card>

                {/* Technical Architecture & Database Topology */}
                <Card className="bg-black/40 border border-accent-green/20 p-6 space-y-4 rounded-none">
                  <div className="flex items-center gap-2 text-accent-cyan text-xs font-mono uppercase tracking-wider">
                    <Code className="w-5 h-5" />
                    <span>High-Level Technical Architecture</span>
                  </div>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 font-mono text-xs text-muted-foreground leading-relaxed">
                    <div className="space-y-2">
                      <h5 className="font-bold text-white text-xs">1. Database Entity Models (Firestore)</h5>
                      <p>The system stores mentorship schemas natively using high-performance relational paths: </p>
                      
                      <div className="p-3 bg-white/5 border border-white/10 space-y-2 text-[10px]">
                        <p><strong className="text-accent-green">/mentors/&#123;userId&#125;</strong>: Stores expert credentials, bio metrics, and capacity levels.</p>
                        <p><strong className="text-accent-cyan">/mentees/&#123;userId&#125;</strong>: Holds active applications, primary target stack, and learning blocks.</p>
                        <p><strong className="text-purple-400">/mentorshipRooms/&#123;roomId&#125;</strong>: Holds collaborative states, checkable goal arrays, and historical 1:1 sync logs.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-bold text-white text-xs">2. Pairing Logic Engine</h5>
                      <p>The matching algorithm is implemented on client-side (or backed by safe cloud-functions) prioritizing: </p>
                      <ul className="list-disc list-inside space-y-1 pl-2 text-[11px]">
                        <li><span className="text-white">Strict Expert Indexing:</span> Filters mentors where <code className="text-accent-green">mentor.skills</code> contains <code className="text-accent-cyan">mentee.primaryStack</code>.</li>
                        <li><span className="text-white">Availability Sizing:</span> Compares commitment weight.</li>
                        <li><span className="text-white">Relational Integrity:</span> Verifies and blocks duplicated active matches.</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-bold text-white text-xs">3. Security Rule Blueprints</h5>
                      <p>All database routes are protected by zero-trust policies:</p>
                      <p className="p-2.5 bg-black text-[10px] border border-white/5 leading-normal">
                        - Mentors profiles: Read permitted to all logged in users. Write restricted to matching owner UID.<br />
                        - Mentees profiles: Read and write restricted exclusively to matching owner UID.<br />
                        - Mentorship Room workspaces: Restricted strictly to the linked mentor or mentee pair.
                      </p>
                    </div>
                  </div>
                </Card>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};



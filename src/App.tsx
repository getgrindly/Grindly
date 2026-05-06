/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { Sandbox } from '@/components/Sandbox';
import { CodeReview } from '@/components/CodeReview';
import { TrackList } from '@/components/TrackList';
import { ArchitectureCanvas } from '@/components/ArchitectureCanvas';
import { LandingPage } from '@/components/LandingPage';
import { GitSimulator } from '@/components/GitSimulator';
import { PipelineViewer } from '@/components/PipelineViewer';
import { CurriculumView } from '@/components/CurriculumView';
import { PrivacyProtocol } from '@/components/PrivacyProtocol';
import { TermsOfService } from '@/components/TermsOfService';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (!authUser) {
        setUserProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      }
      setLoading(false);
    }, (error) => {
      console.error("Profile link error:", error);
      setLoading(false);
    });
    return () => unsubscribeProfile();
  }, [user]);

  const ActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard userProfile={userProfile} />;
      case 'foundations':
        return <TrackList trackId="foundations" />;
      case 'design':
        return <ArchitectureCanvas />;
      case 'sandbox':
        return <Sandbox />;
      case 'review':
        return <CodeReview />;
      case 'grind-workflow':
        return <TrackList trackId="grind-workflow" />;
      case 'pro-skills':
        return <TrackList trackId="pro-skills" />;
      case 'git':
        return <GitSimulator />;
      case 'pipeline':
        return <PipelineViewer />;
      case 'curriculum':
        return <CurriculumView onBack={() => setActiveTab('dashboard')} />;
      case 'privacy':
        return <PrivacyProtocol onBack={() => setActiveTab('dashboard')} />;
      case 'terms':
        return <TermsOfService onBack={() => setActiveTab('dashboard')} />;
      default:
        return <Dashboard userProfile={userProfile} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div 
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-screen w-full bg-black flex items-center justify-center font-mono text-accent-green"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-1 bg-accent-green/20 overflow-hidden">
              <motion.div 
                className="h-full bg-accent-green"
                animate={{ x: [-64, 64] }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </div>
            <span className="text-[10px] animate-pulse uppercase tracking-widest">Initialising Architect Framework...</span>
          </div>
        </motion.div>
      ) : !user ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full"
        >
          {activeTab === 'privacy' ? (
             <PrivacyProtocol onBack={() => setActiveTab('landing')} />
          ) : activeTab === 'terms' ? (
             <TermsOfService onBack={() => setActiveTab('landing')} />
          ) : activeTab === 'curriculum' ? (
             <CurriculumView onBack={() => setActiveTab('landing')} />
          ) : (
             <LandingPage onNavigate={setActiveTab} />
          )}
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full"
        >
          <Layout activeId={activeTab} onNavigate={setActiveTab}>
            <ActiveView />
          </Layout>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

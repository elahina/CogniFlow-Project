import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Target, HelpCircle, User, Settings2, Activity, MessageSquare, History as HistoryIcon, Compass, Layers } from 'lucide-react';
import { cn } from './lib/utils';
import ChatAgent from './components/ChatAgent';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import LanguageSelector from './components/LanguageSelector';
import Settings from './components/Settings';
import StyleSelector from './components/StyleSelector';
import History from './components/History';
import DriftDetection from './components/DriftDetection';
import ShadowSim from './components/ShadowSim';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [language, setLanguage] = useState<string | null>(null);
  const [userStyle, setUserStyle] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'history' | 'drift' | 'shadow' | 'settings'>('dashboard');
  const [sessionData, setSessionData] = useState<any>(null);

  // Initial fetch of state
  const fetchState = async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        setSessionData(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchState();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLanguage(null);
    setUserStyle(null);
    setActiveTab('dashboard');
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  if (!language) {
    return <LanguageSelector onSelect={setLanguage} />;
  }

  if (!userStyle) {
    return <StyleSelector onSelect={setUserStyle} />;
  }

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Sidebar */}
      <aside className="w-20 md:w-64 border-r border-slate-800/60 bg-[#0F0F11] flex flex-col transition-all duration-300">
        <div className="p-4 md:p-6 flex items-center gap-3 border-b border-slate-800/60">
          <div className="bg-indigo-500/10 p-2 rounded-xl flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="font-bold text-lg hidden md:block tracking-wide">Cogniflow.</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              "w-full flex items-center gap-3 px-3 md:px-4 py-3 md:py-3.5 rounded-xl transition-all duration-200 group text-sm font-medium",
              activeTab === 'dashboard' ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
            )}
          >
            <Activity className="w-5 h-5" />
            <span className="hidden md:block">System Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('chat')}
            className={cn(
              "w-full flex items-center gap-3 px-3 md:px-4 py-3 md:py-3.5 rounded-xl transition-all duration-200 group text-sm font-medium",
              activeTab === 'chat' ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
            )}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="hidden md:block">New Chat</span>
          </button>

          <button 
            onClick={() => setActiveTab('history')}
            className={cn(
              "w-full flex items-center gap-3 px-3 md:px-4 py-3 md:py-3.5 rounded-xl transition-all duration-200 group text-sm font-medium",
              activeTab === 'history' ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
            )}
          >
            <HistoryIcon className="w-5 h-5" />
            <span className="hidden md:block">History</span>
          </button>

          <button 
            onClick={() => setActiveTab('drift')}
            className={cn(
              "w-full flex items-center gap-3 px-3 md:px-4 py-3 md:py-3.5 rounded-xl transition-all duration-200 group text-sm font-medium",
              activeTab === 'drift' ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
            )}
          >
            <Compass className="w-5 h-5" />
            <span className="hidden md:block">Goal Drift</span>
          </button>

          <button 
            onClick={() => setActiveTab('shadow')}
            className={cn(
              "w-full flex items-center gap-3 px-3 md:px-4 py-3 md:py-3.5 rounded-xl transition-all duration-200 group text-sm font-medium",
              activeTab === 'shadow' ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
            )}
          >
            <Layers className="w-5 h-5" />
            <span className="hidden md:block">Shadow Sim</span>
          </button>
        </nav>
        
        <div className="p-4 border-t border-slate-800/60">
          <button 
            onClick={() => setActiveTab('settings')}
            className={cn(
              "w-full flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
              activeTab === 'settings' ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
            )}
          >
            <Settings2 className="w-5 h-5" />
            <span className="hidden md:block">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-[#0A0A0B] to-[#0A0A0B]">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 overflow-y-auto w-full h-full"
            >
              <Dashboard sessionData={sessionData} onUpdate={fetchState} onNavigate={setActiveTab} />
            </motion.div>
          ) : activeTab === 'chat' ? (
            <motion.div
               key="chat"
               initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
               animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
               exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
               transition={{ duration: 0.3 }}
               className="absolute inset-0 w-full h-full flex flex-col"
            >
              <ChatAgent sessionData={sessionData} onUpdate={fetchState} language={language} userStyle={userStyle} />
            </motion.div>
          ) : activeTab === 'history' ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full flex flex-col"
            >
              <History sessionData={sessionData} onUpdate={fetchState} />
            </motion.div>
          ) : activeTab === 'drift' ? (
            <motion.div
              key="drift"
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 overflow-y-auto w-full h-full"
            >
              <DriftDetection sessionData={sessionData} onNavigate={setActiveTab} />
            </motion.div>
          ) : activeTab === 'shadow' ? (
            <motion.div
              key="shadow"
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 overflow-y-auto w-full h-full"
            >
              <ShadowSim sessionData={sessionData} onNavigate={setActiveTab} />
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 overflow-y-auto w-full h-full"
            >
              <Settings onLogout={handleLogout} currentLanguage={language} currentStyle={userStyle} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

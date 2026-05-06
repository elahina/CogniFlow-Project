import { useState } from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);
      // For this prototype, we consider any valid format as successful login
      onLogin();
    }, 1200);
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0B] text-slate-200 overflow-hidden font-sans relative selection:bg-indigo-500/30 w-full">
      {/* Background glowing effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex flex-col flex-1 items-center justify-center p-6 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Logo & Brand */}
          <div className="flex flex-col items-center mb-10">
            <div className="bg-indigo-500/10 p-4 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
              <BrainCircuit className="w-10 h-10 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Cogniflow.</h1>
            <p className="text-slate-400 text-center max-w-xs">
              Sign in to your cognitive self-improving agent dashboard
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-[#141416]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Subtle inner highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl flex items-start gap-3 text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-slate-700/80 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-sans"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-slate-700/80 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-sans"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3.5 px-4 font-semibold text-sm transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2 group mt-6"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-slate-800/60 text-center">
               <p className="text-sm text-slate-500">
                 Don't have an account? <a href="#" className="text-slate-300 font-medium hover:text-white transition-colors">Create one</a>
               </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

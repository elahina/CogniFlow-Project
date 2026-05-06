import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, MessageSquare, Clock, Bot, User, ThumbsUp, ThumbsDown, AlertCircle, Sparkles } from 'lucide-react';

export default function History({ sessionData, onUpdate }: { sessionData: any; onUpdate: () => void }) {
  const chatHistory = sessionData?.chatHistory || [];

  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteHistory = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' });
      onUpdate();
      setShowConfirm(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-4xl mx-auto h-full flex flex-col">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Clock className="w-8 h-8 text-indigo-400" />
            Interaction History
          </h1>
          <p className="text-slate-400 mt-2">Review past conversations with the cognitive agent.</p>
        </div>
        {showConfirm ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-300 mr-2">Are you sure?</span>
            <button
              onClick={handleDeleteHistory}
              className="px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-all font-medium text-sm shadow-md"
            >
              Yes
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all font-medium text-sm"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={chatHistory.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/30 rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete History</span>
          </button>
        )}
      </header>

      <div className="flex-1 bg-[#141416]/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <MessageSquare className="w-12 h-12 opacity-20 mb-4" />
              <p>No chat history available.</p>
            </div>
          ) : (
            <AnimatePresence>
              {chatHistory.map((msg: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-slate-800 border-slate-700' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                    {msg.role === 'user' ? <User className="w-5 h-5 text-slate-400" /> : <Bot className="w-5 h-5 text-indigo-400" />}
                  </div>
                  <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                     <div className={`px-5 py-3 rounded-2xl flex flex-col gap-3 ${msg.role === 'user' ? 'bg-slate-800 text-slate-200 rounded-tr-sm' : 'bg-[#1A1A1D] border border-slate-800 text-slate-300 rounded-tl-sm'}`}>
                       <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                       
                       {/* Feedback details shown in history */}
                       {msg.feedback && (
                         <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-slate-700/50">
                           {msg.feedback.positive ? (
                             <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                               <ThumbsUp className="w-3.5 h-3.5" /> Positively Rated
                             </div>
                           ) : (
                             <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
                               <div className="flex justify-between items-start mb-2">
                                 <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                                   <ThumbsDown className="w-3.5 h-3.5" /> Flagged & Rejected
                                 </div>
                               </div>
                               {msg.feedback.reason && (
                                 <p className="text-xs text-rose-300/80 mb-3 ml-5">
                                   <span className="font-semibold text-rose-300">Failure reason:</span> {msg.feedback.reason}
                                 </p>
                               )}
                               {msg.feedback.rewritten_prompt && (
                                 <div className="bg-indigo-500/10 border border-indigo-500/20 rounded p-3 ml-5">
                                   <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 mb-1">
                                     <Sparkles className="w-3.5 h-3.5" /> Auto-Rewritten Prompt for Future:
                                   </div>
                                   <p className="text-xs text-indigo-300/90 italic">"{msg.feedback.rewritten_prompt}"</p>
                                 </div>
                               )}
                             </div>
                           )}
                         </div>
                       )}
                     </div>
                     <span className="text-[10px] text-slate-500 mt-1.5 px-1 uppercase tracking-wider">{new Date(msg.timestamp).toLocaleString()}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

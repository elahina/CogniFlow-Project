import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, Activity, SearchCheck, CheckCircle2, Plus, Mic, HardDrive, Upload, Camera, ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import CameraModal from './CameraModal';

export default function ChatAgent({ sessionData, onUpdate, language, userStyle }: { sessionData: any; onUpdate: () => void; language: string; userStyle: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [feedbackState, setFeedbackState] = useState<{ index: number, reason: string } | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileNames = Array.from(e.target.files).map(f => f.name).join(', ');
      setInput(prev => prev + (prev.length > 0 ? ' ' : '') + `[Uploaded File(s): ${fileNames}] `);
      setShowOptions(false);
    }
  };

  const handleCameraCapture = (dataUrl: string) => {
    // In a real app, you would upload this dataUrl or send it with the request
    setInput(prev => prev + (prev.length > 0 ? ' ' : '') + `[Captured Image] `);
    setIsCameraOpen(false);
  };

  const handleDriveClick = () => {
    // Simulate Drive picker since we can't easily implement real Google Drive without full setup
    alert("Google Drive API would open a picker here. Simulating by adding text.");
    setInput(prev => prev + (prev.length > 0 ? ' ' : '') + `[Linked from Drive: document.pdf] `);
    setShowOptions(false);
  };

  const handleVoiceInput = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US'; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev.length > 0 && !prev.endsWith(' ') ? ' ' : '') + transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      if (event.error === 'not-allowed') {
        alert('Microphone access was denied. Please allow microphone access to use voice typing.');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleFeedback = async (index: number, positive: boolean, reason: string = "") => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageIndex: index, positive, reason })
      });
      await onUpdate();
      setFeedbackState(null);
    } catch (err) {
      console.error("Feedback failed:", err);
    }
  };

  useEffect(() => {
    if (sessionData?.chatHistory) {
      setMessages(sessionData.chatHistory);
    }
  }, [sessionData]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;
    
    const userMessageStr = input;
    setInput("");
    
    const optimisticMessage = { role: "user", content: userMessageStr, timestamp: new Date() };
    setMessages(prev => [...prev, optimisticMessage]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessageStr, language, userStyle })
      });
      if (res.ok) {
        await onUpdate(); // Pulls the latest state from backend which sets the messages
      } else {
        const errorData = await res.json();
        setMessages(prev => [...prev, {
          role: "agent",
          content: `System Alert: ${errorData.error}`,
          explanation: "The connection to the AI provider failed. Check settings.",
          timestamp: new Date()
        }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        role: "agent",
        content: "Network Error: Could not connect to the local server.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0A0A0B]/80 backdrop-blur-xl relative">
      {/* Header */}
      <header className="flex-shrink-0 h-16 border-b border-slate-800/60 bg-[#0F0F11]/80 backdrop-blur-md flex items-center px-6 z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="relative">
             <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-pulse blur" />
             <Bot className="w-6 h-6 text-indigo-400 relative z-10" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-100 flex items-center gap-2">
              Cogniflow Agent
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">Online</span>
            </h2>
            <p className="text-xs text-slate-400">Self-improving cognitive loop active</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.length === 0 && !isTyping && (
          <div className="h-full flex flex-col items-center justify-center max-w-xl mx-auto">
            <div className="text-center space-y-4 text-slate-500 mb-8">
              <Sparkles className="w-12 h-12 text-indigo-500/50 mx-auto" />
              <p className="text-xl font-semibold text-slate-300">Hello. What is your goal today?</p>
              <p className="text-sm">I am your self-improving AI agent. I will track your actions and help you stay aligned.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {[
                "Help me set up a 3-month learning goal for Python.",
                "Review my latest code for memory management.",
                "How can I reduce drift on my productivity goal?",
                "Initialize cognitive loop diagnostic."
              ].map((sugg, i) => (
                 <button 
                  key={i}
                  onClick={() => setInput(sugg)}
                  className="p-4 bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/50 hover:border-indigo-500/30 rounded-2xl text-left text-sm text-slate-300 transition-all text-balance"
                 >
                   {sugg}
                 </button>
              ))}
            </div>
          </div>
        )}
        
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex flex-col max-w-3xl", msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start")}
            >
              <div className="flex items-end gap-2">
                {msg.role === 'agent' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                    <Bot className="w-4 h-4 text-indigo-400" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-slate-800 text-slate-200 rounded-br-sm border border-slate-700" 
                      : "bg-[#141416] text-slate-300 rounded-bl-sm border border-slate-800"
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
              
              {/* Explainable AI (XAI) Box for Agent messages */}
              {msg.role === 'agent' && (
                <div className="ml-10 mt-2 flex flex-col gap-2 w-[90%] md:w-[80%]">
                  {msg.improved_input && (
                     <div className="p-3.5 bg-indigo-500/5 border border-indigo-500/20 rounded-xl text-xs flex items-start gap-3 shadow-inner">
                       <div className="shrink-0 mt-0.5">
                         <Sparkles className="w-4 h-4 text-indigo-400" />
                       </div>
                       <div className="space-y-1.5 flex-1">
                         <p className="font-semibold text-indigo-300">Self-Awareness: Input Refined</p>
                         <p className="text-indigo-200/70 leading-snug italic">"{msg.improved_input}"</p>
                       </div>
                     </div>
                  )}
                  {(msg.explanation || msg.confidence) && (
                    <div className="p-3.5 bg-[#0F0F11] border border-slate-800/80 rounded-xl text-xs text-slate-400 flex items-start gap-3 shadow-inner relative group">
                      <div className="shrink-0 mt-0.5">
                        <SearchCheck className="w-4 h-4 text-indigo-400/80" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-slate-300">XAI Core Analytics</p>
                          <div className="flex items-center gap-3">
                            {msg.confidence && (
                               <div className="flex items-center gap-2 mr-2">
                                 <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Confidence</span>
                                 <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                   <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${msg.confidence}%` }} />
                                 </div>
                                 <span className="text-slate-300 font-mono">{msg.confidence}%</span>
                               </div>
                            )}
                            
                            {/* Feedback Controls */}
                            {msg.feedback ? (
                              <div className="flex items-center gap-1 text-[10px] uppercase font-bold">
                                {msg.feedback.positive ? (
                                  <span className="text-emerald-400 flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> Helpful</span>
                                ) : (
                                  <span className="text-rose-400 flex items-center gap-1"><ThumbsDown className="w-3 h-3" /> Flagged</span>
                                )}
                              </div>
                            ) : (
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                <button onClick={() => handleFeedback(idx, true)} className="p-1 hover:text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors" title="Helpful">
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => setFeedbackState({ index: idx, reason: "" })} className="p-1 hover:text-rose-400 hover:bg-rose-400/10 rounded transition-colors" title="Not Helpful">
                                  <ThumbsDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        {msg.explanation && <p className="leading-snug pt-1 border-t border-slate-800/50">{msg.explanation}</p>}
                        
                        {/* Negative Feedback Input */}
                        {feedbackState?.index === idx && (
                          <div className="pt-2 mt-2 border-t border-rose-500/20">
                            <p className="text-rose-300 text-xs mb-2">Why did this fail?</p>
                            <div className="flex gap-2">
                              <input 
                                autoFocus
                                type="text" 
                                value={feedbackState.reason}
                                onChange={(e) => setFeedbackState({ ...feedbackState, reason: e.target.value })}
                                placeholder="E.g., didn't follow formatting rules..."
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 outline-none focus:border-rose-500/50"
                              />
                              <button 
                                onClick={() => handleFeedback(idx, false, feedbackState.reason)}
                                disabled={!feedbackState.reason.trim()}
                                className="px-2 py-1 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-md text-xs font-semibold flex items-center gap-1"
                              >
                                Submit <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2 max-w-2xl mr-auto">
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="px-6 py-4 rounded-2xl rounded-bl-sm bg-[#141416] border border-slate-800 text-slate-300 shadow-sm flex items-center gap-1.5 h-14">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-gradient-to-t from-[#0A0A0B] to-transparent sticky bottom-0">
        <form 
          onSubmit={handleSend}
          className="max-w-4xl mx-auto flex gap-2 sm:gap-3 p-2 bg-[#141416]/90 backdrop-blur rounded-2xl border border-slate-700 shadow-xl focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all items-center relative"
        >
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className={cn(
                "w-10 h-10 shrink-0 flex items-center justify-center rounded-xl transition-colors",
                showOptions ? "bg-indigo-500/20 text-indigo-400" : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              )}
            >
              <Plus className={cn("w-5 h-5 transition-transform", showOptions && "rotate-45")} />
            </button>
            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-14 left-0 bg-[#1A1A1D] border border-slate-700 p-2 rounded-xl shadow-2xl flex flex-col gap-1 w-48 z-50"
                >
                  <button type="button" onClick={handleDriveClick} className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors">
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                    Drive Access
                  </button>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors">
                    <Upload className="w-4 h-4 text-blue-400" />
                    Upload Files
                  </button>
                  <button type="button" onClick={() => { setIsCameraOpen(true); setShowOptions(false); }} className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors">
                    <Camera className="w-4 h-4 text-rose-400" />
                    Camera
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
          </div>

          <button
            type="button"
            onClick={handleVoiceInput}
            className={cn(
              "w-10 h-10 shrink-0 flex items-center justify-center rounded-xl transition-all",
              isListening ? "bg-rose-500/20 text-rose-400 animate-pulse" : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            )}
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-500 px-2 sm:px-4 text-sm sm:text-base min-w-0"
            placeholder="Type your message, set a goal, or ask for analysis..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shrink-0"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form>
      </div>

      <AnimatePresence>
        {isCameraOpen && <CameraModal onCapture={handleCameraCapture} onClose={() => setIsCameraOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

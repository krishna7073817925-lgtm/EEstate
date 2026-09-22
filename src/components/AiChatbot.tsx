import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  RefreshCw,
  ExternalLink,
  Bot,
  User,
  Search,
  FileText,
  Copy,
  Check,
  ChevronDown
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { useAuth, KRISHNA_ADMIN_EMAIL } from '../context/AuthContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: { title: string; url: string }[];
  searchQueries?: string[];
  timestamp: string;
}

interface AiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReportModal: () => void;
}

export const AiChatbot: React.FC<AiChatbotProps> = ({
  isOpen,
  onClose,
  onOpenReportModal
}) => {
  const { properties, allBookings, reviews } = useProperty();
  const { user } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      text: `Hello! I am your **EEstates AI Real Estate Advisor**, developed for EEstates Agency (Developed by Krishna).

I am equipped with **Gemini 3.5 Flash** and live **Google Search Grounding** to give you real-time market insights, valuation benchmarks, and property recommendations.

How can I assist you today? You can ask about our catalog, regional market trends in Bharatpur & Rajasthan, or ask me to prepare a real estate report!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const siteContext = {
        totalProperties: properties.length,
        propertiesSample: properties.slice(0, 5).map((p) => ({
          title: p.title,
          category: p.category,
          price: p.price,
          location: p.location,
          status: p.status
        })),
        contactEmail: 'krishnaagr047@gmail.com',
        headquarters: '568 narayan circle, bharatpur, Rajasthan, 321001',
        masterAdmin: KRISHNA_ADMIN_EMAIL,
        developer: 'Developed by Krishna'
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            text: m.text
          })),
          siteContext
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to communicate with Gemini AI');
      }

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'model',
        text: data.text || 'I apologize, but no response was returned.',
        sources: data.sources || [],
        searchQueries: data.searchQueries || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `bot_err_${Date.now()}`,
        role: 'model',
        text: `I encountered an issue connecting to the Gemini server: "${err.message}". Please ensure GEMINI_API_KEY is configured or try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    'Generate an executive market report for Bharatpur & Rajasthan real estate',
    'What are the price trends and rental yields in Rajasthan?',
    'Summarize our featured properties and investment opportunities',
    'How do I calculate mortgage down-payment and cap rate?'
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 w-full sm:w-[460px] h-[640px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
      
      {/* Header Bar */}
      <div className="p-4 bg-gradient-to-r from-[#07241B] via-[#0B3B2C] to-[#124b39] text-white flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-heading font-bold text-sm tracking-tight">
                EEstates AI Advisor
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Gemini 3.5
              </span>
            </div>
            <p className="text-[10px] text-stone-300">
              Real-Time Google Search Grounding • Developed by Krishna
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              onClose();
              onOpenReportModal();
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-stone-300 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1"
            title="Make a Formal Real Estate Report"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline text-[11px]">Make Report</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50 text-xs sm:text-sm">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-xl bg-[#0B3B2C] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                  <Bot className="w-4 h-4 text-amber-300" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 shadow-xs ${
                  isUser
                    ? 'bg-[#0B3B2C] text-white rounded-br-xs'
                    : 'bg-white border border-stone-200 text-stone-900 rounded-bl-xs'
                }`}
              >
                {/* Message Body */}
                <div className="whitespace-pre-line leading-relaxed text-xs sm:text-[13px]">
                  {m.text}
                </div>

                {/* Google Search Grounding Sources */}
                {m.sources && m.sources.length > 0 && (
                  <div className="pt-2 border-t border-stone-100 space-y-1">
                    <span className="text-[10px] font-bold text-amber-800 flex items-center gap-1">
                      <Search className="w-3 h-3 text-amber-600" />
                      Google Grounding Citations:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {m.sources.slice(0, 4).map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 hover:bg-amber-50 text-[10px] text-stone-700 hover:text-stone-900 border border-stone-200 transition-colors"
                        >
                          <span className="truncate max-w-[140px]">{src.title}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamp & Copy */}
                <div
                  className={`flex items-center justify-between text-[10px] pt-1 ${
                    isUser ? 'text-emerald-200/80' : 'text-stone-400'
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(m.text, m.id)}
                      className="hover:text-stone-700 transition-colors p-0.5"
                      title="Copy text"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-xl bg-stone-800 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 items-center">
            <div className="w-7 h-7 rounded-xl bg-[#0B3B2C] text-white flex items-center justify-center shrink-0 shadow-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
            </div>
            <div className="p-3 bg-white border border-stone-200 rounded-2xl text-xs text-stone-500 flex items-center gap-2">
              <span className="animate-pulse">Consulting Gemini 3.5 & Google Search Grounding...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-stone-100 bg-white flex flex-nowrap gap-1.5 overflow-x-auto text-[11px]">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-[#F0F5F2] hover:text-[#0B3B2C] text-stone-700 whitespace-nowrap transition-colors border border-stone-200 shrink-0 font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI or request a market report..."
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-[#0B3B2C] transition-colors"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-2.5 rounded-xl bg-[#0B3B2C] hover:bg-[#07241B] text-white transition-all disabled:opacity-40 shadow-sm shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};

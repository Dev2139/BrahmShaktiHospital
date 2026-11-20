import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  X,
  Send,
  PhoneCall,
  ChevronUp,
  Sparkles,
  Bot,
  User,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Droplets,
  ArrowRight,
  RefreshCw,
  Phone
} from 'lucide-react';

const BOT_KNOWLEDGE = [
  {
    keywords: ['appointment', 'book', 'consult', 'slot', 'schedule', 'doctor appointment'],
    reply: 'You can instantly schedule an outpatient consultation with our senior specialists. Would you like to select a doctor now?',
    actions: [
      { label: 'Book Appointment', link: '/consultation', primary: true },
      { label: 'View All Doctors', link: '/doctors' }
    ]
  },
  {
    keywords: ['doctor', 'specialist', 'surgeon', 'physician', 'faculty', 'who is', 'dr'],
    reply: 'Brahm Shakti Hospital has 20+ verified senior consultants including Dr. S.K. Goyal (Medicine), Dr. Nishant Verma & Dr. Rishabh Jain (Surgery), Dr. Manisha Jain & Dr. Renu Gupta (Gynaecology), and Dr. Kapil Goyal & Dr. Ravi Shankar Gupta (Orthopaedics).',
    actions: [
      { label: 'Explore Doctor Directory', link: '/doctors', primary: true },
      { label: 'Book Consultation', link: '/consultation' }
    ]
  },
  {
    keywords: ['emergency', 'casualty', 'ambulance', 'urgent', 'trauma', 'accident', 'serious'],
    reply: '🚨 Our 24x7 Casualty & Emergency Trauma Centre is always active with immediate triage, on-call surgeons, and mobile ICU ambulance.',
    actions: [
      { label: 'Call Casualty: 7840089703', href: 'tel:7840089703', primary: true, isCall: true }
    ]
  },
  {
    keywords: ['dialysis', 'kidney', 'renal', 'nephrology', 'hemodialysis'],
    reply: 'Our charitable Hemodialysis Center operates 24x7 at subsidized trust rates with ultra-pure RO water systems and dedicated hepatitis-negative/positive isolated stations.',
    actions: [
      { label: 'Dialysis Wing Details', link: '/departments/nephrology', primary: true },
      { label: 'Call Helpline: 7840089703', href: 'tel:7840089703', isCall: true }
    ]
  },
  {
    keywords: ['timing', 'hours', 'opd time', 'open', 'when to visit', 'schedule'],
    reply: 'Our OPD clinics operate Monday to Saturday from 09:00 AM to 05:00 PM. Emergency, ICU, Casualty, and Blood Bank are open 24x7 round the clock.',
    actions: [
      { label: 'Check OPD Timings', link: '/services/opd', primary: true }
    ]
  },
  {
    keywords: ['location', 'address', 'where', 'metro', 'reach', 'direction', 'budh vihar'],
    reply: 'Brahm Shakti Hospital is located at Pocket C, Budh Vihar Phase I, Pooth Khurd, New Delhi – 110086 (conveniently accessible from Udyog Nagar Metro Station).',
    actions: [
      { label: 'Get Directions & Contact', link: '/contact', primary: true }
    ]
  },
  {
    keywords: ['lab', 'report', 'blood test', 'diagnostic', 'test report', 'uhid'],
    reply: 'You can download and verify your pathology & radiology test reports online using your Patient UHID or Lab Bill Number.',
    actions: [
      { label: 'Check Lab Reports', link: '/lab-results', primary: true }
    ]
  },
  {
    keywords: ['insurance', 'tpa', 'cghs', 'echs', 'cashless', 'panel'],
    reply: 'We offer cashless hospitalization empaneled with CGHS, ECHS, DGEHS, and major TPAs including Star Health, Care, ICICI Lombard, and HDFC ERGO.',
    actions: [
      { label: 'Contact TPA Desk', link: '/contact', primary: true }
    ]
  },
  {
    keywords: ['fee', 'charges', 'cost', 'price', 'consultation fee', 'subsidized'],
    reply: 'As a philanthropic institution managed by Brahm Shakti Trust, OPD consultation fee is subsidized at just ₹700 across super-specialties.',
    actions: [
      { label: 'Book OPD Slot', link: '/consultation', primary: true }
    ]
  }
];

const QUICK_PROMPTS = [
  '📅 Book Doctor Appointment',
  '👨‍⚕️ Senior Specialists',
  '🚨 24x7 Emergency Contact',
  '🩸 Subsidized Dialysis',
  '🧪 Lab Reports & Tests',
  '📍 Hospital Address'
];

export const ChatbotFloatingWidget = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! Welcome to Brahm Shakti Hospital. How may I assist your medical journey today?',
      actions: [
        { label: 'Book Appointment', link: '/consultation', primary: true },
        { label: 'Find a Doctor', link: '/doctors' }
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Monitor scroll for Go-To-Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    // Add user message
    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    // Simulate smart medical reasoning
    setTimeout(() => {
      const qLower = query.toLowerCase();
      let matchedKnowledge = BOT_KNOWLEDGE.find((item) =>
        item.keywords.some((kw) => qLower.includes(kw))
      );

      let botReply = '';
      let botActions = [];

      if (matchedKnowledge) {
        botReply = matchedKnowledge.reply;
        botActions = matchedKnowledge.actions;
      } else {
        botReply =
          'Thank you for reaching out. For specific medical queries or doctor recommendations, you can consult our specialty desk or call our 24x7 hospital helpline.';
        botActions = [
          { label: 'Book Doctor Appointment', link: '/consultation', primary: true },
          { label: 'Emergency Hotline: 7840089703', href: 'tel:7840089703', isCall: true }
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botReply,
          actions: botActions
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleActionClick = (action) => {
    if (action.href) {
      window.location.href = action.href;
    } else if (action.link) {
      navigate(action.link);
      setIsOpen(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: 'Chat history reset. How can Brahm Shakti Hospital help you right now?',
        actions: [
          { label: 'Book Appointment', link: '/consultation', primary: true },
          { label: 'Find a Doctor', link: '/doctors' }
        ]
      }
    ]);
  };

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-50 flex flex-col items-center gap-3 pointer-events-none">
      
      {/* 1. GO TO TOP BUTTON - Round Circular Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          type="button"
          aria-label="Back to Top"
          title="Back to Top"
          className="pointer-events-auto w-12 h-12 rounded-full bg-white hover:bg-slate-50 text-[#0B2545] shadow-lg border border-slate-200 flex items-center justify-center transition-all duration-200 hover:-translate-y-1 active:scale-95 cursor-pointer"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* 2. DIRECT CALL HELPLINE BUTTON - Round Circular Button */}
      <a
        href="tel:7840089703"
        aria-label="Call 24x7 Helpline"
        title="Call 24x7 Helpline: 7840089703"
        className="pointer-events-auto relative w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
      >
        {/* Pulsing ring animation */}
        <span className="absolute -inset-1 rounded-full bg-rose-500 opacity-40 animate-ping pointer-events-none" />
        <Phone className="w-5 h-5 relative z-10" />
      </a>

      {/* 3. WORKING & ANIMATED CHATBOT BUTTON - Round Circular Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-label={isOpen ? "Close Assistant" : "Chat with BSH Assistant"}
        title={isOpen ? "Close Assistant" : "Chat with BSH Assistant"}
        className={`pointer-events-auto relative w-12 h-12 sm:w-13 sm:h-13 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer border ${
          isOpen
            ? 'bg-[#0B2545] text-white border-slate-700'
            : 'bg-gradient-to-tr from-[#0B2545] via-[#103b6e] to-[#006699] text-white border-white/20 hover:scale-110'
        }`}
      >
        {/* Subtle Animated Glow Effect */}
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full bg-sky-400 opacity-30 blur-xs animate-pulse pointer-events-none" />
        )}

        {isOpen ? (
          <X className="w-5 h-5 relative z-10" />
        ) : (
          <Bot className="w-5 h-5 relative z-10" />
        )}

        {/* Live Green Online Dot */}
        <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0B2545]" />
      </button>

      {/* 4. CHATBOT INTERACTIVE DIALOG WINDOW */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="pointer-events-auto fixed bottom-20 sm:bottom-24 right-3 sm:right-6 w-[94vw] sm:w-[400px] h-[550px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0B2545] via-[#123661] to-[#006699] p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
                <Bot className="w-5 h-5 text-sky-300" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0B2545]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">BSH Virtual Assistant</h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-sky-200">Brahm Shakti Hospital, Delhi</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Restart chat"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 scrollbar-thin scrollbar-thumb-slate-300">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-[#0B2545] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#0B2545] text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Contextual Action Buttons */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {msg.actions.map((act, actIdx) => (
                        <button
                          key={actIdx}
                          type="button"
                          onClick={() => handleActionClick(act)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            act.primary
                              ? 'bg-[#0B2545] hover:bg-[#123661] text-white shadow-2xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {act.isCall && <PhoneCall className="w-3 h-3 text-rose-400" />}
                          <span>{act.label}</span>
                          {!act.isCall && <ArrowRight className="w-3 h-3 opacity-70" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-9">
                <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-2 rounded-2xl shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-200" />
                  <span className="ml-1 text-[11px] text-slate-500 font-medium">Assistant typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          <div className="p-2.5 bg-white border-t border-slate-100 overflow-x-auto scrollbar-none flex items-center gap-1.5">
            {QUICK_PROMPTS.map((prompt, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => handleSendMessage(prompt.replace(/^[^\w\s]+/, '').trim())}
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about doctors, timings, fees, dialysis..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-[#0B2545] transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-9 h-9 rounded-xl bg-[#0B2545] hover:bg-[#123661] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotFloatingWidget;

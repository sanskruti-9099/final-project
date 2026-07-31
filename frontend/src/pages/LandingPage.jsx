import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HiOutlineAcademicCap, 
  HiOutlineChatBubbleLeftRight, 
  HiOutlineDocumentText, 
  HiOutlineQuestionMarkCircle, 
  HiOutlineSquare2Stack, 
  HiOutlineCalendar, 
  HiOutlineClock,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineBolt,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineRocketLaunch,
  HiOutlineChevronDown
} from 'react-icons/hi2';
import ThemeToggle from '../components/layout/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-primary-500/30 ${isDark ? 'bg-surface-950 text-surface-50' : 'bg-surface-50 text-surface-900'}`}>
      
      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled ? (isDark ? 'bg-surface-950/80 backdrop-blur-xl border-b border-surface-800 shadow-lg shadow-black/10' : 'bg-white/80 backdrop-blur-xl border-b border-surface-200 shadow-sm') : 'bg-transparent py-2'}`}>
        <div className="max-w-7xl w-full mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
              <HiOutlineAcademicCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">StudyAI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 font-medium">
            <button onClick={() => scrollToSection('features')} className="hover:text-primary-500 transition-colors">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-primary-500 transition-colors">How it Works</button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-primary-500 transition-colors">Testimonials</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-primary-500 transition-colors">FAQ</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link to="/dashboard" className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-lg shadow-primary-500/25 transition-all hover:scale-105 active:scale-95">
              Go to Dashboard
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2">
              {mobileMenuOpen ? <HiOutlineXMark className="w-6 h-6" /> : <HiOutlineBars3 className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden absolute top-full inset-x-0 border-b shadow-xl ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200'}`}>
            <div className="flex flex-col p-4 space-y-2">
              <button onClick={() => scrollToSection('features')} className="p-3 text-left rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 font-medium">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="p-3 text-left rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 font-medium">How it Works</button>
              <button onClick={() => scrollToSection('testimonials')} className="p-3 text-left rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 font-medium">Testimonials</button>
              <button onClick={() => scrollToSection('faq')} className="p-3 text-left rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 font-medium">FAQ</button>
              <Link to="/dashboard" className="mt-2 p-3 text-center rounded-xl bg-primary-600 text-white font-medium">
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section 
        className="relative overflow-hidden flex flex-col items-center justify-center text-center px-6 pb-20"
        style={{ marginTop: '64px', minHeight: 'calc(100vh - 64px)' }}
      >
        {/* Abstract Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-accent-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
        
        <div className="relative max-w-4xl mx-auto z-10 animate-fade-in" style={{ animationDuration: '1s' }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-200/50 dark:bg-surface-800/50 border border-surface-300 dark:border-surface-700 text-sm font-medium mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            StudyAI 2.0 is now live
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">Smarter</span> with AI
          </h1>
          <p className="text-xl sm:text-2xl text-surface-600 dark:text-surface-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Your AI-powered study companion for chatting, summarizing notes, generating quizzes, flashcards, and personalized study plans.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg shadow-xl shadow-primary-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
              <HiOutlineRocketLaunch className="w-6 h-6" />
              Get Started Free
            </Link>
            <button onClick={() => scrollToSection('features')} className={`w-full sm:w-auto px-8 py-4 rounded-2xl border font-bold text-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${isDark ? 'border-surface-700 bg-surface-800 hover:bg-surface-700 text-white' : 'border-surface-300 bg-white hover:bg-surface-100 text-surface-900 shadow-sm'}`}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ── Features Section ────────────────────────────────────────────── */}
      <section id="features" className={`py-24 ${isDark ? 'bg-surface-900/50' : 'bg-surface-100/50'} border-y ${isDark ? 'border-surface-800' : 'border-surface-200'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Everything you need to ace your exams</h2>
            <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">One powerful workspace replacing half a dozen disparate study apps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={HiOutlineChatBubbleLeftRight} title="AI Chat" desc="Ask any question and get instant, accurate explanations tailored to your level." />
            <FeatureCard icon={HiOutlineDocumentText} title="Notes Summarizer" desc="Paste lengthy text or upload PDFs to instantly generate concise, easy-to-read summaries." />
            <FeatureCard icon={HiOutlineQuestionMarkCircle} title="Quiz Generator" desc="Test your knowledge with auto-generated multiple choice and short answer quizzes." />
            <FeatureCard icon={HiOutlineSquare2Stack} title="Flashcards" desc="Automatically convert your notes into spaced-repetition flashcards for maximum retention." />
            <FeatureCard icon={HiOutlineCalendar} title="Study Planner" desc="Let AI build an optimized study schedule based on your exam dates and current proficiency." />
            <FeatureCard icon={HiOutlineClock} title="Study History" desc="Never lose track. All your chats, quizzes, and summaries are securely saved for review." />
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">How it works</h2>
            <p className="text-lg text-surface-600 dark:text-surface-400">Four simple steps to mastering your subjects.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary-500/0 via-primary-500 to-primary-500/0 -z-10" />
            
            <TimelineStep num="1" title="Ask AI" desc="Feed StudyAI your questions, syllabi, or notes." />
            <TimelineStep num="2" title="Generate Notes" desc="Instantly receive structured, formatted study guides." />
            <TimelineStep num="3" title="Practice Quiz" desc="Test your comprehension with dynamic quizzes." />
            <TimelineStep num="4" title="Master Subjects" desc="Review your stats and ace your exams." />
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ───────────────────────────────────────────────── */}
      <section className={`py-24 ${isDark ? 'bg-surface-900/50' : 'bg-surface-100/50'} border-y ${isDark ? 'border-surface-800' : 'border-surface-200'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">Built for modern students who want results.</h2>
              <p className="text-lg text-surface-600 dark:text-surface-400 mb-8 leading-relaxed">
                We've combined the world's most advanced AI models with proven learning methodologies to create the ultimate study companion.
              </p>
              <ul className="space-y-4">
                <ListItem icon={HiOutlineBolt} text="Lightning fast responses using Groq LPU technology." />
                <ListItem icon={HiOutlineSparkles} text="Highly accurate answers powered by state-of-the-art LLMs." />
                <ListItem icon={HiOutlineShieldCheck} text="Private and secure. Your data is yours alone." />
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 translate-y-8">
                <StatCard number="2M+" label="Students Assisted" />
                <StatCard number="50M+" label="Questions Answered" />
              </div>
              <div className="space-y-4">
                <StatCard number="15M+" label="Summaries Generated" />
                <StatCard number="99%" label="Satisfaction Rate" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Loved by students worldwide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Sarah J." 
              role="Medical Student" 
              text="StudyAI turned my 200-page pathology lectures into digestible summaries and flashcards in seconds. I literally couldn't survive med school without it."
            />
            <TestimonialCard 
              name="David M." 
              role="Computer Science Major" 
              text="The AI chat is incredible. It explains complex algorithms better than my professors. The study planner also keeps my chaotic schedule in check."
            />
            <TestimonialCard 
              name="Elena R." 
              role="High School Senior" 
              text="I used the quiz generator to prep for my AP History exam and got a 5. It identified my weak spots perfectly. This app is a game-changer!"
            />
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section id="faq" className={`py-24 ${isDark ? 'bg-surface-900/50' : 'bg-surface-100/50'} border-y ${isDark ? 'border-surface-800' : 'border-surface-200'}`}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            <FaqItem q="What is StudyAI?" a="StudyAI is an all-in-one educational platform that utilizes advanced AI to help you summarize notes, generate quizzes, create flashcards, and plan your study schedule." />
            <FaqItem q="Is it free to use?" a="Yes! StudyAI offers a robust free tier that gives you access to all core features. Premium plans are available for heavy users who need unlimited AI generations." />
            <FaqItem q="How does the AI work?" a="We use industry-leading Large Language Models (LLMs) accelerated by Groq, which parses your input context and generates highly accurate educational content instantaneously." />
            <FaqItem q="Can I save my history?" a="Absolutely. Once you create an account, all your chats, summaries, and generated quizzes are securely stored in your dashboard for future review." />
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-accent-600 opacity-10" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Ready to Study Smarter?</h2>
          <p className="text-xl text-surface-600 dark:text-surface-400 mb-10">Join thousands of students who have revolutionized their learning process.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-lg shadow-xl shadow-primary-500/30 transition-all hover:scale-105 active:scale-95">
              Start Studying Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className={`py-12 ${isDark ? 'bg-surface-950 border-t border-surface-800' : 'bg-white border-t border-surface-200'}`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500">
                <HiOutlineAcademicCap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">StudyAI</span>
            </Link>
            <p className="text-surface-500 max-w-sm">The intelligent study assistant designed to accelerate your learning, retention, and academic success.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-surface-500">
              <li><button onClick={() => scrollToSection('features')} className="hover:text-primary-500">Features</button></li>
              <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-primary-500">How it Works</button></li>
              <li><button onClick={() => scrollToSection('testimonials')} className="hover:text-primary-500">Testimonials</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-surface-500">
              <li><a href="#" className="hover:text-primary-500">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-500">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary-500">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-surface-200 dark:border-surface-800 text-center text-surface-500 text-sm">
          &copy; {new Date().getFullYear()} StudyAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// ── Helper Components ──────────────────────────────────────────────────────

function FeatureCard({ icon: Icon, title, desc }) {
  const { isDark } = useTheme();
  return (
    <div className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group
      ${isDark ? 'bg-surface-800/50 border-surface-700 hover:bg-surface-800 hover:border-primary-500/50 hover:shadow-primary-500/10' : 'bg-white border-surface-200 hover:border-primary-200 hover:shadow-primary-500/5'}
    `}>
      <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-surface-600 dark:text-surface-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function TimelineStep({ num, title, desc }) {
  const { isDark } = useTheme();
  return (
    <div className="flex flex-col items-center group">
      <div className="w-16 h-16 rounded-full bg-primary-500 text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-primary-500/25 group-hover:scale-110 transition-transform z-10">
        {num}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-surface-600 dark:text-surface-400">{desc}</p>
    </div>
  );
}

function ListItem({ icon: Icon, text }) {
  return (
    <li className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-medium">{text}</span>
    </li>
  );
}

function StatCard({ number, label }) {
  const { isDark } = useTheme();
  return (
    <div className={`p-6 rounded-3xl border text-center transition-transform hover:scale-105
      ${isDark ? 'bg-surface-800/80 border-surface-700' : 'bg-white border-surface-200 shadow-sm'}
    `}>
      <div className="text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary-500 to-accent-500 mb-2">{number}</div>
      <div className="text-sm font-medium text-surface-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function TestimonialCard({ name, role, text }) {
  const { isDark } = useTheme();
  return (
    <div className={`p-8 rounded-3xl border flex flex-col h-full
      ${isDark ? 'bg-surface-800/50 border-surface-700' : 'bg-white border-surface-200 shadow-sm'}
    `}>
      <div className="flex text-yellow-400 mb-6">
        {[1,2,3,4,5].map(i => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
      </div>
      <p className="text-lg text-surface-700 dark:text-surface-300 mb-8 italic flex-1">"{text}"</p>
      <div className="flex items-center gap-4 mt-auto">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-surface-900 dark:text-white">{name}</h4>
          <p className="text-sm text-surface-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }) {
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);
  
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-300
      ${isDark ? 'border-surface-700 bg-surface-800' : 'border-surface-200 bg-white'}
      ${open ? 'shadow-md shadow-black/5' : ''}
    `}>
      <button 
        className="w-full px-6 py-5 text-left flex items-center justify-between font-bold text-lg focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        {q}
        <HiOutlineChevronDown className={`w-5 h-5 transition-transform duration-300 ${open ? 'rotate-180 text-primary-500' : 'text-surface-400'}`} />
      </button>
      <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-surface-600 dark:text-surface-400 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

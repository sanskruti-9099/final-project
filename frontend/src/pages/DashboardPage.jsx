import React, { useState, useEffect, useContext } from 'react'
import { useTheme } from '../context/ThemeContext'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'

// Icons
import { 
  HiOutlineChatBubbleLeftRight, 
  HiOutlineDocumentText, 
  HiOutlineQuestionMarkCircle, 
  HiOutlineSquare2Stack, 
  HiOutlineCalendar, 
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineChartBar,
  HiOutlineBolt,
  HiOutlineLightBulb,
  HiOutlineArrowRight,
  HiOutlineExclamationCircle
} from 'react-icons/hi2'

// Components
import SectionHeader from '../components/dashboard/SectionHeader'
import FeatureCard from '../components/dashboard/FeatureCard'
import StatCard from '../components/dashboard/StatCard'
import ActivityCard from '../components/dashboard/ActivityCard'
import ProgressCard from '../components/dashboard/ProgressCard'
import QuickActionCard from '../components/dashboard/QuickActionCard'
import ErrorBanner from '../components/ui/ErrorBanner'

const TIPS = [
  "Break your study sessions into 25-minute intervals (Pomodoro technique) to maximize focus.",
  "Teaching a concept to someone else is the fastest way to identify gaps in your own knowledge.",
  "Review your notes within 24 hours of taking them to improve long-term retention by up to 80%.",
  "Stay hydrated! Even mild dehydration can impair cognitive function and concentration.",
  "Use active recall instead of passive reading to drastically improve your memory retrieval."
];

export default function DashboardPage() {
  const { isDark } = useTheme();
  const { user } = useContext(AuthContext);
  
  // Dashboard state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tip, setTip] = useState(TIPS[0]);

  // Fetch dashboard data & select random tip
  useEffect(() => {
    // Random tip
    const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];
    setTip(randomTip);

    // Fetch dashboard data
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        if (res.data && res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Get current date formatted
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Safe destructuring of data
  const stats = data?.statistics || {
    questions_asked: 0,
    summaries_created: 0,
    quizzes_generated: 0,
    flashcards_created: 0,
    study_plans_created: 0
  };

  const activities = data?.recent_activity || [];
  const goal = data?.today_goal || { completed: 0, total: 0, progress: 0 };

  return (
    <div className="flex-1 overflow-y-auto max-w-7xl w-full mx-auto flex flex-col gap-8 px-2 sm:px-4 py-2 pr-1">
      
      {error && <ErrorBanner error={error} />}

      {/* ── SECTION 1: Welcome Card ──────────────────────── */}
      <section className="animate-fade-in">
        <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-colors duration-300 ${isDark ? 'bg-surface-850 border border-surface-800' : 'bg-white border border-surface-200 shadow-sm'}`}>
          {/* Decorative glows */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-4">
                <HiOutlineSparkles className="w-4 h-4" />
                <span>{today}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-surface-900 dark:text-white mb-2">
                Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
              </h1>
              <p className="text-surface-500 dark:text-surface-300 max-w-xl text-lg">
                Your AI-powered study assistant is ready. Let's make today productive and learn something new.
              </p>
            </div>
            
            <button className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-lg shadow-primary-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer">
              Quick Start
              <HiOutlineArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Feature Cards ─────────────────────── */}
      <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <SectionHeader 
          title="Study Tools" 
          subtitle="Explore all available AI-powered learning features."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard 
            title="AI Chat" 
            description="Chat with your personal AI tutor to explain complex topics, debug code, or answer questions."
            icon={HiOutlineChatBubbleLeftRight}
            path="/chat"
            colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          />
          <FeatureCard 
            title="Notes Summarizer" 
            description="Paste long texts or upload notes and instantly receive a concise, structured summary."
            icon={HiOutlineDocumentText}
            path="/study"
            colorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
          />
          <FeatureCard 
            title="Quiz Generator" 
            description="Test your knowledge by generating multiple-choice quizzes from any topic or material."
            icon={HiOutlineQuestionMarkCircle}
            path="/quizzes"
            colorClass="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
          />
          <FeatureCard 
            title="Flashcards" 
            description="Create interactive flashcard decks to memorize key terms and concepts efficiently."
            icon={HiOutlineSquare2Stack}
            path="/flashcards"
            colorClass="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
          />
          <FeatureCard 
            title="Study Planner" 
            description="Generate a customized, step-by-step daily schedule for your upcoming exams."
            icon={HiOutlineCalendar}
            path="/planner"
            colorClass="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
          />
          <FeatureCard 
            title="History" 
            description="Review your past study sessions, generated summaries, and chat transcripts."
            icon={HiOutlineClock}
            path="/history"
            colorClass="bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300"
          />
        </div>
      </section>

      {/* ── SECTION 3: Study Statistics ──────────────────── */}
      <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <SectionHeader 
          title="Your Progress" 
          icon={HiOutlineChartBar}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatCard title="Questions Asked" value={stats.questions_asked} icon={HiOutlineChatBubbleLeftRight} colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" />
          <StatCard title="Summaries" value={stats.summaries_created} icon={HiOutlineDocumentText} colorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" />
          <StatCard title="Quizzes Taken" value={stats.quizzes_generated} icon={HiOutlineQuestionMarkCircle} colorClass="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" />
          <StatCard title="Flashcards" value={stats.flashcards_created} icon={HiOutlineSquare2Stack} colorClass="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" />
          <StatCard title="Plans Made" value={stats.study_plans_created} icon={HiOutlineCalendar} colorClass="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
        
        {/* ── SECTION 4 & 5: Activity & Goal ─────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-surface-850 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-sm p-6 sm:p-8 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50 flex items-center gap-2">
                <HiOutlineClock className="text-primary-500 w-6 h-6" />
                Recent Activity
              </h2>
              <button className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline cursor-pointer">
                View All
              </button>
            </div>
            
            <div className="relative space-y-0 pl-3">
              {/* Vertical line connecting timeline nodes */}
              <div className="absolute top-4 bottom-4 left-6 border-l-2 border-surface-100 dark:border-surface-800 pointer-events-none"></div>
              
              {loading ? (
                <div className="text-center py-8 text-surface-500 flex flex-col items-center">
                  <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  Loading history...
                </div>
              ) : activities.length > 0 ? (
                activities.map((item, index) => (
                  <ActivityCard key={`${item.feature}-${item.id}`} activity={item} isLast={index === activities.length - 1} />
                ))
              ) : (
                <div className="text-center py-8 flex flex-col items-center justify-center text-surface-500 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-xl">
                  <HiOutlineExclamationCircle className="w-10 h-10 mb-2 text-surface-400" />
                  <p>No recent activity found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6 flex flex-col">
          {/* SECTION 5: Goal */}
          <div className="flex-1">
            <ProgressCard title="Today's Goal" completed={goal.completed} total={goal.total} />
          </div>

          {/* SECTION 7: Tips Card */}
          <div className="bg-gradient-to-br from-accent-500/10 to-primary-500/10 border border-primary-100 dark:border-primary-900/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-primary-700 dark:text-primary-400 font-semibold">
              <HiOutlineLightBulb className="w-5 h-5" />
              Study Tip
            </div>
            <p className="text-surface-700 dark:text-surface-300 text-sm leading-relaxed">
              {tip}
            </p>
          </div>
        </div>

      </div>

      {/* ── SECTION 6: Quick Actions ─────────────────────── */}
      <section className="animate-fade-in" style={{ animationDelay: '400ms' }}>
        <SectionHeader 
          title="Quick Actions" 
          icon={HiOutlineBolt}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
          <QuickActionCard title="Ask AI" icon={HiOutlineChatBubbleLeftRight} path="/chat" colorClass="bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300" />
          <QuickActionCard title="Summarize" icon={HiOutlineDocumentText} path="/study" colorClass="bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300" />
          <QuickActionCard title="Gen Quiz" icon={HiOutlineQuestionMarkCircle} path="/quizzes" colorClass="bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300" />
          <QuickActionCard title="Flashcards" icon={HiOutlineSquare2Stack} path="/flashcards" colorClass="bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300" />
          <QuickActionCard title="Plan Study" icon={HiOutlineCalendar} path="/planner" colorClass="bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300" />
        </div>
      </section>

    </div>
  )
}

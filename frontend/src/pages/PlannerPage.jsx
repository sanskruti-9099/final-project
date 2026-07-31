import React, { useState } from 'react';
import { FaCalendarDays, FaSpinner, FaCheck, FaBookOpen } from 'react-icons/fa6';
import api from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import ErrorBanner from '../components/ui/ErrorBanner';

export default function PlannerPage() {
  const [subjectsStr, setSubjectsStr] = useState('');
  const [examDate, setExamDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState([]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!subjectsStr.trim() || !examDate) {
      setError('Please provide at least one subject and an exam date.');
      return;
    }

    const subjects = subjectsStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (subjects.length === 0) {
      setError('Please provide valid subjects.');
      return;
    }

    setLoading(true);
    setError('');
    setPlan([]);

    try {
      const response = await api.post('/planner', { subjects, exam_date: examDate });
      if (response.data && response.data.success) {
        setPlan(response.data.plan);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate study plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col max-w-5xl w-full mx-auto px-2 sm:px-4 py-4 sm:py-6">
      
      {/* Header */}
      <PageHeader 
        title="Study Planner"
        description="Enter your subjects and target exam date. AI will generate a structured daily study schedule for you."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="bg-white dark:bg-surface-850 rounded-3xl shadow-sm border border-surface-200 dark:border-surface-800/50 p-6 sm:p-8 sticky top-6">
            <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-100 mb-6 flex items-center gap-3">
              <FaCalendarDays className="text-primary-500" />
              Plan Settings
            </h2>
            
            <form onSubmit={handleGenerate} className="flex flex-col gap-6">
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Subjects
                </label>
                <input
                  type="text"
                  value={subjectsStr}
                  onChange={(e) => setSubjectsStr(e.target.value)}
                  placeholder="e.g. Physics, Math, History"
                  className="w-full px-4 py-2.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-surface-800 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500 transition-all duration-200"
                />
                <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">Separate subjects with commas.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Exam Date
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-surface-800 dark:text-surface-100 transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !subjectsStr.trim() || !examDate}
                className="mt-4 flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <FaCalendarDays />
                    Generate Plan
                  </>
                )}
              </button>

            </form>

            <ErrorBanner error={error} />
          </div>
        </div>

        {/* Right Column: Results Grid */}
        <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {plan.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.map((dayPlan, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-surface-850 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-5 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-surface-100 dark:border-surface-700">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                      <FaBookOpen />
                    </div>
                    <h3 className="font-semibold text-surface-900 dark:text-surface-100 text-lg">
                      {dayPlan.date}
                    </h3>
                  </div>
                  
                  <ul className="space-y-3">
                    {dayPlan.tasks.map((task, tIndex) => (
                      <li key={tIndex} className="flex items-start gap-2 text-surface-700 dark:text-surface-300">
                        <FaCheck className="text-green-500 mt-1 shrink-0" />
                        <span className="text-sm leading-relaxed">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-surface-50/50 dark:bg-surface-850/20 rounded-3xl border-2 border-dashed border-surface-200 dark:border-surface-700/50">
              <div className="w-20 h-20 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <FaCalendarDays size={32} className="text-surface-400 dark:text-surface-500" />
              </div>
              <h3 className="text-xl font-semibold text-surface-800 dark:text-surface-200 mb-2">No plan generated yet</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm leading-relaxed">
                Fill out the form on the left with your subjects and target exam date, and we'll create a step-by-step daily study schedule for you!
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

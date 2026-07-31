import React, { useState } from 'react';
import api from '../services/api';
import ErrorBanner from '../components/ui/ErrorBanner';

export default function QuizzesPage() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  
  // State for active quiz
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    
    setLoading(true);
    setError('');
    setQuestions([]);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);

    try {
      const response = await api.post('/quiz', { topic });
      if (response.data && response.data.success) {
        setQuestions(response.data.questions);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionIndex, option) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };

  const handleSubmitQuiz = () => {
    // Check if all questions are answered
    if (Object.keys(selectedAnswers).length < questions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }
    
    setError('');
    let currentScore = 0;
    
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        currentScore += 1;
      }
    });
    
    setScore(currentScore);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setTopic('');
    setQuestions([]);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setError('');
  };

  return (
    <div className="relative flex-1 bg-[#0b141c] overflow-y-auto overflow-x-hidden min-h-screen">
      
      {/* Background stays persistent in all states */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="w-full h-full opacity-20" preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100">
          <defs>
            <radialGradient cx="50%" cy="50%" fx="50%" fy="50%" id="grad1" r="50%">
              <stop offset="0%" style={{ stopColor: '#b0c6ff', stopOpacity: 0.2 }}></stop>
              <stop offset="100%" style={{ stopColor: 'transparent', stopOpacity: 0 }}></stop>
            </radialGradient>
          </defs>
          <circle cx="20" cy="30" fill="url(#grad1)" r="30">
            <animate attributeName="cx" dur="20s" repeatCount="indefinite" values="20;80;20"></animate>
            <animate attributeName="cy" dur="25s" repeatCount="indefinite" values="30;70;30"></animate>
          </circle>
          <circle cx="80" cy="80" fill="url(#grad1)" r="25">
            <animate attributeName="cx" dur="18s" repeatCount="indefinite" values="80;10;80"></animate>
            <animate attributeName="cy" dur="22s" repeatCount="indefinite" values="80;20;80"></animate>
          </circle>
        </svg>
      </div>

      <div className="relative z-10 w-full px-[24px]">
        {/* Setup State */}
        {questions.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] space-y-[32px]">
            {/* Branding/Icon Section */}
            <div className="flex flex-col items-center gap-[16px] animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-20 h-20 rounded-3xl bg-[#222b33] shadow-xl flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#b0c6ff]/10 group-hover:bg-[#b0c6ff]/20 transition-colors"></div>
                <span className="material-symbols-outlined text-[40px] text-[#b0c6ff] transition-transform group-hover:scale-110 duration-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                  psychology
                </span>
              </div>
              <div className="text-center space-y-[8px] max-w-[280px]">
                <h2 className="text-[32px] leading-[40px] tracking-[-0.02em] font-bold text-[#dae3ee]">Quiz Generator</h2>
                <p className="text-[16px] leading-[24px] font-normal text-[#c2c6d6]">
                  Enter any topic and AI will instantly generate a 5-question multiple-choice quiz.
                </p>
              </div>
            </div>
            
            {/* Interactive Form Section */}
            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
              <form onSubmit={handleGenerate} className="flex flex-col gap-6 w-full">
                <div className="relative group w-full">
                  <label className="absolute -top-3 left-4 px-2 bg-[#0b141c] text-xs font-medium text-[#b0c6ff] tracking-widest z-10" htmlFor="quiz-topic">Topic</label>
                  <div className="relative flex items-center w-full">
                    <input 
                      id="quiz-topic"
                      className={`w-full h-16 px-6 bg-[#141c24] text-[#dae3ee] text-lg rounded-2xl ring-1 ring-[#424654] focus:ring-2 focus:ring-[#b0c6ff] focus:bg-[#182028] transition-all outline-none placeholder:text-[#8c909f]/50 ${shake ? 'animate-[shake_0.2s_ease-in-out_0s_2]' : ''}`}
                      placeholder="e.g., Photosynthesis, Python Basics..." 
                      type="text"
                      value={topic}
                      onChange={(e) => {
                        setTopic(e.target.value);
                        setError('');
                      }}
                    />
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="group relative w-full h-16 bg-[#b0c6ff] text-[#002d6e] text-xl font-semibold rounded-2xl shadow-lg shadow-[#b0c6ff]/20 flex items-center justify-center gap-2 overflow-hidden active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">play_arrow</span>
                      <span>Start Quiz</span>
                    </>
                  )}
                </button>
              </form>
              
              <ErrorBanner error={error} />
              
              {/* Suggested Chips */}
              <div className="flex flex-wrap justify-center gap-2 pt-6">
                {['World War II', 'Human Biology', 'Space Exploration'].map((suggestion) => (
                  <button 
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setTopic(suggestion);
                      setError('');
                    }}
                    className="px-4 py-2 rounded-full bg-[#182028] text-xs font-medium tracking-widest text-[#c2c6d6] ring-1 ring-[#424654] hover:bg-[#548dff] hover:text-[#002760] transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Fun Stats/Social Proof (Moment of Delight) */}
            <div className="flex items-center gap-[24px] pt-[24px] opacity-60 animate-in fade-in duration-1000 delay-500">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#2d363e] ring-2 ring-[#0b141c] flex items-center justify-center overflow-hidden">
                  <img className="w-full h-full object-cover" alt="Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjiYZC-vR87N3msVUP58PZnqk-xjgGWlA6h0K-rGhT_mlji2fH3N0ZDFXFL1gD2ftUkA1GyCwWpXgKPMraL3a_iFsuUQRuqHbw3mpLpoVR_zCTvO35yqQ8FsFyW9gnoIWabRONDxOnfCLociuGhwZ61a9ORkMEKfmTVFYmBXkef9kX43WVXG6T6Z7N0s7rFzivqEuLqbB9gO-hg35szmLBY99y-lBGct_1CqgEs9LaqQiwgQfo1nKPXA"/>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#2d363e] ring-2 ring-[#0b141c] flex items-center justify-center overflow-hidden">
                  <img className="w-full h-full object-cover" alt="Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDDPOdR3AmUVgeSXM18IwydEnhs8zyXyXix2rCH_GEcS0DOItz1c1KSrMZnB5R8lBmbosAYygFqJSr9BY-42Ckr31SlWwfbj-qE-9uqdkr9dnDCR-vh5Fs4zTfRg-9ZRw7rx_WjHhGgxorEdeKoULqFSxs2Q6tAnV4oon6tm0dqe02DnDyJHzzJFHyPLCZ8v59SrResnqQGtMzckuXw-G_7TDfpa0hAkm9pn7EOPDS19y5MdHN4Q1Omg"/>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#2d363e] ring-2 ring-[#0b141c] flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-[#548dff] flex items-center justify-center text-[10px] font-bold text-[#002760]">12k</div>
                </div>
              </div>
              <p className="text-[12px] leading-[16px] tracking-[0.05em] font-medium text-[#c2c6d6]">Quizzes taken today</p>
            </div>
          </div>
        )}

        {/* Active Quiz / Result State */}
        {questions.length > 0 && (
          <div className="flex flex-col gap-[24px] pb-[80px] animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-2xl mx-auto pt-[40px]">
            
            {/* Header with Topic */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[24px] leading-[32px] tracking-[-0.01em] font-bold text-[#dae3ee]">
                {topic} Quiz
              </h2>
              <button onClick={handleReset} className="text-[#8c909f] hover:text-[#dae3ee] transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Result Banner */}
            {isSubmitted && (
              <div className={`p-[24px] rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-[16px] animate-in fade-in slide-in-from-top-4 ${
                score === questions.length ? 'bg-[#182028] ring-1 ring-green-500/50 shadow-[0_0_40px_rgba(34,197,94,0.1)]' 
                : score > questions.length / 2 ? 'bg-[#182028] ring-1 ring-yellow-500/50 shadow-[0_0_40px_rgba(234,179,8,0.1)]'
                : 'bg-[#182028] ring-1 ring-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.1)]'
              }`}>
                <div>
                  <h2 className="text-[24px] leading-[32px] font-bold text-[#dae3ee]">
                    You scored {score} out of {questions.length}!
                  </h2>
                  <p className="text-[16px] leading-[24px] text-[#c2c6d6] mt-[4px]">
                    {score === questions.length ? 'Perfect score! You are an expert.' 
                    : score > questions.length / 2 ? 'Great job! You have a solid understanding.'
                    : 'Keep studying! You can always try again.'}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-[8px] px-[20px] py-[12px] bg-[#222b33] text-[#dae3ee] ring-1 ring-[#424654] rounded-2xl hover:bg-[#2d363e] hover:ring-[#8c909f] font-medium transition-all whitespace-nowrap shadow-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">refresh</span>
                  Try Another Topic
                </button>
              </div>
            )}
            
            {/* Questions List */}
            <div className="space-y-[24px]">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="bg-[#141c24] rounded-3xl shadow-sm ring-1 ring-[#222b33] p-[24px]">
                  <h3 className="text-[18px] leading-[28px] font-semibold text-[#dae3ee] mb-[20px]">
                    <span className="text-[#b0c6ff] mr-[8px]">Q{qIndex + 1}.</span>
                    {q.question}
                  </h3>
                  
                  <div className="flex flex-col gap-[12px]">
                    {q.options.map((option, oIndex) => {
                      const isSelected = selectedAnswers[qIndex] === option;
                      const isCorrectAnswer = q.answer === option;
                      
                      let optionStyles = "ring-1 ring-[#424654] hover:ring-[#b0c6ff] hover:bg-[#b0c6ff]/10";
                      let textStyles = "text-[#c2c6d6]";
                      
                      if (isSubmitted) {
                        if (isCorrectAnswer) {
                          optionStyles = "bg-green-500/10 ring-1 ring-green-500";
                          textStyles = "text-green-400 font-medium";
                        } else if (isSelected && !isCorrectAnswer) {
                          optionStyles = "bg-red-500/10 ring-1 ring-red-500";
                          textStyles = "text-red-400 font-medium";
                        } else {
                          optionStyles = "ring-1 ring-[#424654] opacity-50";
                        }
                      } else if (isSelected) {
                        optionStyles = "bg-[#b0c6ff]/10 ring-1 ring-[#b0c6ff]";
                        textStyles = "text-[#b0c6ff] font-medium";
                      }

                      return (
                        <button
                          key={oIndex}
                          disabled={isSubmitted}
                          onClick={() => handleOptionSelect(qIndex, option)}
                          className={`flex items-center justify-between p-[16px] rounded-2xl text-left transition-all ${optionStyles} ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <span className={textStyles}>{option}</span>
                          
                          {isSubmitted && isCorrectAnswer && (
                            <span className="material-symbols-outlined text-green-400 flex-shrink-0 ml-[8px]">check_circle</span>
                          )}
                          {isSubmitted && isSelected && !isCorrectAnswer && (
                            <span className="material-symbols-outlined text-red-400 flex-shrink-0 ml-[8px]">cancel</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Error & Submit Button */}
            {!isSubmitted && (
              <div className="flex flex-col items-center gap-[16px] mt-[16px]">
                <ErrorBanner error={error} />
                
                <button
                  onClick={handleSubmitQuiz}
                  className="px-[32px] py-[16px] bg-[#b0c6ff] hover:bg-white text-[#002d6e] text-[20px] font-semibold rounded-full transition-all shadow-[0_0_30px_rgba(176,198,255,0.3)] hover:shadow-[0_0_40px_rgba(176,198,255,0.5)] w-full md:w-auto min-w-[240px] flex items-center justify-center gap-[8px]"
                >
                  <span className="material-symbols-outlined">done_all</span>
                  Submit Quiz
                </button>
              </div>
            )}
            
          </div>
        )}
      </div>

      <style jsx="true">{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}

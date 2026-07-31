import React, { useState } from 'react';
import { FaPlay, FaSpinner, FaChevronLeft, FaChevronRight, FaRotateRight, FaHandPointer } from 'react-icons/fa6';
import api from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import ErrorBanner from '../components/ui/ErrorBanner';

export default function FlashcardsPage() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for active flashcard deck
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (topic.trim().length < 2) {
      setError('Topic must be at least 2 characters long.');
      return;
    }
    
    setLoading(true);
    setError('');
    setCards([]);
    setCurrentIndex(0);
    setIsFlipped(false);

    try {
      const response = await api.post('/flashcards', { topic });
      if (response.data && response.data.success) {
        setCards(response.data.cards);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate flashcards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      // Small timeout to allow un-flip animation before changing content
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
      }, 150);
    }
  };

  const handleReset = () => {
    setTopic('');
    setCards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setError('');
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col max-w-4xl w-full mx-auto px-2 sm:px-4 py-4 sm:py-6">
      
      {/* Header */}
      <PageHeader 
        title="Flashcards"
        description="Enter any topic and AI will generate 10 flashcards to help you study and memorize key concepts."
      />

      {/* Setup State */}
      {cards.length === 0 && (
        <div className="bg-white dark:bg-surface-850 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="E.g., French Revolution, Machine Learning, Periodic Table..."
              className="flex-1 px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 transition-all duration-200"
            />
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm min-w-[200px]"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Generating Deck...
                </>
              ) : (
                <>
                  <FaPlay />
                  Generate Flashcards
                </>
              )}
            </button>
          </form>
          
          <ErrorBanner error={error} />
        </div>
      )}

      {/* Active Study State */}
      {cards.length > 0 && (
        <div className="flex flex-col items-center flex-1 min-h-[400px]">
          
          {/* Progress Banner */}
          <div className="w-full flex justify-between items-center mb-6 px-2 animate-fade-in">
            <span className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              Card {currentIndex + 1} of {cards.length}
            </span>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
            >
              <FaRotateRight />
              Try Another Topic
            </button>
          </div>

          {/* Flashcard Container (3D Scene) */}
          <div 
            className="relative w-full max-w-2xl aspect-[3/2] sm:aspect-[2/1] perspective-1000 cursor-pointer group animate-fade-in" style={{ animationDelay: '100ms' }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Inner Card (handles rotation) */}
            <div 
              className={`absolute inset-0 w-full h-full transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
            >
              {/* Front Side */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-white dark:bg-surface-850 rounded-3xl shadow-lg border border-surface-200 dark:border-surface-800 flex flex-col items-center justify-center p-8 sm:p-12 text-center group-hover:shadow-xl transition-shadow">
                <span className="absolute top-6 left-6 text-xs font-bold text-primary-500/50 uppercase tracking-widest">Front</span>
                <h2 className="text-2xl sm:text-4xl font-bold text-surface-900 dark:text-white leading-tight">
                  {cards[currentIndex].front}
                </h2>
                <div className="absolute bottom-6 flex items-center gap-2 text-surface-400 dark:text-surface-500 text-sm opacity-60">
                  <FaHandPointer />
                  <span>Click to flip</span>
                </div>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-primary-50 dark:bg-primary-900/20 rounded-3xl shadow-lg border border-primary-200 dark:border-primary-800 flex flex-col items-center justify-center p-8 sm:p-12 text-center">
                <span className="absolute top-6 left-6 text-xs font-bold text-primary-500/50 uppercase tracking-widest">Back</span>
                <p className="text-xl sm:text-2xl text-surface-800 dark:text-surface-200 leading-relaxed font-medium">
                  {cards[currentIndex].back}
                </p>
                <div className="absolute bottom-6 flex items-center gap-2 text-surface-400 dark:text-surface-500 text-sm opacity-60">
                  <FaHandPointer />
                  <span>Click to flip back</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-10 w-full max-w-2xl animate-fade-in" style={{ animationDelay: '200ms' }}>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 text-surface-800 dark:text-white font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <FaChevronLeft />
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 text-surface-800 dark:text-white font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              Next
              <FaChevronRight />
            </button>
          </div>

        </div>
      )}
      
    </div>
  );
}

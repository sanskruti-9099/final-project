import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';
import ErrorBanner from '../components/ui/ErrorBanner';

export default function StudyPage() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState(null); // { text: '', id: null }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (text.trim().length < 10) {
      setError('Please enter at least 10 characters to summarize.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSummary(null);

    try {
      const response = await api.post('/summary', { text });
      if (response.data && response.data.success) {
        setSummary({
          text: response.data.summary,
          id: response.data.id
        });
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (summary && summary.id) {
      window.open(`${import.meta.env.VITE_API_URL || ''}/api/v1/summary/${summary.id}/download`, '_blank');
    }
  };
  
  const handleCopy = () => {
    if (summary && summary.text) {
      navigator.clipboard.writeText(summary.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative flex-1 bg-[#0b141c] overflow-y-auto overflow-x-hidden min-h-screen pb-[100px]">
      
      {/* Background SVG matching the quiz page */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="w-full h-full opacity-20" preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100">
          <defs>
            <radialGradient cx="50%" cy="50%" fx="50%" fy="50%" id="grad1" r="50%">
              <stop offset="0%" style={{ stopColor: '#b0c6ff', stopOpacity: 0.15 }}></stop>
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

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-10 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <div className="flex flex-col gap-2 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[#dae3ee] tracking-tight">Notes Summarizer</h1>
          <p className="text-base md:text-lg text-[#c2c6d6]">Transform your messy lecture notes into structured, elegant summaries in seconds.</p>
        </div>
        
        {error && <ErrorBanner error={error} />}

        {/* Raw Notes Panel */}
        <div className="bg-[#141c24] rounded-[24px] shadow-sm ring-1 ring-[#222b33] p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-[#dae3ee] font-semibold text-lg">
            <span className="material-symbols-outlined text-[#b0c6ff]">subject</span>
            Raw Notes
          </div>
          
          <div className="relative bg-[#0b141c] rounded-2xl ring-1 ring-[#222b33] p-4 h-[280px]">
            <textarea 
              className="w-full h-full bg-transparent resize-none outline-none text-[#dae3ee] placeholder:text-[#424654] text-base leading-relaxed"
              placeholder="Paste your chaotic notes, transcriptions, or thoughts here..."
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError('');
              }}
              maxLength={5000}
            />
            <div className="absolute bottom-4 right-4 bg-[#222b33] px-3 py-1 rounded-full text-xs text-[#8c909f] font-medium tracking-wide">
              {text.length}/5000
            </div>
          </div>
        </div>
        
        {/* Generate Button */}
        <button 
          onClick={handleSummarize}
          disabled={loading}
          className="w-full h-[60px] bg-[#b0c6ff] hover:bg-white text-[#002d6e] text-lg font-semibold rounded-2xl transition-all shadow-[0_0_30px_rgba(176,198,255,0.1)] hover:shadow-[0_0_40px_rgba(176,198,255,0.25)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
              <span>Synthesizing...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">auto_awesome</span>
              <span>Generate Summary</span>
            </>
          )}
        </button>
        
        {/* Dots Separator */}
        <div className="flex justify-center text-[#424654] tracking-[0.3em] font-bold py-2">
          ...
        </div>
        
        {/* AI Summary Panel */}
        <div className="bg-[#141c24] rounded-[24px] shadow-sm ring-1 ring-[#222b33] p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between text-[#dae3ee] font-semibold text-lg">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#b0c6ff]">auto_awesome</span>
              AI Summary
            </div>
            
            {summary && (
              <div className="flex items-center gap-4 text-[#8c909f]">
                <button onClick={handleCopy} className="hover:text-[#dae3ee] transition-colors" title="Copy text">
                  <span className="material-symbols-outlined text-[20px]">{copied ? 'check' : 'content_copy'}</span>
                </button>
                <button onClick={handleDownload} className="hover:text-[#dae3ee] transition-colors" title="Share/Download">
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="relative bg-[#0b141c] rounded-2xl ring-1 ring-[#222b33] p-6 min-h-[200px]">
            {summary ? (
              <div className="prose prose-invert max-w-none text-base leading-relaxed prose-headings:text-[#dae3ee] prose-p:text-[#c2c6d6] prose-li:text-[#c2c6d6] prose-strong:text-[#dae3ee] prose-a:text-[#b0c6ff]">
                <ReactMarkdown>{summary.text}</ReactMarkdown>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <span className="material-symbols-outlined text-[#424654] text-5xl mb-4 opacity-50">document_scanner</span>
                <p className="text-[#8c909f] text-sm max-w-xs">
                  Your AI-generated summary will appear here. Paste your notes above to begin.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

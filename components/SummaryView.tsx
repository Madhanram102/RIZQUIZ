import React, { useState } from 'react';
import { ContentSummary } from '../types';
import { BookOpen, Sparkles, ChevronRight, X, Check, BrainCircuit } from 'lucide-react';

interface SummaryViewProps {
  summary: ContentSummary;
  onStartQuiz: () => void;
  onCancel: () => void;
}

const SummaryView: React.FC<SummaryViewProps> = ({ summary, onStartQuiz, onCancel }) => {
  const [expandedConceptIdx, setExpandedConceptIdx] = useState<number | null>(0);

  const toggleConcept = (idx: number) => {
    setExpandedConceptIdx(expandedConceptIdx === idx ? null : idx);
  };

  return (
    <div className="flex flex-col bg-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white p-8 sm:p-10 relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-12 -translate-y-12 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -translate-x-6 translate-y-6 blur-xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-indigo-200 font-bold uppercase tracking-wider text-xs mb-3">
            <BookOpen size={14} className="text-indigo-300" />
            <span>Study Guide & Content Summary</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-2 drop-shadow-sm">
            {summary.title || "Resource Briefing"}
          </h1>
          <p className="text-indigo-100 text-sm max-w-2xl font-medium opacity-90">
            Review these key insights and core concepts to prepare for the assessment.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8 sm:p-10 space-y-8">
        
        {/* Overview Section */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center space-x-2">
            <Sparkles size={14} className="text-indigo-500" />
            <span>High-Level Overview</span>
          </h2>
          <p className="text-slate-700 text-lg leading-relaxed font-semibold">
            {summary.overview}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {/* Key Takeaways Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center space-x-2">
              <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
              <span>Key Takeaways</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {summary.keyTakeaways.map((takeaway, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start p-5 bg-indigo-50/30 border border-indigo-100/50 rounded-2xl group hover:bg-indigo-50/50 transition-all duration-300"
                >
                  <div className="mt-0.5 mr-3 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-100">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {takeaway}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Core Concepts Accordion */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center space-x-2">
              <span className="w-1.5 h-4 bg-violet-600 rounded-full"></span>
              <span>Core Concepts Explained</span>
            </h3>
            
            <div className="space-y-3">
              {summary.coreConcepts.map((item, idx) => {
                const isExpanded = expandedConceptIdx === idx;
                return (
                  <div 
                    key={idx} 
                    className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                      isExpanded 
                        ? 'border-indigo-200 bg-indigo-50/10 shadow-md shadow-indigo-100/30' 
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <button
                      onClick={() => toggleConcept(idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-xl transition-colors ${
                          isExpanded ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-400'
                        }`}>
                          <BrainCircuit size={18} />
                        </div>
                        <span className={`text-base sm:text-lg tracking-tight ${
                          isExpanded ? 'text-indigo-900 font-extrabold' : 'text-slate-800'
                        }`}>
                          {item.concept}
                        </span>
                      </div>
                      <ChevronRight 
                        size={18} 
                        className={`text-slate-400 transition-transform duration-300 ${
                          isExpanded ? 'rotate-90 text-indigo-600' : ''
                        }`} 
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100/50 bg-white/50 animate-in fade-in slide-in-from-top-2 duration-300">
                        <p className="font-medium">{item.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-4">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl font-bold transition-all"
          >
            <X size={18} />
            <span>Cancel Study Session</span>
          </button>

          <button
            onClick={onStartQuiz}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 px-10 py-4.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all group"
          >
            <span>Begin Practice Quiz</span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryView;

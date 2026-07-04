
import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { X, ChevronRight } from 'lucide-react';

interface QuizDisplayProps {
  question: QuizQuestion;
  index: number;
  total: number;
  onSelect: (key: string) => void;
  onCancel: () => void;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({ question, index, total, onSelect, onCancel }) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const progress = ((index + 1) / total) * 100;

  // Reset selection when question changes
  useEffect(() => {
    setSelectedKey(null);
  }, [index]);

  const handleNext = () => {
    if (selectedKey) {
      onSelect(selectedKey);
    }
  };

  return (
    <div className="p-8 sm:p-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1 mr-4">
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <span className="text-sm font-bold text-slate-400">
          {index + 1} / {total}
        </span>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 leading-tight">
          {question.question}
        </h2>
      </div>

      <div className="space-y-4">
        {(Object.entries(question.options) as [string, string][]).map(([key, text]) => (
          <button
            key={key}
            onClick={() => setSelectedKey(key)}
            className={`group w-full flex items-center text-left p-6 rounded-2xl border-2 transition-all ${
              selectedKey === key 
                ? 'border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100' 
                : 'border-slate-100 hover:border-indigo-400 hover:bg-indigo-50/50'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center mr-4 transition-colors ${
              selectedKey === key 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
            }`}>
              {key}
            </div>
            <span className={`flex-1 text-lg font-medium transition-colors ${
              selectedKey === key ? 'text-indigo-900' : 'text-slate-700'
            }`}>{text}</span>
          </button>
        ))}
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 pt-8 border-t border-slate-100">
        <button
          onClick={onCancel}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 text-slate-400 font-bold hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
        >
          <X size={18} />
          <span>Cancel Quiz</span>
        </button>

        {selectedKey && (
          <button
            onClick={handleNext}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-10 py-3.5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-2"
          >
            <span>{index + 1 === total ? 'Finish Quiz' : 'Next Question'}</span>
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizDisplay;

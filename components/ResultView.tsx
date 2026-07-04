
import React, { useEffect, useState } from 'react';
import { QuizQuestion, ContentSummary } from '../types';
import { CheckCircle2, XCircle, RefreshCcw, BookOpen, Trophy, Star, Target, TrendingUp, Brain, RotateCcw, ExternalLink, Sparkles, Check, BrainCircuit } from 'lucide-react';

interface ResultViewProps {
  questions: QuizQuestion[];
  userAnswers: string[];
  score: number;
  onRestart: () => void;
  onRetake: () => void;
  summary?: ContentSummary;
}

const Confetti = () => {
  const [pieces, setPieces] = useState<{ id: number; left: number; color: string; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    const colors = ['#f43f5e', '#8b5cf6', '#0ea5e9', '#f59e0b', '#10b981', '#ec4899'];
    const newPieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
      size: 8 + Math.random() * 12,
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-[-20px] rounded-sm opacity-80 animate-fall"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size / 1.5}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

const ResultView: React.FC<ResultViewProps> = ({ questions, userAnswers, score, onRestart, onRetake, summary }) => {
  const [activeTab, setActiveTab] = useState<'performance' | 'study-guide'>('performance');
  const total = questions.length;
  const wrong = total - score;
  const percentage = (score / total) * 100;
  const isPassed = percentage >= 50;
  
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const correctOffset = circumference - (score / total) * circumference;

  const getFeedback = () => {
    if (percentage >= 80) {
      return {
        title: "Absolute Legend!",
        subtitle: "Stellar performance! You've completely mastered this assessment. Your analytical skills are truly top-tier.",
        bgClass: "bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-orange-500",
        icon: <Trophy className="w-12 h-12 text-yellow-300" />,
        advice: "You're ready for any top-tier interview. Keep this momentum going!",
        showConfetti: true,
        summary: "Excellent work! Your preparation is clearly showing results."
      };
    } else if (percentage >= 50) {
      return {
        title: "Just Passed!",
        subtitle: "Good effort! You've captured the core conceptual depth, but there's still room to sharpen your edge.",
        bgClass: "bg-gradient-to-br from-violet-600 to-purple-800",
        icon: <Star className="w-12 h-12 text-indigo-200" />,
        advice: "Focus on the specific explanations below to bridge the gaps in your understanding. Consistent study will lead to mastery.",
        showConfetti: false,
        summary: "You have a solid foundation. Keep pushing!"
      };
    } else {
      return {
        title: "Needs Improvement",
        subtitle: "This was a challenging assessment. To succeed in competitive exams, you'll need a deeper dive into these topics.",
        bgClass: "bg-gradient-to-br from-rose-600 to-red-800",
        icon: <Brain className="w-12 h-12 text-white/80" />,
        advice: "Don't be discouraged! Improve your study habits by reviewing the source material and the detailed explanations provided below.",
        showConfetti: false,
        summary: "Failure is just a stepping stone. Analyze your mistakes and try again."
      };
    }
  };

  const feedback = getFeedback();

  return (
    <div className="flex flex-col">
      {/* Hero Score Section */}
      <div className={`p-10 sm:p-16 text-center text-white relative overflow-hidden transition-colors duration-1000 ${feedback.bgClass}`}>
        {feedback.showConfetti && <Confetti />}
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-8 flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
            {/* Pie Chart Visualization */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-white/20"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={correctOffset}
                  strokeLinecap="round"
                  className={`${percentage >= 80 ? 'text-yellow-300' : percentage >= 50 ? 'text-emerald-400' : 'text-white'} transition-all duration-1000 ease-out`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black">{Math.round(percentage)}%</span>
              </div>
            </div>

            <div className="text-left">
              <div className="flex items-center space-x-2 text-white/70 mb-1">
                <Target size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Assessment Result</span>
              </div>
              <div className="text-6xl font-black tracking-tighter">
                {score}<span className="text-white/50 text-3xl font-medium">/{total}</span>
              </div>
              <div className="mt-2 flex space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span className="text-xs font-bold">{score} Correct</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                  <span className="text-xs font-bold">{wrong} Wrong</span>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-black mb-3 tracking-tight drop-shadow-md">{feedback.title}</h2>
          <p className="text-white/90 text-lg max-w-md mx-auto leading-relaxed mb-4">
            {feedback.subtitle}
          </p>
          
          <div className="p-4 bg-black/10 backdrop-blur-md rounded-2xl border border-white/10 max-w-sm mb-6">
            <p className="text-sm font-bold text-white mb-1">Feedback:</p>
            <p className="text-sm font-medium italic opacity-90">
              "{feedback.advice}"
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {!isPassed && (
              <button
                onClick={onRetake}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-xl shadow-emerald-900/20 hover:scale-105 active:scale-95 transition-all group"
              >
                <RotateCcw size={20} className="group-hover:-rotate-90 transition-transform duration-300" />
                <span>Retake Same Quiz</span>
              </button>
            )}

            <button
              onClick={onRestart}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all group"
            >
              <RefreshCcw size={20} className="text-indigo-500 group-hover:rotate-180 transition-transform duration-500" />
              <span>Try Another Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Review Section */}
      {summary && (
        <div className="flex bg-slate-100 border-t border-b border-slate-200/60 p-1.5">
          <div className="flex space-x-1 w-full max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('performance')}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'performance'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Target size={16} />
              <span>Performance Analysis</span>
            </button>
            <button
              onClick={() => setActiveTab('study-guide')}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'study-guide'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen size={16} />
              <span>Study Guide & Summary</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'performance' ? (
        <div className="p-8 sm:p-12 bg-white">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center">
              <span className="w-2 h-8 bg-indigo-600 rounded-full mr-3"></span>
              Performance Analysis
            </h3>
            <div className="px-4 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2">
              <ShieldCheck size={12} className="text-indigo-500" />
              <span>Expert Review</span>
            </div>
          </div>
          
          <div className="space-y-16">
            {questions.map((q, idx) => {
              const isCorrect = userAnswers[idx] === q.correct_answer;
              return (
                <div key={idx} className="group relative">
                  <div className="flex items-start mb-6">
                    <div className={`mt-1 mr-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-black shadow-md ${isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                      {idx + 1}
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 leading-snug">
                      {q.question}
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {(Object.entries(q.options) as [string, string][]).map(([key, text]) => {
                      const isUserChoice = userAnswers[idx] === key;
                      const isCorrectChoice = q.correct_answer === key;
                      
                      let containerStyles = 'bg-slate-50 border-slate-200 text-slate-600';
                      let labelStyles = 'bg-slate-200 text-slate-500';
                      let badge = null;
                      
                      if (isCorrectChoice) {
                        containerStyles = 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-1 ring-emerald-500/20';
                        labelStyles = 'bg-emerald-500 text-white';
                        badge = <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center"><CheckCircle2 size={10} className="mr-1"/> Correct</span>;
                      } else if (isUserChoice && !isCorrect) {
                        containerStyles = 'bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-500/20';
                        labelStyles = 'bg-rose-500 text-white';
                        badge = <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-rose-600 flex items-center"><XCircle size={10} className="mr-1"/> Your Choice</span>;
                      }

                      return (
                        <div 
                          key={key} 
                          className={`relative p-4 rounded-2xl border-2 transition-all flex items-center ${containerStyles}`}
                        >
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center mr-3 text-xs font-black shrink-0 ${labelStyles}`}>
                            {key}
                          </span>
                          <span className="font-medium text-sm leading-tight">{text}</span>
                          {badge}
                        </div>
                      );
                    })}
                  </div>

                  <div className="relative overflow-hidden p-6 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="p-1.5 bg-indigo-600 rounded-lg text-white shadow-sm shadow-indigo-200">
                         <BookOpen size={14} />
                      </div>
                      <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">
                        AI Professional Insight
                      </span>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium mb-4">
                      {q.explanation}
                    </p>
                    
                    {q.sources && q.sources.length > 0 && (
                      <div className="border-t border-slate-200 pt-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">References & Evidence</p>
                        <div className="flex flex-wrap gap-2">
                          {q.sources.map((src, sIdx) => (
                            <a 
                              key={sIdx} 
                              href={src.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                            >
                              <span>{src.title}</span>
                              <ExternalLink size={10} />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        summary && (
          <div className="p-8 sm:p-12 bg-white space-y-8 animate-in fade-in duration-300">
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
                    className="flex items-start p-5 bg-indigo-50/30 border border-indigo-100/50 rounded-2xl"
                  >
                    <div className="mt-0.5 mr-3 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center flex-shrink-0">
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
                {summary.coreConcepts.map((item, idx) => (
                  <div key={idx} className="border border-slate-100 bg-white rounded-2xl p-6 hover:border-indigo-100 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                        <BrainCircuit size={18} />
                      </div>
                      <h4 className="text-lg font-extrabold text-indigo-900">{item.concept}</h4>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium pl-11">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

const ShieldCheck = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default ResultView;

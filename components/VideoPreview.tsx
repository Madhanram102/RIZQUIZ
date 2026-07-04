
import React, { useState, useRef, useEffect } from 'react';
import { Play, CheckCircle2, Lock, Sparkles, ArrowLeft } from 'lucide-react';

interface VideoPreviewProps {
  file: File;
  onGenerate: (file: File) => void;
  onCancel: () => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ file, onGenerate, onCancel }) => {
  const [hasEnded, setHasEnded] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleEnded = () => {
    setHasEnded(true);
  };

  return (
    <div className="p-8 sm:p-12 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onCancel}
          className="flex items-center space-x-2 text-slate-400 hover:text-indigo-600 transition-colors font-bold text-sm"
        >
          <ArrowLeft size={16} />
          <span>Change Video</span>
        </button>
        <div className="flex items-center space-x-2 px-4 py-1.5 bg-indigo-50 rounded-full">
          {hasEnded ? (
            <CheckCircle2 size={14} className="text-emerald-500" />
          ) : (
            <Lock size={14} className="text-indigo-400" />
          )}
          <span className={`text-[10px] font-black uppercase tracking-widest ${hasEnded ? 'text-emerald-600' : 'text-indigo-600'}`}>
            {hasEnded ? 'Preparation Complete' : 'Watch Fully to Unlock'}
          </span>
        </div>
      </div>

      <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video mb-8 border-4 border-slate-100 ring-1 ring-slate-900/5">
        <video 
          ref={videoRef}
          src={videoUrl}
          controls
          onEnded={handleEnded}
          className="w-full h-full"
        />
        {!hasEnded && (
          <div className="absolute top-4 left-4 right-4 pointer-events-none">
             <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center space-x-3 max-w-xs animate-in slide-in-from-top-4">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                <span className="text-white text-[10px] font-bold uppercase tracking-tight">Requirement: Study the full material</span>
             </div>
          </div>
        )}
      </div>

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
        <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center">
          <Play size={18} className="mr-2 text-indigo-600 fill-indigo-600" />
          Analyze Source Content
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed">
          To ensure the AI generates high-accuracy competitive questions, the system requires a full data ingestion. Please watch the content to completion to activate the evaluation engine.
        </p>
      </div>

      <button
        disabled={!hasEnded}
        onClick={() => onGenerate(file)}
        className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center space-x-3 transition-all duration-500 ${
          hasEnded 
          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98]' 
          : 'bg-slate-200 text-slate-400 cursor-not-allowed grayscale'
        }`}
      >
        <Sparkles size={22} className={hasEnded ? 'animate-pulse' : ''} />
        <span>Generate Professional Quiz</span>
      </button>
      
      {!hasEnded && (
        <p className="text-center mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse">
          Awaiting Completion...
        </p>
      )}
    </div>
  );
};

export default VideoPreview;

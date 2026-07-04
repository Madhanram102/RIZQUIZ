
import React, { useState } from 'react';
import { 
  generateQuizFromVideo, 
  generateQuizFromYoutube, 
  generateQuizFromImage, 
  generateQuizFromSearch,
  generateQuizFromPDF
} from './services/geminiService';
import { QuizQuestion, AppStatus, QuizState } from './types';
import MediaUploader from './components/VideoUploader';
import QuizDisplay from './components/QuizDisplay';
import ResultView from './components/ResultView';
import VideoPreview from './components/VideoPreview';
import Logo from './components/Logo';
import { Zap, Search, Eye, ShieldCheck, FileText, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>('idle');
  const [loadingMode, setLoadingMode] = useState<'video' | 'youtube' | 'eyetest' | 'pdf'>('video');
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [currentPdfSlot, setCurrentPdfSlot] = useState<number>(1);
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    score: 0,
    userAnswers: [],
    isFinished: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [pendingVideo, setPendingVideo] = useState<File | null>(null);

  const handleVideoSelect = (file: File) => {
    setError(null);
    setPendingVideo(file);
    setStatus('previewing');
  };

  const handlePdfSelect = async (file: File) => {
    setError(null);
    setLoadingMode('pdf');
    setStatus('uploading');
    
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        setPdfBase64(base64);
        setCurrentPdfSlot(1);
        setStatus('generating');
        try {
          const questions = await generateQuizFromPDF(base64, 1);
          startQuiz(questions);
        } catch (err: any) { handleError(err); }
      };
      reader.readAsDataURL(file);
    } catch (err: any) { handleError('PDF processing error.'); }
  };

  const handleNextPdfSlot = async () => {
    if (!pdfBase64) return;
    setError(null);
    setLoadingMode('pdf');
    setStatus('generating');
    const nextSlot = currentPdfSlot + 1;
    setCurrentPdfSlot(nextSlot);
    
    try {
      const questions = await generateQuizFromPDF(pdfBase64, nextSlot);
      startQuiz(questions);
    } catch (err: any) { handleError(err); }
  };

  const executeVideoGeneration = async (file: File) => {
    setLoadingMode('video');
    setStatus('uploading');
    
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        setStatus('generating');
        try {
          const questions = await generateQuizFromVideo(base64, file.type);
          startQuiz(questions);
        } catch (err: any) { handleError(err); }
      };
      reader.readAsDataURL(file);
    } catch (err: any) { handleError('File processing error.'); }
  };

  const handleYoutubeSelect = async (url: string) => {
    setError(null);
    setLoadingMode('youtube');
    setStatus('generating');
    try {
      const questions = await generateQuizFromYoutube(url);
      startQuiz(questions);
    } catch (err: any) { handleError(err); }
  };

  const handleImageSelect = async (file: File) => {
    setError(null);
    setLoadingMode('eyetest');
    setStatus('generating');
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        try {
          const questions = await generateQuizFromImage(base64, file.type);
          startQuiz(questions);
        } catch (err: any) { handleError(err); }
      };
      reader.readAsDataURL(file);
    } catch (err: any) { handleError('Image processing error.'); }
  };

  const handleSearchSelect = async (query: string) => {
    setError(null);
    setLoadingMode('eyetest');
    setStatus('generating');
    try {
      const questions = await generateQuizFromSearch(query);
      startQuiz(questions);
    } catch (err: any) { handleError(err); }
  };

  const startQuiz = (questions: QuizQuestion[]) => {
    setQuizState({
      questions,
      currentIndex: 0,
      score: 0,
      userAnswers: [],
      isFinished: false,
    });
    setStatus('quiz');
  };

  const handleError = (err: any) => {
    setError(err.message || 'An unexpected error occurred.');
    setStatus('idle');
  };

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = quizState.questions[quizState.currentIndex];
    const isCorrect = answer === currentQuestion.correct_answer;
    
    setQuizState(prev => {
      const nextIndex = prev.currentIndex + 1;
      const isFinished = nextIndex >= prev.questions.length;
      
      if (isFinished) setStatus('finished');

      return {
        ...prev,
        score: isCorrect ? prev.score + 1 : prev.score,
        userAnswers: [...prev.userAnswers, answer],
        currentIndex: nextIndex,
        isFinished: isFinished,
      };
    });
  };

  const restart = () => {
    setStatus('idle');
    setPendingVideo(null);
    setPdfBase64(null);
    setCurrentPdfSlot(1);
    setQuizState({
      questions: [],
      currentIndex: 0,
      score: 0,
      userAnswers: [],
      isFinished: false,
    });
    setError(null);
  };

  const handleRetake = () => {
    setQuizState(prev => ({
      ...prev,
      currentIndex: 0,
      score: 0,
      userAnswers: [],
      isFinished: false,
    }));
    setStatus('quiz');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-50">
      <header className="mb-10 text-center max-w-2xl">
        <Logo className="mb-6" />
        <div className="flex items-center justify-center space-x-2 text-indigo-600 font-bold mb-4">
          <ShieldCheck size={20} />
          <span className="uppercase tracking-widest text-xs">Competitive Examination Mode Active</span>
        </div>
        <p className="text-slate-500 text-lg mt-2 max-w-md mx-auto">
          Advanced AI analysis for high-level exam and interview preparation.
        </p>
      </header>

      <main className="w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl shadow-indigo-100/50 overflow-hidden border border-slate-100 ring-1 ring-slate-900/5">
        {status === 'idle' && (
          <MediaUploader 
            onVideoSelect={handleVideoSelect} 
            onYoutubeSelect={handleYoutubeSelect}
            onImageSelect={handleImageSelect}
            onSearchSelect={handleSearchSelect}
            onPdfSelect={handlePdfSelect}
            error={error} 
          />
        )}

        {status === 'previewing' && pendingVideo && (
          <VideoPreview 
            file={pendingVideo} 
            onGenerate={executeVideoGeneration}
            onCancel={restart}
          />
        )}

        {(status === 'uploading' || status === 'generating') && (
          <div className="p-16 flex flex-col items-center justify-center space-y-8 text-center">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {loadingMode === 'youtube' ? <Search className="w-10 h-10 text-rose-500 animate-pulse" /> : 
                 loadingMode === 'eyetest' ? <Eye className="w-10 h-10 text-emerald-500 animate-pulse" /> :
                 loadingMode === 'pdf' ? <FileText className="w-10 h-10 text-amber-500 animate-pulse" /> :
                 <Zap className="w-10 h-10 text-indigo-600 animate-pulse" />}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {status === 'uploading' ? 'Analyzing Resources...' : 
                 loadingMode === 'youtube' ? 'Browsing YouTube Insights...' :
                 loadingMode === 'eyetest' ? 'Reviewing Board Standards...' : 
                 loadingMode === 'pdf' ? `Synthesizing Document Slot #${currentPdfSlot}...` : 'Structuring Exam Questions...'}
              </h2>
              <p className="text-slate-500 mt-3 text-lg italic">
                {loadingMode === 'pdf' ? 'Extracting 10 specialized questions from this segment...' : 'Synthesizing competitive-level exam material...'}
              </p>
            </div>
          </div>
        )}

        {status === 'quiz' && (
          <div className="flex flex-col">
            {loadingMode === 'pdf' && (
               <div className="bg-amber-50 px-8 py-2 border-b border-amber-100 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center">
                    <FileText size={12} className="mr-1" /> PDF Assessment Slot
                  </span>
                  <span className="text-xs font-bold text-amber-700">Slot {currentPdfSlot}</span>
               </div>
            )}
            <QuizDisplay 
              question={quizState.questions[quizState.currentIndex]}
              index={quizState.currentIndex}
              total={quizState.questions.length}
              onSelect={handleAnswerSelect}
              onCancel={restart}
            />
          </div>
        )}

        {status === 'finished' && (
          <div className="flex flex-col">
            <ResultView 
              questions={quizState.questions} 
              userAnswers={quizState.userAnswers} 
              score={quizState.score}
              onRestart={restart}
              onRetake={handleRetake}
            />
            {loadingMode === 'pdf' && (
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-center">
                <button
                  onClick={handleNextPdfSlot}
                  className="flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl font-black shadow-xl shadow-amber-200 hover:scale-105 active:scale-95 transition-all group"
                >
                  <FileText size={20} />
                  <span>Start Next Slot (Slot {currentPdfSlot + 1})</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="mt-12 flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
           <span className="h-px w-8 bg-slate-200"></span>
           <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Competitive Exam Level</span>
           <span className="h-px w-8 bg-slate-200"></span>
        </div>
        <p className="text-slate-400 text-sm">
          Professional Assessment Engine Powered by Gemini
        </p>
      </footer>
    </div>
  );
};

export default App;

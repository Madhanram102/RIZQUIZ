
import React, { useRef, useState } from 'react';
import { Upload, FileVideo, AlertCircle, Youtube, Link as LinkIcon, Sparkles, Eye, Image as ImageIcon, Search, FileText } from 'lucide-react';

interface MediaUploaderProps {
  onVideoSelect: (file: File) => void;
  onYoutubeSelect: (url: string) => void;
  onImageSelect: (file: File) => void;
  onSearchSelect: (query: string) => void;
  onPdfSelect: (file: File) => void;
  error: string | null;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ 
  onVideoSelect, 
  onYoutubeSelect, 
  onImageSelect,
  onSearchSelect,
  onPdfSelect,
  error 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'youtube' | 'eyetest' | 'pdf'>('upload');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'image' | 'pdf') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'video' && file.type.startsWith('video/')) {
        onVideoSelect(file);
      } else if (type === 'image' && file.type.startsWith('image/')) {
        onImageSelect(file);
      } else if (type === 'pdf' && file.type === 'application/pdf') {
        onPdfSelect(file);
      }
    }
  };

  const handleYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) return;
    onYoutubeSelect(youtubeUrl);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onSearchSelect(searchQuery);
  };

  return (
    <div className="p-8 sm:p-12">
      {/* Tab Switcher */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-10 w-full overflow-x-auto">
        <div className="flex space-x-1 min-w-max mx-auto">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'upload' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileVideo size={18} />
            <span>Video</span>
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'pdf' 
                ? 'bg-white text-amber-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText size={18} />
            <span>PDF</span>
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'youtube' 
                ? 'bg-white text-rose-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Youtube size={18} />
            <span>YouTube</span>
          </button>
          <button
            onClick={() => setActiveTab('eyetest')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'eyetest' 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye size={18} />
            <span>Eye Test</span>
          </button>
        </div>
      </div>

      {activeTab === 'upload' && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-12 transition-all hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer"
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e, 'video')}
            accept="video/*"
            className="hidden"
          />
          <div className="mb-6 p-4 rounded-full bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
            <Upload size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Upload Video</h3>
          <p className="text-slate-500 text-center max-w-xs text-sm">
            MP4, WebM or MOV files.
          </p>
        </div>
      )}

      {activeTab === 'pdf' && (
        <div 
          onClick={() => pdfInputRef.current?.click()}
          className="group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-12 transition-all hover:border-amber-400 hover:bg-amber-50/30 cursor-pointer"
        >
          <input 
            type="file" 
            ref={pdfInputRef}
            onChange={(e) => handleFileChange(e, 'pdf')}
            accept="application/pdf"
            className="hidden"
          />
          <div className="mb-6 p-4 rounded-full bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Upload PDF</h3>
          <p className="text-slate-500 text-center max-w-xs text-sm">
            Generate high-level assessment from documents.
          </p>
        </div>
      )}

      {activeTab === 'youtube' && (
        <form onSubmit={handleYoutubeSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-rose-500 transition-colors">
              <LinkIcon size={20} />
            </div>
            <input
              type="url"
              placeholder="Paste YouTube URL here..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="block w-full pl-12 pr-4 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-rose-400 focus:bg-white text-slate-800 font-medium transition-all outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 py-5 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-2xl font-black shadow-xl shadow-rose-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles size={20} />
            <span>Generate YouTube Quiz</span>
          </button>
        </form>
      )}

      {activeTab === 'eyetest' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => imageInputRef.current?.click()}
              className="p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer text-center group"
            >
              <input 
                type="file" 
                ref={imageInputRef}
                onChange={(e) => handleFileChange(e, 'image')}
                accept="image/*"
                className="hidden"
              />
              <div className="mb-3 mx-auto w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon size={24} />
              </div>
              <span className="text-sm font-black text-slate-800">Upload Chart</span>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Local Image</p>
            </div>

            <div className="p-6 border-2 border-slate-100 bg-slate-50/50 rounded-2xl text-center flex flex-col justify-center">
               <div className="mb-3 mx-auto w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <Search size={24} />
              </div>
              <span className="text-sm font-black text-slate-800">Browse Search</span>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Google Search</p>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="e.g., Ishihara color test, Snellen Chart..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-24 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-emerald-400 outline-none text-slate-800 font-medium transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-4 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {error && (
        <div className="mt-8 flex items-start space-x-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600">
          <AlertCircle className="mt-0.5 flex-shrink-0" size={18} />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;

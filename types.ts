
export interface ContentSummary {
  title: string;
  overview: string;
  keyTakeaways: string[];
  coreConcepts: { concept: string; explanation: string }[];
}

export interface QuizQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  sources?: { uri: string; title: string }[];
}

export interface QuizState {
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  userAnswers: string[];
  isFinished: boolean;
  summary?: ContentSummary;
}

export type AppStatus = 'idle' | 'previewing' | 'uploading' | 'generating' | 'summary' | 'quiz' | 'finished';



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
}

export type AppStatus = 'idle' | 'previewing' | 'uploading' | 'generating' | 'quiz' | 'finished';

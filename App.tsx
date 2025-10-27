
import React, { useState, useCallback } from 'react';
import { Question, QuizState } from './types';
import FileUploadScreen from './components/FileUploadScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>(QuizState.IDLE);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [finalScore, setFinalScore] = useState<number>(0);

  const handleFileLoad = useCallback((loadedQuestions: Question[]) => {
    setQuestions(loadedQuestions);
    setQuizState(QuizState.ACTIVE);
  }, []);

  const handleQuizFinish = useCallback((score: number) => {
    setFinalScore(score);
    setQuizState(QuizState.FINISHED);
  }, []);

  const handleRestart = useCallback(() => {
    setQuestions([]);
    setFinalScore(0);
    setQuizState(QuizState.IDLE);
  }, []);

  const renderContent = () => {
    switch (quizState) {
      case QuizState.ACTIVE:
        return <QuizScreen questions={questions} onFinish={handleQuizFinish} />;
      case QuizState.FINISHED:
        return <ResultsScreen score={finalScore} totalQuestions={questions.length} onRestart={handleRestart} />;
      case QuizState.IDLE:
      default:
        return <FileUploadScreen onLoad={handleFileLoad} />;
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <div className="w-full max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;

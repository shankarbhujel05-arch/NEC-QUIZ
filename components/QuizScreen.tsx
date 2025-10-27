
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Question } from '../types';

interface QuizScreenProps {
  questions: Question[];
  onFinish: (score: number) => void;
}

const PER_QUESTION_TIME = 60; // 60 seconds per question

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
  const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  
  const totalQuizTime = useMemo(() => questions.length * PER_QUESTION_TIME, [questions.length]);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(PER_QUESTION_TIME);
  const [totalTimeLeft, setTotalTimeLeft] = useState(totalQuizTime);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestionIndex];

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onFinish(userAnswers.filter((ans, i) => ans === questions[i].answer).length);
    }
  }, [currentQuestionIndex, questions, userAnswers, onFinish]);

  useEffect(() => {
    setQuestionTimeLeft(PER_QUESTION_TIME);
    const questionTimer = setInterval(() => {
      setQuestionTimeLeft(prev => {
        if (prev <= 1) {
          handleNext();
          return PER_QUESTION_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(questionTimer);
  }, [currentQuestionIndex, handleNext]);

  useEffect(() => {
    const totalTimer = setInterval(() => {
      setTotalTimeLeft(prev => {
        if (prev <= 1) {
          onFinish(userAnswers.filter((ans, i) => ans === questions[i].answer).length);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(totalTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onFinish, userAnswers, questions]);

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (selectedAnswer !== null) return;
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const getOptionClasses = (optionIndex: number) => {
    if (selectedAnswer === null) {
      return 'bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600';
    }
    const isCorrect = optionIndex === currentQuestion.answer;
    const isSelected = optionIndex === selectedAnswer;

    if (isCorrect) {
      return 'bg-green-100 dark:bg-green-900/50 border-green-500 dark:border-green-600 text-green-800 dark:text-green-300 font-semibold';
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-100 dark:bg-red-900/50 border-red-500 dark:border-red-600 text-red-800 dark:text-red-300';
    }
    return 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-500';
  };

  return (
    <div className="container mx-auto flex flex-col lg:flex-row gap-6 h-[calc(100vh-2rem)] max-h-[900px]">
      {/* Quiz Panel */}
      <div className="lg:w-3/5 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-4 mb-6 flex-wrap gap-4">
          <div className="font-semibold text-indigo-600 dark:text-indigo-400">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="flex gap-4 text-sm">
            <span className="bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 px-3 py-1 rounded-full font-medium">Q Time: {formatTime(questionTimeLeft)}</span>
            <span className="bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 px-3 py-1 rounded-full font-medium">Total Time: {formatTime(totalTimeLeft)}</span>
          </div>
        </div>

        {/* Question */}
        <div className="flex-grow">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-slate-900 dark:text-white">{currentQuestion.text}</h2>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 text-base flex items-center gap-4 ${getOptionClasses(index)} ${selectedAnswer === null ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-sm"
                  style={{borderColor: 'currentColor', color: 'currentColor'}}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 rounded-lg font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next'}
          </button>
        </div>
      </div>

      {/* Note Panel */}
      <div className="lg:w-2/5 bg-blue-50 dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg flex flex-col">
        <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-4 border-b border-blue-200 dark:border-slate-700 pb-3">Note / Reference</h3>
        <div className="flex-grow overflow-y-auto text-slate-700 dark:text-slate-300">
          {selectedAnswer !== null ? (
            <div className="prose prose-blue dark:prose-invert whitespace-pre-line text-base leading-relaxed">
              {currentQuestion.note}
            </div>
          ) : (
            <div className="text-slate-500 dark:text-slate-400 h-full flex items-center justify-center text-center">
                Select an answer to reveal the note and explanation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;

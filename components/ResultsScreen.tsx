
import React from 'react';
import { AwardIcon } from './icons/AwardIcon';
import { RefreshCwIcon } from './icons/RefreshCwIcon';


interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, totalQuestions, onRestart }) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getFeedback = () => {
    if (percentage >= 90) return { message: "Outstanding!", color: "text-green-500" };
    if (percentage >= 75) return { message: "Excellent Work!", color: "text-blue-500" };
    if (percentage >= 50) return { message: "Good Effort!", color: "text-yellow-500" };
    return { message: "Keep Practicing!", color: "text-red-500" };
  };

  const feedback = getFeedback();

  return (
    <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-2xl mx-auto transition-all duration-300">
        <AwardIcon className={`w-24 h-24 mx-auto mb-4 ${feedback.color}`}/>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Quiz Completed!</h1>
        <p className={`text-2xl font-semibold mb-6 ${feedback.color}`}>{feedback.message}</p>

        <div className="my-8 p-6 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">Your Score</p>
            <p className="text-6xl font-bold text-slate-800 dark:text-white">
                {score} <span className="text-3xl font-medium text-slate-500 dark:text-slate-400">/ {totalQuestions}</span>
            </p>
             <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-4 mt-4 overflow-hidden">
                <div 
                    className="bg-indigo-600 h-4 rounded-full transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg mt-2">{percentage}%</p>
        </div>

        <button
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
            <RefreshCwIcon className="w-5 h-5"/>
            <span>Take Another Quiz</span>
        </button>
    </div>
  );
};

export default ResultsScreen;

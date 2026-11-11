'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Flame,
  Award,
  Zap,
  HelpCircle,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Quiz, QuizQuestion } from '@/types';
import { useStore } from '@/store/useStore';

interface QuizInterfaceProps {
  quiz: Quiz;
  onClose: () => void;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({ quiz, onClose }) => {
  const { completeLessonAndQuiz, setCurrentTab, user } = useStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answersState, setAnswersState] = useState<{
    [questionIndex: number]: { selected: number; isCorrect: boolean };
  }>({});

  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [floatingXp, setFloatingXp] = useState<number | null>(null);

  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered) return; // prevent changing after selecting

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    setSelectedOption(optionIndex);
    setIsAnswered(true);

    setAnswersState((prev) => ({
      ...prev,
      [currentIndex]: { selected: optionIndex, isCorrect },
    }));

    if (isCorrect) {
      setFloatingXp(currentQuestion.points);
      setTimeout(() => setFloatingXp(null), 1800);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Completed all questions
      const correctCount = Object.values(answersState).filter((a) => a.isCorrect).length;
      const earnedXP = correctCount * 25 + (correctCount === totalQuestions ? 25 : 0); // streak bonus
      completeLessonAndQuiz(quiz.lessonId, earnedXP);
      setShowSummaryModal(true);

      // Trigger Celebration Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e5a93c', '#fbbf24', '#10b981', '#ffffff'],
        });
      } catch (err) {
        // Safe fallback if canvas not available
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setAnswersState({});
    setShowSummaryModal(false);
  };

  const totalCorrect = Object.values(answersState).filter((a) => a.isCorrect).length;
  const accuracyPct = Math.round((totalCorrect / totalQuestions) * 100);
  const earnedXP = totalCorrect * 25 + (totalCorrect === totalQuestions ? 25 : 0);

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-[#141417] border border-amber-500/30 shadow-2xl space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
            CHECKPOINT QUIZ
          </span>
          <h3 className="text-lg font-black text-white mt-1.5">{quiz.title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-400">
            Question <span className="text-white">{currentIndex + 1}</span> of {totalQuestions}
          </span>
          <button
            onClick={onClose}
            className="text-xs text-zinc-500 hover:text-zinc-300 ml-3 underline"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h4 className="text-base sm:text-lg font-extrabold text-white leading-snug">
            {currentQuestion.question}
          </h4>

          {/* Floating XP Reward Badge */}
          {floatingXp && (
            <div className="animate-bounce shrink-0 px-3 py-1 rounded-full bg-amber-400 text-black text-xs font-black shadow-gold-glow flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+{floatingXp} XP!</span>
            </div>
          )}
        </div>

        {/* Multiple Choice Options List */}
        <div className="space-y-3 pt-2">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === currentQuestion.correctIndex;

            let buttonStyle = 'bg-[#1b1b22] border-white/10 hover:border-amber-400/40 text-zinc-200';

            if (isAnswered) {
              if (isCorrectOption) {
                // Immediate green visual feedback for correct
                buttonStyle =
                  'bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-emerald-glow font-bold';
              } else if (isSelected && !isCorrectOption) {
                // Immediate red visual feedback for incorrect
                buttonStyle =
                  'bg-rose-500/20 border-rose-500 text-rose-200 font-bold';
              } else {
                buttonStyle = 'bg-[#141418] border-white/5 text-zinc-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-2xl border text-sm transition-all flex items-center justify-between group ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      isAnswered && isCorrectOption
                        ? 'bg-emerald-500 text-black'
                        : isAnswered && isSelected && !isCorrectOption
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/5 text-zinc-400 group-hover:bg-amber-400/20 group-hover:text-amber-300'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-snug">{option}</span>
                </div>

                {/* State Icons */}
                {isAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                )}
                {isAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Immediate Educational Explanation Box */}
      {isAnswered && (
        <div
          className={`p-4 rounded-2xl border text-xs leading-relaxed animate-fade-in ${
            selectedOption === currentQuestion.correctIndex
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold mb-1">
            {selectedOption === currentQuestion.correctIndex ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Brilliant! That is correct.</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Nice try! Review the core concept:</span>
              </>
            )}
          </div>
          <p className="text-zinc-300">{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Footer Navigation */}
      {isAnswered && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleNextQuestion}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold text-sm hover:brightness-110 active:scale-95 transition-all shadow-gold-glow flex items-center gap-2"
          >
            <span>{currentIndex < totalQuestions - 1 ? 'Next Question' : 'View Results'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* End of Quiz Final Score Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-md bg-[#161619] border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mascot / Trophy Emblem */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 text-black font-black text-3xl shadow-gold-glow mb-4">
              <Trophy className="w-8 h-8 text-black" />
            </div>

            <h3 className="text-2xl font-black text-white">
              {accuracyPct >= 75 ? 'Module Mastered!' : 'Good Effort! Keep Stacking!'}
            </h3>
            <p className="text-xs text-zinc-400 mt-1 mb-6">
              You scored {totalCorrect} out of {totalQuestions} correct ({accuracyPct}% accuracy)
            </p>

            {/* Earned XP Big Box */}
            <div className="p-4 rounded-2xl bg-[#1f1e24] border border-amber-400/30 mb-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Base Quiz Rewards:</span>
                <span className="font-bold text-white">+{totalCorrect * 25} XP</span>
              </div>
              {totalCorrect === totalQuestions && (
                <div className="flex items-center justify-between text-xs text-amber-400">
                  <span className="flex items-center gap-1 font-bold">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" /> Perfect Score Bonus:
                  </span>
                  <span className="font-extrabold">+25 XP</span>
                </div>
              )}
              <div className="border-t border-white/10 pt-2 flex items-center justify-between">
                <span className="text-sm font-black text-white">Total Earned:</span>
                <span className="text-lg font-black text-amber-300">+{earnedXP} XP</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  onClose();
                  setCurrentTab('dashboard');
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold text-sm hover:brightness-110 active:scale-95 transition-all shadow-gold-glow"
              >
                Return to Dashboard
              </button>

              <button
                onClick={handleRestartQuiz}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

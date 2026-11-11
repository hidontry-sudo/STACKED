'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Play,
  CheckCircle2,
  Lock,
  ChevronRight,
  HelpCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { VideoPlayer } from './VideoPlayer';
import { QuizInterface } from './QuizInterface';

export const LessonsView: React.FC = () => {
  const { lessons, activeLessonId, setActiveLessonId } = useStore();
  const [activeMode, setActiveMode] = useState<'video' | 'quiz'>('video');

  const currentLesson = lessons.find((l) => l.id === activeLessonId) || lessons[0];

  return (
    <div className="space-y-8 pb-20 animate-fade-in max-w-5xl mx-auto">
      {/* Top Selector Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Curriculum & Learning Path
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Master the core mechanics of money with concise videos, chapter breakdowns, and AI-graded quizzes.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center p-1 rounded-2xl bg-[#141418] border border-white/10 text-xs font-bold">
          <button
            onClick={() => setActiveMode('video')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeMode === 'video'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Video & Chapters</span>
          </button>
          <button
            onClick={() => setActiveMode('quiz')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeMode === 'quiz'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Quiz</span>
          </button>
        </div>
      </div>

      {/* Duolingo-style "YOUR PATH" Roadmap (Screenshot 2 Match) */}
      <div className="p-6 rounded-3xl bg-[#151518] border border-white/[0.08] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
              YOUR PATH
            </span>
            <h3 className="text-base font-black text-white">
              Chapter 1: Money Fundamentals
            </h3>
          </div>
          <span className="text-xs font-bold text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full">
            {lessons.filter((l) => l.completed).length} of {lessons.length} Completed
          </span>
        </div>

        {/* Connected Node Path */}
        <div className="flex items-center justify-between overflow-x-auto py-4 px-2 gap-4">
          {lessons.map((lesson, idx) => {
            const isSelected = lesson.id === currentLesson.id;
            return (
              <div
                key={lesson.id}
                onClick={() => {
                  setActiveLessonId(lesson.id);
                  setActiveMode('video');
                }}
                className="flex flex-col items-center min-w-[130px] cursor-pointer group"
              >
                {/* Node Circle */}
                <div className="relative mb-2">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                      isSelected
                        ? 'bg-gradient-to-tr from-amber-500 to-amber-300 text-black scale-110 shadow-gold-glow ring-4 ring-amber-400/30'
                        : lesson.completed
                        ? 'bg-[#f4e2c7] text-zinc-900'
                        : 'bg-[#22222a] border border-white/10 text-zinc-400 hover:border-amber-400/50'
                    }`}
                  >
                    {lesson.completed ? (
                      <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                    ) : isSelected ? (
                      <Play className="w-6 h-6 fill-black ml-0.5" />
                    ) : (
                      <span className="font-extrabold text-sm">{idx + 1}</span>
                    )}
                  </div>
                  {lesson.completed && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#151518] flex items-center justify-center text-[9px] text-black font-black">
                      ✓
                    </span>
                  )}
                </div>

                {/* Node Label */}
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 group-hover:text-amber-400">
                  LESSON {idx + 1}
                </span>
                <span
                  className={`text-xs font-bold text-center line-clamp-1 mt-0.5 ${
                    isSelected ? 'text-amber-300' : 'text-zinc-300'
                  }`}
                >
                  {lesson.title.split(':')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area: Video or Quiz */}
      {activeMode === 'video' ? (
        <VideoPlayer
          lesson={currentLesson}
          onLaunchQuiz={() => setActiveMode('quiz')}
        />
      ) : (
        <QuizInterface
          quiz={currentLesson.quiz}
          onClose={() => setActiveMode('video')}
        />
      )}
    </div>
  );
};

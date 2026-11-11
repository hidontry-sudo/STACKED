'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Clock,
  Sparkles,
  ChevronRight,
  BookOpen,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { Lesson, Chapter } from '@/types';

interface VideoPlayerProps {
  lesson: Lesson;
  onLaunchQuiz: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ lesson, onLaunchQuiz }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // in seconds
  const [duration, setDuration] = useState(480); // 8 minutes = 480s
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Simulated video playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, playbackSpeed]);

  // Sync active chapter based on current time
  useEffect(() => {
    const chapters = lesson.chapters;
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (currentTime >= chapters[i].timeSeconds) {
        setActiveChapterIndex(i);
        break;
      }
    }
  }, [currentTime, lesson.chapters]);

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    setIsPlaying(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = (currentTime / duration) * 100;

  return (
    <div className="space-y-6">
      {/* Video Viewport Container */}
      <div className="relative rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl group">
        {/* Mock Video Canvas / Poster */}
        <div className="relative aspect-video w-full flex items-center justify-center bg-[#0d0d10] overflow-hidden">
          <img
            src={lesson.thumbnail}
            alt={lesson.title}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isPlaying ? 'opacity-30 blur-sm scale-105' : 'opacity-70'
            }`}
          />

          {/* Playing Simulation Animation Overlay */}
          {isPlaying && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center animate-pulse mb-3">
                <Play className="w-7 h-7 text-amber-300 fill-amber-300" />
              </div>
              <p className="text-xs uppercase tracking-widest text-amber-400 font-extrabold">
                NOW PLAYING CHAPTER {activeChapterIndex + 1}
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-white max-w-lg mt-1">
                {lesson.chapters[activeChapterIndex]?.title}
              </h3>
              <p className="text-xs text-zinc-300 max-w-md mt-2">
                {lesson.chapters[activeChapterIndex]?.summary}
              </p>
            </div>
          )}

          {!isPlaying && (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center shadow-gold-glow hover:scale-110 active:scale-95 transition-all z-20 group-hover:brightness-110"
              aria-label="Play Video"
            >
              <Play className="w-8 h-8 fill-black translate-x-0.5" />
            </button>
          )}

          {/* Chapter badge on top-left of video */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 border border-amber-400/30">
              {lesson.category}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-zinc-300">
              Ch {lesson.chapterNumber} · {lesson.duration}
            </span>
          </div>
        </div>

        {/* Video Player Controls Bar */}
        <div className="p-4 bg-[#141418] border-t border-white/10 space-y-2">
          {/* Scrub Bar */}
          <div className="relative group/scrub">
            <div className="w-full h-1.5 hover:h-2.5 rounded-full bg-zinc-800 cursor-pointer overflow-hidden transition-all">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={(e) => setCurrentTime(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>

          {/* Buttons row */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 text-white hover:text-amber-400 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
              </button>

              <button
                onClick={() => setCurrentTime((t) => Math.max(0, t - 10))}
                className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                title="Back 10 seconds"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentTime((t) => Math.min(duration, t + 10))}
                className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                title="Forward 10 seconds"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 text-zinc-400 hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="text-zinc-400 font-mono text-xs tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Speed Toggle */}
              <button
                onClick={() => setPlaybackSpeed((s) => (s === 1 ? 1.25 : s === 1.25 ? 1.5 : 1))}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-xs transition-colors"
              >
                {playbackSpeed}x
              </button>

              {/* Take Quiz Fast Action */}
              <button
                onClick={onLaunchQuiz}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-gold-glow transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Take Module Quiz (+{lesson.pointsReward} XP)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters & Timestamps Section */}
      <div className="p-6 rounded-3xl bg-[#141417] border border-white/[0.08] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white">Interactive Chapter Timestamps</h3>
          </div>
          <span className="text-xs text-zinc-400">Click any chapter to jump video playback</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lesson.chapters.map((chapter, idx) => {
            const isCurrent = activeChapterIndex === idx;
            return (
              <div
                key={chapter.id}
                onClick={() => handleSeek(chapter.timeSeconds)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isCurrent
                    ? 'bg-amber-400/10 border-amber-400/50 shadow-inner'
                    : 'bg-[#1b1b22] border-white/5 hover:border-white/20 hover:bg-[#202028]'
                }`}
              >
                <div
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-bold shrink-0 ${
                    isCurrent
                      ? 'bg-amber-400 text-black shadow-sm'
                      : 'bg-white/5 text-amber-300'
                  }`}
                >
                  {chapter.timeDisplay}
                </div>

                <div className="flex-1">
                  <h4
                    className={`text-xs font-bold ${
                      isCurrent ? 'text-amber-300' : 'text-zinc-200'
                    }`}
                  >
                    {chapter.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug line-clamp-2">
                    {chapter.summary}
                  </p>
                </div>

                {isCurrent && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse mt-1.5 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Takeaways Card */}
      <div className="p-6 rounded-3xl bg-[#141417] border border-white/[0.08] shadow-xl space-y-3">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Core Module Takeaways</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {lesson.keyTakeaways.map((takeaway, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-[#1b1b22] border border-white/5 text-xs text-zinc-300 flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{takeaway}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

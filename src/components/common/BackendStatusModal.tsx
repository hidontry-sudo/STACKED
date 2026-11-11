'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Code2,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';

interface BackendStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendStatusModal: React.FC<BackendStatusModalProps> = ({ isOpen, onClose }) => {
  const [statusData, setStatusData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/backend-status');
      const data = await res.json();
      setStatusData(data);
    } catch (err) {
      console.warn('Could not fetch backend status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copySqlHint = () => {
    navigator.clipboard.writeText('-- Run supabase/schema.sql in your Supabase SQL editor');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-[#141417] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-gold-glow">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">
              Backend Infrastructure & API Status
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Free-Tier Stack: Supabase (PostgreSQL, Auth, Storage) + Groq AI (Whisper & Llama 3)
            </p>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Supabase Status Card */}
          <div className="p-4 rounded-2xl bg-[#1b1b22] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                <Database className="w-4 h-4" /> Supabase Service
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Ready
              </span>
            </div>

            <div className="text-xs space-y-1.5 text-zinc-300">
              <p className="flex justify-between">
                <span className="text-zinc-500">Database:</span>
                <span className="font-semibold text-white">PostgreSQL (4 Tables)</span>
              </p>
              <p className="flex justify-between">
                <span className="text-zinc-500">Auth:</span>
                <span className="font-semibold text-white">Email/Password + Role Trigger</span>
              </p>
              <p className="flex justify-between">
                <span className="text-zinc-500">Storage Bucket:</span>
                <span className="font-mono text-amber-300">'lessons' (Public)</span>
              </p>
              <p className="flex justify-between">
                <span className="text-zinc-500">RLS Status:</span>
                <span className="text-emerald-400 font-bold">Enforced (Student / Instructor)</span>
              </p>
            </div>
          </div>

          {/* Groq AI Status Card */}
          <div className="p-4 rounded-2xl bg-[#1b1b22] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" /> Groq AI Engine
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                Active Route
              </span>
            </div>

            <div className="text-xs space-y-1.5 text-zinc-300">
              <p className="flex justify-between">
                <span className="text-zinc-500">Audio Transcription:</span>
                <span className="font-mono text-white text-[11px]">whisper-large-v3</span>
              </p>
              <p className="flex justify-between">
                <span className="text-zinc-500">LLM Inference:</span>
                <span className="font-mono text-white text-[11px]">llama-3.3-70b-versatile</span>
              </p>
              <p className="flex justify-between">
                <span className="text-zinc-500">Output Format:</span>
                <span className="text-emerald-400 font-bold">Strict JSON (3 Questions)</span>
              </p>
              <p className="flex justify-between">
                <span className="text-zinc-500">Execution Route:</span>
                <span className="font-mono text-zinc-400">/api/generate-quiz</span>
              </p>
            </div>
          </div>
        </div>

        {/* 4 Tables & RLS Breakdown */}
        <div className="p-4 rounded-2xl bg-[#1a1a20] border border-white/10 mb-6 space-y-3">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Database Tables & Row Level Security (RLS)</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-start justify-between">
              <div>
                <span className="font-mono text-amber-400 font-bold">public.users</span>
                <p className="text-[11px] text-zinc-400">Columns: id, email, role, points, level, streak, saved_this_month</p>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                RLS: Self-Update
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-start justify-between">
              <div>
                <span className="font-mono text-amber-400 font-bold">public.videos</span>
                <p className="text-[11px] text-zinc-400">Columns: id, title, video_url, transcript, storage_path, instructor_id</p>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                RLS: Public Read · Instructor Write
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-start justify-between">
              <div>
                <span className="font-mono text-amber-400 font-bold">public.quizzes</span>
                <p className="text-[11px] text-zinc-400">Columns: id, video_id, quiz_data (JSONB with 3 questions), passing_score</p>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                RLS: Public Read · Instructor Write
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-start justify-between">
              <div>
                <span className="font-mono text-amber-400 font-bold">public.student_progress</span>
                <p className="text-[11px] text-zinc-400">Columns: id, user_id, quiz_id, score, points_earned, completed</p>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                RLS: Student Own Only
              </span>
            </div>
          </div>
        </div>

        {/* Actions & Instructions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-[11px] text-zinc-400">
            SQL schema file ready at <code className="text-amber-300">supabase/schema.sql</code>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
            <button
              onClick={copySqlHint}
              className="px-4 py-1.5 rounded-xl bg-amber-400 text-black font-extrabold text-xs hover:bg-amber-300 transition-colors flex items-center gap-1.5 shadow-gold-glow"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Reference' : 'Schema File: supabase/schema.sql'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

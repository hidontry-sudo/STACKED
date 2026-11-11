'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Database } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const { login, demoLogin, showToast } = useStore();
  const [isLogin, setIsLogin] = useState(defaultMode === 'login');
  const [email, setEmail] = useState('alex.rivera@stacked.app');
  const [password, setPassword] = useState('Stacked@2026!');
  const [name, setName] = useState('Alex Rivera');
  const [confirmPassword, setConfirmPassword] = useState('Stacked@2026!');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Validation Regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && (hasNumber || hasSpecial);

  const passwordScore = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (passwordScore <= 2) return { text: 'Weak', color: 'bg-rose-500' };
    if (passwordScore <= 4) return { text: 'Good', color: 'bg-amber-400' };
    return { text: 'Strong', color: 'bg-emerald-500' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isEmailValid) {
      setError('Please provide a valid email address (e.g. name@domain.com)');
      return;
    }

    if (!isPasswordValid) {
      setError('Password must be at least 8 characters with uppercase, lowercase, and a number/symbol.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    let resolvedRole: 'student' | 'admin' = role;

    try {
      if (isSupabaseConfigured()) {
        if (!isLogin) {
          // Supabase Auth SignUp: Trigger automatically inserts into public.users with role
          const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                role,
                full_name: name,
              },
            },
          });

          if (authError) throw authError;

          showToast('Account created in Supabase! Welcome to STACKED.', 50, 'success');
        } else {
          // Supabase Auth SignIn
          const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (authError) throw authError;

          // Fetch user profile from public.users table to check role
          if (data?.user) {
            const { data: profile } = await supabase
              .from('users')
              .select('id, role, total_points, level')
              .eq('id', data.user.id)
              .single();

            if (profile?.role === 'admin' || profile?.role === 'student') {
              resolvedRole = profile.role;
              setRole(resolvedRole);
            }
          }

          showToast('Signed in via Supabase Auth!', 25, 'success');
        }
      }

      // Update client store state
      login(email, resolvedRole);
      onClose();
    } catch (err: any) {
      console.warn('Supabase auth notice:', err?.message);
      if (err?.message?.includes('FetchError') || err?.message?.includes('placeholder')) {
        login(email, role);
        onClose();
      } else {
        setError(err?.message || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = (demoRole: 'student' | 'admin') => {
    demoLogin(demoRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#141417] border border-amber-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-black font-black text-2xl shadow-gold-glow mb-3">
            S
          </div>
          <h2 className="text-2xl font-black text-white">
            {isLogin ? 'Sign In to STACKED' : 'Create Free Account'}
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-1 text-xs text-zinc-400">
            <Database className="w-3 h-3 text-emerald-400" />
            <span>Powered by Supabase Auth & PostgreSQL</span>
          </div>
        </div>

        {/* Toggle Login / Register */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#0c0c0e] border border-white/10 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              isLogin
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              !isLogin
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  required
                  className="w-full bg-[#1b1b22] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex justify-between">
              <span>Email Address</span>
              {email.length > 0 && (
                <span className={`text-[10px] ${isEmailValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isEmailValid ? 'Valid Email' : 'Invalid Format'}
                </span>
              )}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@domain.com"
                required
                className={`w-full bg-[#1b1b22] border rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                  email.length > 0
                    ? isEmailValid
                      ? 'border-emerald-500/50 focus:border-emerald-400'
                      : 'border-rose-500/50 focus:border-rose-400'
                    : 'border-white/10 focus:border-amber-400'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex justify-between">
              <span>Password</span>
              {password.length > 0 && (
                <span className="text-[10px] font-bold text-zinc-400">
                  Strength: {getStrengthLabel().text}
                </span>
              )}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className={`w-full bg-[#1b1b22] border rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                  password.length > 0
                    ? isPasswordValid
                      ? 'border-emerald-500/50'
                      : 'border-amber-500/50'
                    : 'border-white/10 focus:border-amber-400'
                }`}
              />
            </div>

            {/* Password Validation Checklist */}
            <div className="mt-2 space-y-1 p-2 rounded-xl bg-black/30 border border-white/5 text-[11px]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    hasMinLength ? 'text-emerald-400' : 'text-zinc-600'
                  }`}
                />
                <span className={hasMinLength ? 'text-zinc-200' : 'text-zinc-500'}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    hasUppercase && hasLowercase
                      ? 'text-emerald-400'
                      : 'text-zinc-600'
                  }`}
                />
                <span
                  className={
                    hasUppercase && hasLowercase ? 'text-zinc-200' : 'text-zinc-500'
                  }
                >
                  Uppercase & lowercase letters
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    hasNumber || hasSpecial
                      ? 'text-emerald-400'
                      : 'text-zinc-600'
                  }`}
                />
                <span
                  className={
                    hasNumber || hasSpecial ? 'text-zinc-200' : 'text-zinc-500'
                  }
                >
                  Number or symbol ($#@!)
                </span>
              </div>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Role (Auto-provisioned via Supabase Trigger)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    role === 'student'
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                      : 'border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  🎓 Student Learner
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    role === 'admin'
                      ? 'bg-emerald-400/20 border-emerald-400 text-emerald-300'
                      : 'border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  🛡️ Admin / Educator
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!isEmailValid || !isPasswordValid || isLoading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold text-sm hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-gold-glow flex items-center justify-center gap-2 mt-4"
          >
            <span>{isLoading ? 'Authenticating with Supabase...' : isLogin ? 'Sign In' : 'Create Free Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <p className="text-[11px] font-bold text-center text-zinc-500 uppercase tracking-wider mb-2.5">
            Instant Demo Logins (No DB Config Required)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemo('student')}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>👤 Alex (Student)</span>
            </button>
            <button
              onClick={() => handleDemo('admin')}
              className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-300 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>🛡️ Sarah (Admin)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

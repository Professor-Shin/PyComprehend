import React from 'react';
import { 
  X, 
  Instagram, 
  Github, 
  Mail, 
  Phone, 
  Heart, 
  GraduationCap, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface InstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructorModal: React.FC<InstructorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-3.5 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-600/20 rounded-full blur-3xl" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <span>Instructor & TA Credit</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h2>
              <p className="text-[11px] text-slate-400">Platform Developer & Content Creator</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Main Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5 relative z-10 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
          <div className="relative flex-shrink-0">
            <img
              src="/assets/instructor-profile.png"
              alt="TA Shin (Professor.Shin)"
              className="w-20 h-20 rounded-xl object-cover border-2 border-indigo-500/40 shadow-lg"
              onError={(e) => {
                // Fallback avatar if image loading fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-indigo-600 text-white font-mono text-[9px] font-bold shadow-md">
              TA
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-base font-bold text-slate-100">Siwakorn Shin Saiphaisri</h3>
              <span className="px-2 py-0.2 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-mono font-semibold">
                AKA: Professor.Shin
              </span>
            </div>

            <p className="text-[11px] text-indigo-300 font-medium">
              Computer Programming (ComProg 2301172 / 2301173) TA • Chulalongkorn University
            </p>

            <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
              "Hi everyone, I’m Shin. I’ve been a ComProg TA for 4–5 terms. I created this platform to help university students practice Python code comprehension, tracing, and logic prediction for midterm & final exams!"
            </p>
          </div>
        </div>

        {/* Contact Links Grid */}
        <div className="space-y-1.5 relative z-10">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Contact & Social Channels
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href="https://instagram.com/siwak_.65"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-pink-500/40 hover:bg-pink-950/10 text-slate-300 hover:text-pink-300 transition-all group"
            >
              <div className="w-7 h-7 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center flex-shrink-0">
                <Instagram className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-slate-400 block">Instagram</span>
                <span className="text-xs font-mono font-semibold truncate block">siwak_.65</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-pink-400 flex-shrink-0" />
            </a>

            <a
              href="https://github.com/Professor-Shin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-indigo-500/40 hover:bg-indigo-950/10 text-slate-300 hover:text-indigo-300 transition-all group"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                <Github className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-slate-400 block">GitHub</span>
                <span className="text-xs font-mono font-semibold truncate block">github.com/Professor-Shin</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 flex-shrink-0" />
            </a>

            <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-slate-300">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-slate-400 block">Email</span>
                <span className="text-xs font-mono font-semibold truncate block">siwakorn7448@gmail.com</span>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-slate-300">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-slate-400 block">Phone</span>
                <span className="text-xs font-mono font-semibold truncate block">+66 98-881-9281</span>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Donation Section */}
        <div className="relative z-10 bg-slate-950/80 border border-amber-500/30 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-center gap-3.5">
          <img
            src="/assets/donation-qr.png"
            alt="Donation PromptPay QR Code"
            className="w-20 h-28 object-contain rounded-xl border border-slate-700 bg-white p-1 shadow-md flex-shrink-0"
          />
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-amber-400 font-bold text-xs">
              <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Support Platform & Class Treats</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Any optional support or donations will go directly toward system hosting server costs and funding treats to hand out during ComProg review sessions!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-1 flex justify-end relative z-10">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

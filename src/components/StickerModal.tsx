import React, { useRef, useEffect } from 'react';
import { X, Award, Star, Lock } from 'lucide-react';
import { sounds } from '../services/audio';

export interface Sticker {
  id: string;
  title: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  color: string;
}

interface StickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stickers: Record<string, boolean>;
  totalStars: number;
}

const ALL_STICKERS: Omit<Sticker, 'unlocked'>[] = [
  {
    id: 'first_move',
    title: 'First Step',
    emoji: '👣',
    description: 'Made your first chess move!',
    color: 'from-amber-400 to-orange-400',
  },
  {
    id: 'math_5',
    title: 'Math Wizard',
    emoji: '🧮',
    description: 'Solved 5 math puzzles correctly!',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    id: 'words_5',
    title: 'Word Champion',
    emoji: '📖',
    description: 'Solved 5 word & reading puzzles!',
    color: 'from-purple-400 to-pink-500',
  },
  {
    id: 'chess_5',
    title: 'Chess Scholar',
    emoji: '🎓',
    description: 'Answered 5 chess academy questions!',
    color: 'from-emerald-400 to-green-500',
  },
  {
    id: 'bot_win',
    title: 'Champion',
    emoji: '🏆',
    description: 'Won a game against a computer bot!',
    color: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'pip_friend',
    title: 'Puppy Pal',
    emoji: '🐶',
    description: 'Played a match with Pip the Puppy!',
    color: 'from-orange-300 to-amber-400',
  },
  {
    id: 'gizmo_pal',
    title: 'Robo Buddy',
    emoji: '🤖',
    description: 'Played a match with Gizmo the Robot!',
    color: 'from-cyan-300 to-blue-400',
  },
  {
    id: 'sparkle_fan',
    title: 'Rainbow Star',
    emoji: '🦄',
    description: 'Played a match with Sparkle the Unicorn!',
    color: 'from-pink-300 to-purple-400',
  },
  {
    id: 'barnaby_student',
    title: 'Wise Owl',
    emoji: '🦉',
    description: 'Learned tactics with Prof. Barnaby!',
    color: 'from-emerald-300 to-teal-500',
  },
  {
    id: 'pirate_crew',
    title: 'Pirate Matey',
    emoji: '🏴‍☠️',
    description: 'Sailed the board with Captain Barnacle!',
    color: 'from-red-400 to-rose-600',
  },
  {
    id: 'star_10',
    title: 'Star Collector',
    emoji: '⭐',
    description: 'Earned 10 shiny stars!',
    color: 'from-yellow-300 to-amber-400',
  },
  {
    id: 'star_25',
    title: 'Superstar',
    emoji: '🌟',
    description: 'Collected 25 golden stars!',
    color: 'from-amber-400 to-yellow-300',
  },
];

export const StickerModal: React.FC<StickerModalProps> = ({
  isOpen,
  onClose,
  stickers,
  totalStars,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const unlockedCount = ALL_STICKERS.filter((s) => stickers[s.id]).length;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="stickers-title"
      className="fixed inset-0 z-50 p-0 m-auto bg-transparent backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm max-w-xl w-[92vw] overflow-visible focus:outline-none"
    >
      <div className="bg-gradient-to-b from-amber-50 via-white to-amber-100 rounded-3xl shadow-2xl border-4 border-amber-400 p-6 max-h-[85vh] overflow-y-auto animate-pop">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-200">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-600" />
            <div>
              <h2 id="stickers-title" className="text-2xl font-black font-bubble text-slate-800">
                My Sticker Book 🌟
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {unlockedCount} of {ALL_STICKERS.length} Stickers Unlocked
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stickers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4">
          {ALL_STICKERS.map((s) => {
            const isUnlocked = !!stickers[s.id];

            return (
              <div
                key={s.id}
                className={`p-3 rounded-2xl border-2 text-center transition-all ${
                  isUnlocked
                    ? `bg-white border-amber-300 shadow-md transform hover:scale-105`
                    : `bg-slate-100/80 border-slate-200 opacity-60`
                }`}
              >
                <div
                  className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-2 shadow-sm ${
                    isUnlocked
                      ? `bg-gradient-to-tr ${s.color} border border-white animate-bounce-short`
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isUnlocked ? s.emoji : <Lock className="w-6 h-6 text-slate-400" />}
                </div>

                <h3 className="font-bubble font-bold text-sm text-slate-800 leading-tight mb-0.5">
                  {s.title}
                </h3>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {s.description}
                </p>

                {isUnlocked && (
                  <span className="inline-block mt-1.5 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    Unlocked! ✨
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 font-bubble">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Total Stars: {totalStars}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bubble font-bold text-sm shadow-sm transition-all"
          >
            Keep Playing! 🚀
          </button>
        </div>
      </div>
    </dialog>
  );
};

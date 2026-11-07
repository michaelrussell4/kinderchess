import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../services/audio';
import { Trophy, RotateCcw, Home, Star } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  winner: string | null; // null if draw/stalemate
  reason: 'checkmate' | 'draw' | 'stalemate';
  starsEarned: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  winner,
  reason,
  starsEarned,
  onPlayAgain,
  onGoHome,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }

      // Fire confetti burst!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#f43f5e', '#3b82f6', '#10b981', '#a855f7'],
        });
      } catch (e) {
        // confetti fallback
      }

      sounds.playVictory();
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="gameover-title"
      className="fixed inset-0 z-50 p-0 m-auto bg-transparent backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm max-w-md w-[90vw] overflow-visible focus:outline-none"
    >
      <div className="bg-gradient-to-b from-amber-50 via-white to-amber-100 rounded-3xl shadow-2xl border-4 border-amber-400 p-6 sm:p-8 text-center animate-pop">
        {/* Trophy Icon */}
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-3xl flex items-center justify-center shadow-lg border-2 border-white animate-bounce-short">
          <Trophy className="w-12 h-12 text-amber-950" />
        </div>

        {/* Title */}
        <h2
          id="gameover-title"
          className="text-3xl font-black font-bubble text-slate-800 mb-2"
        >
          {winner ? `${winner} Wins!` : 'Friendly Draw!'}
        </h2>

        {/* Subtext */}
        <p className="text-slate-600 font-medium mb-5">
          {reason === 'checkmate'
            ? 'A magnificent checkmate victory!'
            : reason === 'stalemate'
            ? 'Stalemate! No legal moves left — both players share the honors!'
            : 'Well played! A very close and exciting match!'}
        </p>

        {/* Stars earned badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-950 font-bubble font-bold text-lg mb-6 shadow-inner">
          <Star className="w-6 h-6 text-amber-500 fill-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>+{starsEarned} Stars Earned Today!</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bubble font-bold text-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Play Again!</span>
          </button>

          <button
            type="button"
            onClick={onGoHome}
            className="py-3 px-5 rounded-2xl bg-white hover:bg-slate-100 border-2 border-slate-300 text-slate-700 font-bubble font-bold text-base shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Home className="w-5 h-5" />
            <span>Main Menu</span>
          </button>
        </div>
      </div>
    </dialog>
  );
};

import React, { useRef, useEffect } from 'react';
import { X, BookOpen } from 'lucide-react';
import { Piece } from './Piece';
import { PieceStyleId } from '../types/chess';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  pieceStyle: PieceStyleId;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, pieceStyle }) => {
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

  const rules = [
    {
      type: 'p' as const,
      name: 'The Pawn (1 Point)',
      moves: 'Moves 1 square forward (or 2 on its very first move). Captures 1 square diagonally forward. If it reaches the far end of the board, it magically promotes to a Queen!',
      badge: 'bg-amber-100 text-amber-800',
    },
    {
      type: 'n' as const,
      name: 'The Knight (3 Points)',
      moves: 'Moves in an "L" shape (2 steps in one direction, then 1 step sideways). The Knight is the only piece that can jump over other pieces!',
      badge: 'bg-purple-100 text-purple-800',
    },
    {
      type: 'b' as const,
      name: 'The Bishop (3 Points)',
      moves: 'Glides diagonally as far as it wants! Each bishop stays on its original square color (one on light squares, one on dark squares).',
      badge: 'bg-blue-100 text-blue-800',
    },
    {
      type: 'r' as const,
      name: 'The Rook (5 Points)',
      moves: 'Moves in straight lines (forward, backward, left, or right) as far as the path is open. Like a mighty castle guard!',
      badge: 'bg-emerald-100 text-emerald-800',
    },
    {
      type: 'q' as const,
      name: 'The Queen (9 Points)',
      moves: 'The most powerful piece! Can move in any direction (straight lines or diagonals) as far as she wants.',
      badge: 'bg-pink-100 text-pink-800',
    },
    {
      type: 'k' as const,
      name: 'The King (Priceless!)',
      moves: 'The most important piece! Moves 1 square in any direction. Protect your King at all costs. If your King is attacked and cannot escape, that is Checkmate!',
      badge: 'bg-yellow-100 text-yellow-800',
    },
  ];

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="rules-title"
      className="fixed inset-0 z-50 p-0 m-auto bg-transparent backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm max-w-xl w-[92vw] overflow-visible focus:outline-none"
    >
      <div className="bg-gradient-to-b from-amber-50 via-white to-amber-100 rounded-3xl shadow-2xl border-4 border-amber-400 p-6 max-h-[85vh] overflow-y-auto animate-pop">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-200">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-600" />
            <h2 id="rules-title" className="text-2xl font-black font-bubble text-slate-800">
              How the Pieces Move 📖
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="space-y-4 py-4">
          {rules.map((rule) => (
            <div
              key={rule.type}
              className="flex items-start gap-4 p-3.5 bg-white rounded-2xl border border-amber-200 shadow-sm"
            >
              <div className="w-12 h-12 flex-shrink-0 bg-amber-50 rounded-xl border border-amber-300 p-1 flex items-center justify-center">
                <Piece type={rule.type} color="w" styleId={pieceStyle} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bubble font-bold text-base text-slate-800">
                    {rule.name}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {rule.moves}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-amber-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bubble font-bold text-base shadow-md transition-all active:scale-95"
          >
            Got It, Let's Play! 🚀
          </button>
        </div>
      </div>
    </dialog>
  );
};


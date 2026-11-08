import React, { useRef, useEffect } from 'react';
import { PieceType, Color, PieceStyleId } from '../types/chess';
import { Piece } from './Piece';
import { sounds } from '../services/audio';
import { Sparkles } from 'lucide-react';

interface PromotionModalProps {
  isOpen: boolean;
  color: Color;
  pieceStyle: PieceStyleId;
  onSelect: (piece: PieceType) => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({
  isOpen,
  color,
  pieceStyle,
  onSelect,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
      sounds.playCorrect();
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const choices: { type: PieceType; name: string; points: string; desc: string; color: string }[] = [
    { type: 'q', name: 'Queen 👑', points: '9 Pts', desc: 'Most powerful! Moves anywhere', color: 'from-amber-400 to-yellow-500' },
    { type: 'n', name: 'Knight ♞', points: '3 Pts', desc: 'Tricky L-shape jumper', color: 'from-purple-400 to-indigo-500' },
    { type: 'r', name: 'Rook ♜', points: '5 Pts', desc: 'Mighty castle tower', color: 'from-blue-400 to-cyan-500' },
    { type: 'b', name: 'Bishop ♝', points: '3 Pts', desc: 'Diagonal wizard', color: 'from-emerald-400 to-teal-500' },
  ];

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="promo-title"
      className="fixed inset-0 z-50 p-0 m-auto bg-transparent backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm max-w-md w-[92vw] overflow-visible focus:outline-none"
    >
      <div className="bg-gradient-to-b from-amber-50 via-white to-amber-100 rounded-3xl shadow-2xl border-4 border-amber-400 p-6 text-center animate-pop">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200 text-amber-900 font-bubble font-bold text-xs mb-3 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
          <span>Pawn Promotion Magic!</span>
        </div>

        <h2 id="promo-title" className="text-2xl sm:text-3xl font-black font-bubble text-slate-800 mb-1">
          Promote Your Pawn! 🌟
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium mb-5">
          Your brave pawn reached the other side! Pick your new superpower piece:
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {choices.map((c) => (
            <button
              key={c.type}
              type="button"
              onClick={() => {
                sounds.playVictory();
                onSelect(c.type);
              }}
              className="p-3.5 rounded-2xl bg-white border-2 border-amber-300 hover:border-amber-500 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center group"
            >
              <div className="w-14 h-14 mb-2 flex items-center justify-center p-1 bg-amber-50 rounded-2xl border border-amber-200 group-hover:bg-amber-100 transition-colors">
                <Piece type={c.type} color={color} styleId={pieceStyle} />
              </div>
              <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-800">
                {c.name}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 mt-1">
                {c.points}
              </span>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                {c.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </dialog>
  );
};

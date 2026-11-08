import React from 'react';
import { PlayerProfile, PieceType, PieceStyleId, Color } from '../types/chess';
import { Star, ShieldAlert } from 'lucide-react';
import { Piece } from './Piece';

interface PlayerPanelProps {
  player: PlayerProfile;
  isCurrentTurn: boolean;
  isInCheck: boolean;
  capturedPieces: PieceType[];
  pieceStyle: PieceStyleId;
  reverseColor?: boolean;
}

export const PlayerPanel: React.FC<PlayerPanelProps> = ({
  player,
  isCurrentTurn,
  isInCheck,
  capturedPieces,
  pieceStyle,
}) => {
  const opponentColor: Color = player.color === 'w' ? 'b' : 'w';

  // Group captured pieces by type
  const pieceCounts: Record<PieceType, number> = {
    p: 0,
    n: 0,
    b: 0,
    r: 0,
    q: 0,
    k: 0,
  };

  capturedPieces.forEach((p) => {
    if (pieceCounts[p] !== undefined) {
      pieceCounts[p]++;
    }
  });

  return (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300 border-2 ${
        isCurrentTurn
          ? 'bg-white shadow-lg border-amber-400 ring-2 ring-amber-300/50 scale-[1.01]'
          : 'bg-white/70 backdrop-blur-sm border-white/60 shadow-sm opacity-90'
      }`}
    >
      {/* Left: Avatar, Name & Turn */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300 flex items-center justify-center text-2xl sm:text-3xl shadow-sm flex-shrink-0">
            {player.avatar}
          </div>
          {isCurrentTurn && (
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="font-bubble font-black text-slate-800 text-sm sm:text-base truncate">
              {player.name}
            </h4>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                player.color === 'w'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-slate-800 text-slate-100'
              }`}
            >
              {player.color === 'w' ? 'White ♔' : 'Black ♚'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {isInCheck ? (
              <span className="flex items-center gap-1 font-bold text-rose-600 animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>IN CHECK!</span>
              </span>
            ) : isCurrentTurn ? (
              <span className="font-bold text-emerald-600">Your Turn! 🎯</span>
            ) : (
              <span className="text-slate-400 font-medium">Waiting...</span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Stars Earned & Captured Pieces */}
      <div className="flex items-center gap-3">
        {/* Star Counter */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-900 font-bubble font-bold text-xs sm:text-sm shadow-inner">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400 animate-pulse" />
          <span>{player.stars}</span>
        </div>

        {/* Captured Pieces Tray */}
        <div className="hidden sm:flex items-center gap-0.5 bg-slate-100 px-2 py-1 rounded-xl border border-slate-200 min-h-[32px]">
          {capturedPieces.length === 0 ? (
            <span className="text-[11px] text-slate-400 font-medium px-1">None yet</span>
          ) : (
            Object.entries(pieceCounts).map(([type, count]) => {
              if (count === 0) return null;
              return (
                <div key={type} className="flex items-center relative mr-1">
                  <div className="w-5 h-5">
                    <Piece
                      type={type as PieceType}
                      color={opponentColor}
                      styleId={pieceStyle}
                    />
                  </div>
                  {count > 1 && (
                    <span className="text-[10px] font-bold text-slate-600 ml-0.5">
                      ×{count}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { PieceType, Color, PieceStyleId } from '../types/chess';

interface PieceProps {
  type: PieceType;
  color: Color;
  styleId: PieceStyleId;
  showBadge?: boolean;
  className?: string;
  isDragging?: boolean;
}

export const Piece: React.FC<PieceProps> = ({
  type,
  color,
  styleId,
  showBadge = false,
  className = '',
  isDragging = false,
}) => {
  const isWhite = color === 'w';

  // 1. ANIMAL PAL STYLE
  if (styleId === 'animals') {
    const animalIcons: Record<PieceType, { emoji: string; label: string }> = {
      p: { emoji: isWhite ? '🐥' : '🐧', label: 'Pawn' },
      n: { emoji: isWhite ? '🦄' : '🐴', label: 'Knight' },
      b: { emoji: isWhite ? '🦊' : '🦉', label: 'Bishop' },
      r: { emoji: isWhite ? '🐘' : '🦏', label: 'Rook' },
      q: { emoji: isWhite ? '👸' : '🦚', label: 'Queen' },
      k: { emoji: isWhite ? '🦁' : '🐻', label: 'King' },
    };

    const item = animalIcons[type];
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center select-none transform transition-transform duration-150 ${
          isDragging ? 'scale-125 drop-shadow-2xl' : 'hover:scale-105'
        } ${className}`}
      >
        <span className="text-3xl sm:text-4xl md:text-5xl filter drop-shadow-md pointer-events-none">
          {item.emoji}
        </span>
        {showBadge && (
          <span className="text-[9px] font-bold font-bubble px-1 rounded bg-black/60 text-white leading-tight">
            {type.toUpperCase()}
          </span>
        )}
      </div>
    );
  }

  // 2. CLASSIC BOLD STYLE
  if (styleId === 'classic') {
    const symbols: Record<PieceType, { w: string; b: string }> = {
      k: { w: '♔', b: '♚' },
      q: { w: '♕', b: '♛' },
      r: { w: '♖', b: '♜' },
      b: { w: '♗', b: '♝' },
      n: { w: '♘', b: '♞' },
      p: { w: '♙', b: '♟' },
    };

    return (
      <div
        className={`w-full h-full flex items-center justify-center select-none font-bold text-4xl sm:text-5xl md:text-6xl ${
          isWhite
            ? 'text-amber-100 drop-shadow-[0_4px_3px_rgba(0,0,0,0.85)]'
            : 'text-slate-950 drop-shadow-[0_2px_4px_rgba(255,255,255,0.7)]'
        } ${isDragging ? 'scale-125' : 'hover:scale-105'} ${className}`}
      >
        {symbols[type][color]}
      </div>
    );
  }

  // 3. DEFAULT: VIBRANT, HIGH-CLARITY CARTOON SILHOUETTES
  // Hand-designed with the unmistakable international Staunton shapes:
  // King = Giant Cross (+), Queen = 5-Point Jewel Crown, Bishop = Pointed Mitre with Slit,
  // Knight = Noble Horse Head, Rook = Castle Tower with 4 Battlements, Pawn = Round Sphere Ball Head.

  const strokeColor = isWhite ? '#78350f' : '#020617';
  const fillColor = isWhite ? '#fffbeb' : '#1e293b';
  const secondaryColor = isWhite ? '#fef3c7' : '#334155';
  const accentGold = '#fbbf24';
  const accentGlow = isWhite ? '#ffffff' : '#64748b';

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center p-0.5 select-none transform transition-transform duration-150 ${
        isDragging ? 'scale-125 drop-shadow-2xl z-30' : 'hover:scale-105'
      } ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full max-w-[90%] max-h-[90%] filter drop-shadow-[0_4px_3px_rgba(0,0,0,0.35)] overflow-visible"
      >
        <defs>
          <linearGradient id={`grad-white-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
          <linearGradient id={`grad-black-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="60%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* ------------------- PAWN ------------------- */}
        {/* Round sphere ball head on conical base */}
        {type === 'p' && (
          <g>
            {/* Broad Base */}
            <path
              d="M 28 88 L 72 88 C 72 84 68 82 66 80 L 34 80 C 32 82 28 84 28 88 Z"
              fill={isWhite ? `url(#grad-white-p)` : `url(#grad-black-p)`}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Base Pedestal */}
            <rect
              x="22"
              y="88"
              width="56"
              height="6"
              rx="3"
              fill={secondaryColor}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Cone Body */}
            <path
              d="M 35 80 C 36 68 42 56 44 48 L 56 48 C 58 56 64 68 65 80 Z"
              fill={isWhite ? `url(#grad-white-p)` : `url(#grad-black-p)`}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Collar Ring */}
            <ellipse
              cx="50"
              cy="48"
              rx="13"
              ry="4"
              fill={accentGold}
              stroke={strokeColor}
              strokeWidth="3"
            />
            {/* Big Round Head Ball - The signature of a Pawn */}
            <circle
              cx="50"
              cy="31"
              r="17"
              fill={isWhite ? `url(#grad-white-p)` : `url(#grad-black-p)`}
              stroke={strokeColor}
              strokeWidth="4"
            />
            {/* Head shine highlight */}
            <ellipse cx="44" cy="25" rx="5" ry="7" fill={accentGlow} opacity="0.65" />
          </g>
        )}

        {/* ------------------- ROOK (CASTLE TOWER) ------------------- */}
        {/* Stout rectangular tower with 4 prominent square battlements */}
        {type === 'r' && (
          <g>
            {/* Broad Base */}
            <path
              d="M 24 88 L 76 88 C 76 83 71 80 67 78 L 33 78 C 29 80 24 83 24 88 Z"
              fill={isWhite ? `url(#grad-white-r)` : `url(#grad-black-r)`}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Base Pedestal */}
            <rect
              x="18"
              y="88"
              width="64"
              height="6"
              rx="3"
              fill={secondaryColor}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Tower Pillar Walls */}
            <path
              d="M 32 78 L 36 38 L 64 38 L 68 78 Z"
              fill={isWhite ? `url(#grad-white-r)` : `url(#grad-black-r)`}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Castle Arch Window */}
            <path
              d="M 44 65 L 44 54 C 44 50 56 50 56 54 L 56 65 Z"
              fill={strokeColor}
            />
            {/* Tower Rim Cornice */}
            <rect
              x="25"
              y="32"
              width="50"
              height="7"
              rx="2"
              fill={accentGold}
              stroke={strokeColor}
              strokeWidth="3"
            />
            {/* 4 PROMINENT CASTLE BATTLEMENTS (CRENELLATIONS) */}
            <path
              d="M 25 32 L 25 15 L 34 15 L 34 23 L 45 23 L 45 15 L 55 15 L 55 23 L 66 23 L 66 15 L 75 15 L 75 32 Z"
              fill={isWhite ? `url(#grad-white-r)` : `url(#grad-black-r)`}
              stroke={strokeColor}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* ------------------- KNIGHT (HORSE HEAD) ------------------- */}
        {/* Noble, unmistakably clear chess horse silhouette with pointed ears & mane */}
        {type === 'n' && (
          <g>
            {/* Base */}
            <path
              d="M 25 88 L 75 88 C 75 83 70 80 66 78 L 34 78 C 30 80 25 83 25 88 Z"
              fill={isWhite ? `url(#grad-white-n)` : `url(#grad-black-n)`}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <rect
              x="20"
              y="88"
              width="60"
              height="6"
              rx="3"
              fill={secondaryColor}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Distinctive Horse Profile Silhouette */}
            <path
              d="M 33 78 
                 C 30 65 31 52 35 44 
                 C 28 46 22 38 24 32 
                 C 25 28 32 28 39 33 
                 C 40 22 46 14 55 12 
                 C 58 11 60 15 57 19 
                 C 68 18 76 26 77 38 
                 C 78 52 74 65 67 78 Z"
              fill={isWhite ? `url(#grad-white-n)` : `url(#grad-black-n)`}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Pointed Horse Ear */}
            <polygon
              points="53,12 59,2 62,14"
              fill={accentGold}
              stroke={strokeColor}
              strokeWidth="3"
            />
            {/* Mane Arches */}
            <path
              d="M 64 22 C 72 26 74 34 72 38"
              fill="none"
              stroke={accentGold}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 68 38 C 75 44 76 54 71 60"
              fill="none"
              stroke={accentGold}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Horse Eye */}
            <circle cx="42" cy="27" r="3.5" fill={strokeColor} />
            <circle cx="41" cy="25.5" r="1.2" fill="#ffffff" />
            {/* Nostril */}
            <circle cx="27" cy="33" r="1.5" fill={strokeColor} />
          </g>
        )}

        {/* ------------------- BISHOP (MITRE WITH DIAGONAL SLIT) ------------------- */}
        {/* Pointed bishop hat, oval finial on top, and the signature diagonal cut */}
        {type === 'b' && (
          <g>
            {/* Base */}
            <path
              d="M 27 88 L 73 88 C 73 83 69 80 65 78 L 35 78 C 31 80 27 83 27 88 Z"
              fill={isWhite ? `url(#grad-white-b)` : `url(#grad-black-b)`}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <rect
              x="21"
              y="88"
              width="58"
              height="6"
              rx="3"
              fill={secondaryColor}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Robe Stem */}
            <path
              d="M 37 78 C 38 66 42 54 44 48 L 56 48 C 58 54 62 66 63 78 Z"
              fill={isWhite ? `url(#grad-white-b)` : `url(#grad-black-b)`}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Collar Ring */}
            <ellipse
              cx="50"
              cy="48"
              rx="14"
              ry="4"
              fill={accentGold}
              stroke={strokeColor}
              strokeWidth="3"
            />
            {/* Bishop Pointed Mitre Body */}
            <path
              d="M 33 48 C 32 30 46 16 50 14 C 54 16 68 30 67 48 Z"
              fill={isWhite ? `url(#grad-white-b)` : `url(#grad-black-b)`}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* ICONIC BISHOP DIAGONAL NOTCH/SLIT */}
            <path
              d="M 40 24 L 54 38 M 41 24 L 55 38"
              stroke={strokeColor}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Top Finial Ball */}
            <circle
              cx="50"
              cy="12"
              r="4.5"
              fill={accentGold}
              stroke={strokeColor}
              strokeWidth="3"
            />
            {/* Mitre Gold Cross Accent */}
            <circle cx="50" cy="38" r="4" fill={accentGold} stroke={strokeColor} strokeWidth="2" />
          </g>
        )}

        {/* ------------------- QUEEN (5-POINT JEWELED CORONET) ------------------- */}
        {/* Distinctive 5 coronet tips with round jewels, elegant curved waist */}
        {type === 'q' && (
          <g>
            {/* Base */}
            <path
              d="M 23 88 L 77 88 C 77 83 72 80 67 78 L 33 78 C 28 80 23 83 23 88 Z"
              fill={isWhite ? `url(#grad-white-q)` : `url(#grad-black-q)`}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <rect
              x="17"
              y="88"
              width="66"
              height="6"
              rx="3"
              fill={secondaryColor}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Gown Body with Curved Waist */}
            <path
              d="M 33 78 C 36 62 42 50 44 42 L 56 42 C 58 50 64 62 67 78 Z"
              fill={isWhite ? `url(#grad-white-q)` : `url(#grad-black-q)`}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Waist Belt */}
            <rect
              x="39"
              y="40"
              width="22"
              height="5"
              rx="2.5"
              fill={accentGold}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* QUEEN 5-POINT CORONET CROWN */}
            <polygon
              points="24,40 22,20 36,30 50,16 64,30 78,20 76,40"
              fill={isWhite ? `url(#grad-white-q)` : `url(#grad-black-q)`}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* 5 ROUND PEARL JEWELS ON CORONET TIPS */}
            <circle cx="22" cy="18" r="4" fill={accentGold} stroke={strokeColor} strokeWidth="2.5" />
            <circle cx="36" cy="28" r="3.5" fill={accentGold} stroke={strokeColor} strokeWidth="2.5" />
            <circle cx="50" cy="14" r="5" fill="#ef4444" stroke={strokeColor} strokeWidth="2.5" />
            <circle cx="64" cy="28" r="3.5" fill={accentGold} stroke={strokeColor} strokeWidth="2.5" />
            <circle cx="78" cy="18" r="4" fill={accentGold} stroke={strokeColor} strokeWidth="2.5" />
          </g>
        )}

        {/* ------------------- KING (PROMINENT ROYAL CROSS (+)) ------------------- */}
        {/* Tallest piece, majestic royal crown, and a GIANT, BOLD CROSS on top */}
        {type === 'k' && (
          <g>
            {/* Broad Base */}
            <path
              d="M 22 88 L 78 88 C 78 83 73 80 68 78 L 32 78 C 27 80 22 83 22 88 Z"
              fill={isWhite ? `url(#grad-white-k)` : `url(#grad-black-k)`}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <rect
              x="16"
              y="88"
              width="68"
              height="6"
              rx="3"
              fill={secondaryColor}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Royal Robe Body */}
            <path
              d="M 32 78 C 34 60 41 46 43 38 L 57 38 C 59 46 66 60 68 78 Z"
              fill={isWhite ? `url(#grad-white-k)` : `url(#grad-black-k)`}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Royal Crown Mantle */}
            <path
              d="M 28 38 C 24 24 38 24 50 22 C 62 24 76 24 72 38 Z"
              fill={isWhite ? `url(#grad-white-k)` : `url(#grad-black-k)`}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Golden Crown Rim with Jewels */}
            <rect
              x="26"
              y="34"
              width="48"
              height="7"
              rx="2.5"
              fill={accentGold}
              stroke={strokeColor}
              strokeWidth="3"
            />
            <circle cx="36" cy="37.5" r="2" fill="#ef4444" />
            <circle cx="50" cy="37.5" r="2.5" fill="#3b82f6" />
            <circle cx="64" cy="37.5" r="2" fill="#10b981" />

            {/* UNMISTAKABLE GIANT ROYAL LATIN CROSS (+) ON TOP */}
            {/* Cross Vertical Beam */}
            <rect
              x="47"
              y="5"
              width="6"
              height="18"
              rx="1.5"
              fill={accentGold}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* Cross Horizontal Beam */}
            <rect
              x="42"
              y="9"
              width="16"
              height="6"
              rx="1.5"
              fill={accentGold}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* Cross Center Ruby Gem */}
            <circle cx="50" cy="12" r="2" fill="#ef4444" />
          </g>
        )}
      </svg>

      {/* Optional Corner Letter Badge: 'P', 'N', 'B', 'R', 'Q', 'K' for 100% clarity */}
      {showBadge && (
        <span
          className={`absolute bottom-0 right-0 text-[10px] sm:text-xs font-black font-bubble px-1.5 py-0.2 rounded-md shadow-md border ${
            isWhite
              ? 'bg-amber-100 text-amber-950 border-amber-400'
              : 'bg-slate-900 text-cyan-300 border-slate-700'
          }`}
        >
          {type === 'n' ? 'Kn' : type.toUpperCase()}
        </span>
      )}
    </div>
  );
};

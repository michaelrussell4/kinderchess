import React from 'react';
import { PieceType, Color, PieceStyleId } from '../types/chess';

interface PieceProps {
  type: PieceType;
  color: Color;
  styleId: PieceStyleId;
  className?: string;
  isDragging?: boolean;
}

export const Piece: React.FC<PieceProps> = ({
  type,
  color,
  styleId,
  className = '',
  isDragging = false,
}) => {
  const isWhite = color === 'w';

  if (styleId === 'animals') {
    // Cute Animal Kingdom set
    const animalIcons: Record<PieceType, { emoji: string; name: string }> = {
      p: { emoji: isWhite ? '🐥' : '🐧', name: 'Chick' },
      n: { emoji: isWhite ? '🦄' : '🐴', name: 'Horse' },
      b: { emoji: isWhite ? '🦊' : '🦉', name: 'Fox' },
      r: { emoji: isWhite ? '🦏' : '🐘', name: 'Elephant' },
      q: { emoji: isWhite ? '👸' : '🦚', name: 'Princess' },
      k: { emoji: isWhite ? '🦁' : '🐻', name: 'Lion King' },
    };

    const item = animalIcons[type];

    return (
      <div
        className={`w-full h-full flex items-center justify-center select-none transform transition-transform duration-150 ${
          isDragging ? 'scale-125 drop-shadow-2xl' : 'hover:scale-110'
        } ${className}`}
      >
        <span className="text-3xl sm:text-4xl md:text-5xl filter drop-shadow-md select-none pointer-events-none transition-transform">
          {item.emoji}
        </span>
      </div>
    );
  }

  if (styleId === 'classic') {
    // Classic bold vector icons with colored glow
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
        className={`w-full h-full flex items-center justify-center select-none font-bold text-3xl sm:text-4xl md:text-5xl ${
          isWhite
            ? 'text-amber-100 drop-shadow-[0_3px_2px_rgba(0,0,0,0.8)]'
            : 'text-slate-900 drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)]'
        } ${isDragging ? 'scale-125' : 'hover:scale-110'} ${className}`}
      >
        {symbols[type][color]}
      </div>
    );
  }

  // Default: 'cartoon' - Custom SVG Illustrated pieces with cute eyes and smiley faces!
  const strokeColor = isWhite ? '#b45309' : '#0f172a';
  const fillColor = isWhite ? '#fef3c7' : '#334155';
  const highlightColor = isWhite ? '#ffffff' : '#64748b';
  const eyeColor = isWhite ? '#1e293b' : '#f8fafc';

  return (
    <div
      className={`w-full h-full flex items-center justify-center p-1 select-none transform transition-transform duration-150 ${
        isDragging ? 'scale-125 drop-shadow-2xl z-20' : 'hover:scale-110'
      } ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full max-w-[85%] max-h-[85%] filter drop-shadow-md overflow-visible"
      >
        {/* Render piece based on type */}
        {type === 'p' && (
          // Cute Little Pawn Soldier
          <g>
            {/* Body */}
            <path
              d="M 30 85 L 70 85 C 68 70 60 55 58 45 L 42 45 C 40 55 32 70 30 85 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Base */}
            <rect
              x="25"
              y="85"
              width="50"
              height="8"
              rx="4"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="4"
            />
            {/* Head */}
            <circle
              cx="50"
              cy="32"
              r="18"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="4"
            />
            {/* Head shine */}
            <ellipse cx="44" cy="26" rx="4" ry="6" fill={highlightColor} opacity="0.6" />
            {/* Cute Cartoon Eyes */}
            <ellipse cx="45" cy="32" rx="2.5" ry="3.5" fill={eyeColor} />
            <ellipse cx="55" cy="32" rx="2.5" ry="3.5" fill={eyeColor} />
            <circle cx="44" cy="30" r="1" fill="#ffffff" />
            <circle cx="54" cy="30" r="1" fill="#ffffff" />
            {/* Smile */}
            <path
              d="M 47 38 Q 50 42 53 38"
              fill="none"
              stroke={eyeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {type === 'n' && (
          // Adorable Horsie / Knight
          <g>
            {/* Horse Body and Head */}
            <path
              d="M 28 85 L 72 85 C 70 70 65 58 60 52 C 65 42 63 26 50 20 C 47 12 37 14 34 22 C 26 24 22 34 26 42 C 30 46 32 44 38 40 C 34 50 30 65 28 85 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Base */}
            <rect
              x="24"
              y="85"
              width="52"
              height="8"
              rx="4"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="4"
            />
            {/* Mane Tufts */}
            <circle cx="56" cy="25" r="5" fill={highlightColor} stroke={strokeColor} strokeWidth="2.5" />
            <circle cx="62" cy="36" r="6" fill={highlightColor} stroke={strokeColor} strokeWidth="2.5" />
            {/* Horse Ear */}
            <polygon points="36,14 42,24 33,23" fill={fillColor} stroke={strokeColor} strokeWidth="3" />
            {/* Eye */}
            <circle cx="37" cy="30" r="3.5" fill={eyeColor} />
            <circle cx="36" cy="28.5" r="1.2" fill="#ffffff" />
            {/* Snout & Smile */}
            <circle cx="26" cy="38" r="1.5" fill={eyeColor} />
            <path
              d="M 27 41 Q 30 44 33 41"
              fill="none"
              stroke={eyeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {type === 'b' && (
          // Wise Little Wizard / Bishop
          <g>
            {/* Robe Body */}
            <path
              d="M 26 85 L 74 85 C 70 65 62 48 58 40 L 42 40 C 38 48 30 65 26 85 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Base */}
            <rect
              x="22"
              y="85"
              width="56"
              height="8"
              rx="4"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="4"
            />
            {/* Mitre / Hat */}
            <path
              d="M 33 40 C 33 22 50 12 50 12 C 50 12 67 22 67 40 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="4"
            />
            {/* Little Cross/Ball on Hat */}
            <circle cx="50" cy="11" r="5" fill="#f59e0b" stroke={strokeColor} strokeWidth="3" />
            {/* Hat slit */}
            <line x1="50" y1="20" x2="50" y2="34" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            {/* Eyes */}
            <circle cx="44" cy="48" r="3" fill={eyeColor} />
            <circle cx="56" cy="48" r="3" fill={eyeColor} />
            <circle cx="43" cy="47" r="1" fill="#ffffff" />
            <circle cx="55" cy="47" r="1" fill="#ffffff" />
            {/* Friendly Glasses */}
            <circle cx="44" cy="48" r="6" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="56" cy="48" r="6" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <line x1="50" y1="48" x2="50" y2="48" stroke="#f59e0b" strokeWidth="2" />
            {/* Smile */}
            <path d="M 46 58 Q 50 63 54 58" fill="none" stroke={eyeColor} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {type === 'r' && (
          // Castle Fortress / Rook with Little Window & Flags
          <g>
            {/* Tower Base & Wall */}
            <path
              d="M 28 85 L 72 85 L 68 40 L 32 40 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Base */}
            <rect
              x="22"
              y="85"
              width="56"
              height="8"
              rx="4"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="4"
            />
            {/* Battlements (Castles) */}
            <polygon
              points="26,40 26,22 34,22 34,28 46,28 46,22 54,22 54,28 66,28 66,22 74,22 74,40"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Arch Doorway */}
            <path
              d="M 44 85 L 44 68 C 44 64 56 64 56 68 L 56 85 Z"
              fill={strokeColor}
            />
            {/* Castle Eyes on upper wall */}
            <circle cx="42" cy="48" r="3" fill={eyeColor} />
            <circle cx="58" cy="48" r="3" fill={eyeColor} />
            <circle cx="41" cy="47" r="1" fill="#ffffff" />
            <circle cx="57" cy="47" r="1" fill="#ffffff" />
            {/* Cheerful Grin */}
            <path d="M 45 55 Q 50 60 55 55" fill="none" stroke={eyeColor} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {type === 'q' && (
          // Beautiful Queen with Glinting Tiara
          <g>
            {/* Gown Body */}
            <path
              d="M 24 85 L 76 85 C 72 65 62 48 58 38 L 42 38 C 38 48 28 65 24 85 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Base */}
            <rect
              x="20"
              y="85"
              width="60"
              height="8"
              rx="4"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="4"
            />
            {/* Royal Tiara Crown */}
            <polygon
              points="26,38 30,16 40,26 50,14 60,26 70,16 74,38"
              fill="#fbbf24"
              stroke={strokeColor}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Jewels on tiara tips */}
            <circle cx="30" cy="15" r="3.5" fill="#ec4899" />
            <circle cx="50" cy="13" r="4.5" fill="#3b82f6" />
            <circle cx="70" cy="15" r="3.5" fill="#ec4899" />
            {/* Eyes */}
            <ellipse cx="43" cy="50" rx="3" ry="4" fill={eyeColor} />
            <ellipse cx="57" cy="50" rx="3" ry="4" fill={eyeColor} />
            <circle cx="42" cy="48.5" r="1.2" fill="#ffffff" />
            <circle cx="56" cy="48.5" r="1.2" fill="#ffffff" />
            {/* Rosy Cheeks */}
            <circle cx="36" cy="54" r="3" fill="#f43f5e" opacity="0.4" />
            <circle cx="64" cy="54" r="3" fill="#f43f5e" opacity="0.4" />
            {/* Royal Sweet Smile */}
            <path d="M 46 58 Q 50 63 54 58" fill="none" stroke={eyeColor} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {type === 'k' && (
          // Proud & Regal King with Big Gold Crown & Royal Beard
          <g>
            {/* Royal Cloak Body */}
            <path
              d="M 22 85 L 78 85 C 74 65 64 45 59 36 L 41 36 C 36 45 26 65 22 85 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Base */}
            <rect
              x="18"
              y="85"
              width="64"
              height="8"
              rx="4"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="4"
            />
            {/* Grand Crown */}
            <path
              d="M 28 36 L 26 22 L 38 28 L 50 18 L 62 28 L 74 22 L 72 36 Z"
              fill="#f59e0b"
              stroke={strokeColor}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Cross on top of crown */}
            <path
              d="M 50 7 L 50 17 M 45 11 L 55 11"
              stroke="#fbbf24"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Crown Jewels */}
            <circle cx="50" cy="28" r="3.5" fill="#ef4444" />
            <circle cx="36" cy="30" r="2.5" fill="#3b82f6" />
            <circle cx="64" cy="30" r="2.5" fill="#10b981" />
            {/* Big Friendly Eyes */}
            <ellipse cx="43" cy="48" rx="3.5" ry="4" fill={eyeColor} />
            <ellipse cx="57" cy="48" rx="3.5" ry="4" fill={eyeColor} />
            <circle cx="42" cy="46.5" r="1.2" fill="#ffffff" />
            <circle cx="56" cy="46.5" r="1.2" fill="#ffffff" />
            {/* Grand King Mustache & Smile */}
            <path
              d="M 40 56 Q 47 52 50 56 Q 53 52 60 56 Q 50 64 40 56 Z"
              fill={isWhite ? '#fde68a' : '#475569'}
              stroke={strokeColor}
              strokeWidth="2"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

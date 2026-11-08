import React from 'react';
import { Chess, Square as ChessSquare } from 'chess.js';
import { BoardTheme, PieceStyleId, Color } from '../types/chess';
import { Piece } from './Piece';
import { sounds } from '../services/audio';

interface BoardProps {
  chess: Chess;
  theme: BoardTheme;
  pieceStyle: PieceStyleId;
  showPieceBadges?: boolean;
  selectedSquare: string | null;
  validMoves: string[];
  lastMove: { from: string; to: string } | null;
  hintSquare: string | null;
  orientation: Color;
  onSquareClick: (square: string) => void;
  disabled?: boolean;
}

export const Board: React.FC<BoardProps> = ({
  chess,
  theme,
  pieceStyle,
  showPieceBadges = false,
  selectedSquare,
  validMoves,
  lastMove,
  hintSquare,
  orientation,
  onSquareClick,
  disabled = false,
}) => {
  const board = chess.board();
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  // Check if king is in check
  const isCheck = chess.isCheck();
  let kingCheckSquare: string | null = null;
  if (isCheck) {
    const turn = chess.turn();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type === 'k' && p.color === turn) {
          kingCheckSquare = `${files[c]}${ranks[r]}`;
          break;
        }
      }
      if (kingCheckSquare) break;
    }
  }

  // Row and column mapping based on orientation
  const displayRanks = orientation === 'w' ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
  const displayFiles = orientation === 'w' ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];

  const handleSquareClick = (square: string) => {
    if (disabled) return;
    sounds.playTap();
    onSquareClick(square);
  };

  return (
    <div className="relative p-2 sm:p-3 md:p-4 rounded-3xl bg-white/20 backdrop-blur-md shadow-2xl border-4 border-white/40 max-w-[540px] w-full aspect-square mx-auto select-none">
      <div
        className={`w-full h-full grid grid-cols-8 grid-rows-8 rounded-2xl overflow-hidden shadow-inner border-2 ${theme.borderColor}`}
      >
        {displayRanks.map((r) =>
          displayFiles.map((c) => {
            const squareNotation = `${files[c]}${ranks[r]}` as ChessSquare;
            const piece = board[r][c];
            const isLight = (r + c) % 2 === 0;

            const isSelected = selectedSquare === squareNotation;
            const isValidTarget = validMoves.includes(squareNotation);
            const isLastMoveFrom = lastMove?.from === squareNotation;
            const isLastMoveTo = lastMove?.to === squareNotation;
            const isKingInCheck = kingCheckSquare === squareNotation;
            const isHint = hintSquare === squareNotation;

            // Square background styling
            let squareBg = isLight ? theme.lightSquare : theme.darkSquare;

            if (isSelected) {
              squareBg = isLight ? theme.lightHighlight : theme.darkHighlight;
            } else if (isLastMoveFrom || isLastMoveTo) {
              squareBg = isLight ? 'bg-amber-200/90' : 'bg-amber-500/80';
            }

            return (
              <button
                key={squareNotation}
                type="button"
                onClick={() => handleSquareClick(squareNotation)}
                disabled={disabled}
                aria-label={`Square ${squareNotation}${piece ? `, ${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}` : ''}`}
                className={`relative flex items-center justify-center p-0 m-0 cursor-pointer focus:outline-none transition-colors duration-150 ${squareBg} ${
                  isKingInCheck ? 'ring-4 ring-rose-500 bg-rose-400/80 animate-pulse' : ''
                } ${isHint ? 'ring-4 ring-amber-400 bg-amber-300/80 animate-pulse' : ''}`}
              >
                {/* Board Rank/File Coordinate labels */}
                {c === (orientation === 'w' ? 0 : 7) && (
                  <span
                    className={`absolute top-0.5 left-1 text-[9px] sm:text-[11px] font-bold font-bubble pointer-events-none select-none ${
                      isLight ? 'text-slate-500/80' : 'text-white/80'
                    }`}
                  >
                    {ranks[r]}
                  </span>
                )}
                {r === (orientation === 'w' ? 7 : 0) && (
                  <span
                    className={`absolute bottom-0.5 right-1 text-[9px] sm:text-[11px] font-bold font-bubble pointer-events-none select-none ${
                      isLight ? 'text-slate-500/80' : 'text-white/80'
                    }`}
                  >
                    {files[c]}
                  </span>
                )}

                {/* The Chess Piece */}
                {piece && (
                  <Piece
                    type={piece.type}
                    color={piece.color}
                    styleId={pieceStyle}
                    showBadge={showPieceBadges}
                    className="z-10"
                  />
                )}

                {/* Valid Move Indicator (Dot for empty square, Ring for capture) */}
                {isValidTarget && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    {piece ? (
                      // Capture target ring
                      <div className="w-[85%] h-[85%] rounded-full border-4 border-rose-500/90 animate-ping opacity-75"></div>
                    ) : (
                      // Move dot
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500/70 shadow-md transform hover:scale-125 transition-transform"></div>
                    )}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

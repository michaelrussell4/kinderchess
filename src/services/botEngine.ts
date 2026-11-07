import { Chess, Move } from 'chess.js';
import { BotPersona, BotPersonaId, PieceType } from '../types/chess';

export const BOTS: Record<BotPersonaId, BotPersona> = {
  pip: {
    id: 'pip',
    name: 'Pip the Puppy',
    title: 'Playful Beginner 🐾',
    avatar: '🐶',
    accentColor: 'from-amber-400 to-orange-500',
    difficulty: 'Easy',
    engineDepth: 1,
    randomFactor: 0.4,
    pitch: 1.35,
    rate: 1.15,
    description: 'A friendly playful pup who loves moving pawns and cheering you on with wagging barks!',
    favoritePiece: 'Pawn ♟️',
    catchphrases: {
      start: ["Woof woof! Let's play chess!", "Wagging my tail, ready to roll! 🐾", "Yay, chess time with my best pal!"],
      move: ["I like this square!", "Pawn forward, woof!", "Your turn, human friend!", "Bouncy bounce to here!"],
      capture: ["Yum, captured a treat! 🦴", "Nom nom nom!", "Gotcha! High paw!"],
      checked: ["Whimper! My king needs to hide!", "Woof! Where do I run?", "Yikes, you caught me off guard!"],
      lose: ["Good game! You are so smart! 🎾", "Can we play again? High five, human friend!"],
      win: ["Woof hooray! Happy puppy dance! 🐾", "That was so much fun! Woof!"],
      praise: ["Super smart move! Woof!", "You solved that so fast!", "You have a giant brain!"],
    },
  },
  gizmo: {
    id: 'gizmo',
    name: 'Gizmo the Robot',
    title: 'Tactical Calculator 🤖',
    avatar: '🤖',
    accentColor: 'from-cyan-400 to-blue-600',
    difficulty: 'Medium',
    engineDepth: 2,
    randomFactor: 0.15,
    pitch: 0.85,
    rate: 0.95,
    description: 'A cheerful mechanical buddy who calculates smart moves and loves futuristic gadgets!',
    favoritePiece: 'Rook ♜',
    catchphrases: {
      start: ["BEEP BOOP! Initializing chess subroutine v3.2...", "Greetings, human friend! My circuits are ready! ⚡"],
      move: ["Calculating trajectory... Move executed!", "Beep! That computes well.", "Efficiency rating: 98.4%."],
      capture: ["Material acquired! Processing upgrade.", "Target neutralized! Bzzzt!", "Beep! Piece downloaded!"],
      checked: ["WARNING: King unit threatened! Recalculating...", "Alert: Check condition registered! Beep!"],
      lose: ["Error 404: Robot defeated! You played flawlessly!", "System shutdown... You are a chess genius!"],
      win: ["Victory algorithm executed successfully! Good game!", "Robots 1, Humans 0! Beep boop!"],
      praise: ["Mathematical accuracy 100%! Superb answer!", "Logic circuits delighted by your big brain!"],
    },
  },
  sparkle: {
    id: 'sparkle',
    name: 'Sparkle the Unicorn',
    title: 'Magic Dreamer 🦄',
    avatar: '🦄',
    accentColor: 'from-pink-400 to-purple-500',
    difficulty: 'Medium+',
    engineDepth: 2,
    randomFactor: 0.1,
    pitch: 1.45,
    rate: 1.05,
    description: 'A magical unicorn from Rainbow Valley who loves dancing knights and sparkling diagonals!',
    favoritePiece: 'Knight ♞',
    catchphrases: {
      start: ["Neigh! Let's spread rainbows on the chessboard! ✨", "Magic is in the air! Ready for adventure? 🌈"],
      move: ["Prancing to a sunny square! ✨", "A sparkly leap forward!", "Magic sparkles everywhere!"],
      capture: ["Zap! Sprinkled with glitter! ✨", "My magical knight gallops away!", "Ta-da! Sparkle power!"],
      checked: ["Oh my rainbows! Watch out for my royal crown!", "Sparkly shield activated!"],
      lose: ["A magical victory for you! You shine so bright! 🌟", "Shower of stardust for the champion! 🌈"],
      win: ["Rainbow crown for Sparkle! Wheeee! 🦄", "The magic kingdom rejoices! Sparkling win!"],
      praise: ["Sparkletastic! You are a brilliant star!", "Glittering answer! You've got magic inside!"],
    },
  },
  barnaby: {
    id: 'barnaby',
    name: 'Prof. Barnaby',
    title: 'Wise Chess Owl 🦉',
    avatar: '🦉',
    accentColor: 'from-amber-600 to-emerald-700',
    difficulty: 'Hard',
    engineDepth: 3,
    randomFactor: 0.05,
    pitch: 0.75,
    rate: 0.85,
    description: 'An ancient, scholarly owl who shares gentle chess tips, patience, and grand strategy.',
    favoritePiece: 'Bishop ♝',
    catchphrases: {
      start: ["Hoot hoot! Welcome to our chess lesson today, young scholar.", "A patient mind is the finest piece of all. 📖"],
      move: ["Controlling the center is paramount.", "A thoughtful repositioning.", "Consider all options before you strike."],
      capture: ["Tactical exchange! Very instructive.", "The advantage tilts slightly. Hoot!"],
      checked: ["Hoot! An astute tactical check! Well spotted.", "My defenses are tested by your keen eye!"],
      lose: ["Outstanding display of intellect! You have surpassed the mentor! 🎓", "Splendid game! A true young master!"],
      win: ["A valuable learning experience for us both. Hoot!", "Reflect on this match and grow even stronger!"],
      praise: ["Exemplary scholarship! Keep up that brilliant thinking!", "A gold star for your sharp mind! 🌟"],
    },
  },
  barnacle: {
    id: 'barnacle',
    name: 'Capt. Barnacle',
    title: 'Salty Pirate 🏴‍☠️',
    avatar: '🏴‍☠️',
    accentColor: 'from-red-500 to-slate-800',
    difficulty: 'Medium+',
    engineDepth: 2,
    randomFactor: 0.12,
    pitch: 0.65,
    rate: 0.9,
    description: 'A swashbuckling pirate captain who loves sneak attacks, flying rooks, and shiny golden pawns!',
    favoritePiece: 'Queen ♛',
    catchphrases: {
      start: ["Ahoy, matey! Prepare to walk the eight-by-eight plank! 🏴‍☠️", "Hoist the Jolly Roger! Let's duel! ⚓"],
      move: ["Arrgh, me rook sails into position!", "Sneaky knight jump, matey!", "Aye, take that!"],
      capture: ["Plunder and booty for the crew! Yarrr!", "Down to Davy Jones' locker with that piece!"],
      checked: ["Blisterin' barnacles! Me King is under fire!", "Man the cannons! Protect the treasure!"],
      lose: ["Shiver me timbers! Ye outsmarted Captain Barnacle!", "Fair winds to ye, mighty chess pirate! 🏆"],
      win: ["A pirate's treasure is mine! Yo-ho-ho!", "Victory on the seven chess seas!"],
      praise: ["Aye! Ye've got the sharpest wits in the whole fleet!", "Smart as a sea eagle, matey!"],
    },
  },
};

// Piece point values for bot evaluation
const PIECE_VALUES: Record<PieceType, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Positional bonuses: encourage center control and active pieces
const PAWN_PST = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_PST = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

function evaluateBoard(chess: Chess, botColor: 'w' | 'b'): number {
  if (chess.isCheckmate()) {
    return chess.turn() === botColor ? -99999 : 99999;
  }
  if (chess.isDraw()) {
    return 0;
  }

  let totalScore = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      let score = PIECE_VALUES[piece.type];

      // Add basic piece-square table bonuses
      if (piece.type === 'p') {
        const row = piece.color === 'w' ? 7 - r : r;
        score += PAWN_PST[row][c];
      } else if (piece.type === 'n') {
        score += KNIGHT_PST[r][c];
      }

      if (piece.color === botColor) {
        totalScore += score;
      } else {
        totalScore -= score;
      }
    }
  }

  return totalScore;
}

function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  botColor: 'w' | 'b'
): number {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess, botColor);
  }

  const moves = chess.moves({ verbose: true });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, false, botColor);
      chess.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, true, botColor);
      chess.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function chooseBotMove(chess: Chess, bot: BotPersona): Move | null {
  const legalMoves = chess.moves({ verbose: true });
  if (legalMoves.length === 0) return null;

  const botColor = chess.turn();

  // If bot is playful/beginner, sometimes pick a random or pawn/knight move
  if (Math.random() < bot.randomFactor) {
    // Favor captures or favorite pieces if available
    const captures = legalMoves.filter((m) => m.captured);
    if (captures.length > 0 && Math.random() < 0.6) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
  }

  // Otherwise, use Minimax with alpha-beta pruning
  let bestMove: Move = legalMoves[0];
  let bestScore = -Infinity;

  // Shuffle moves so bot doesn't always play the exact same opening line
  const shuffledMoves = [...legalMoves].sort(() => Math.random() - 0.5);

  for (const move of shuffledMoves) {
    chess.move(move);
    // Depth for search
    const score = minimax(
      chess,
      bot.engineDepth - 1,
      -Infinity,
      Infinity,
      false,
      botColor
    );
    chess.undo();

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

// Get a random catchphrase for a specific context
export function getBotPhrase(
  bot: BotPersona,
  context: 'start' | 'move' | 'capture' | 'checked' | 'lose' | 'win' | 'praise'
): string {
  const phrases = bot.catchphrases[context];
  if (!phrases || phrases.length === 0) return 'Let us play!';
  return phrases[Math.floor(Math.random() * phrases.length)];
}

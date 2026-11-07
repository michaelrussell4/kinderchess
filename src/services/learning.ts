import { LearningCategory, LearningDifficulty, LearningChallenge } from '../types/chess';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateChallenge(
  category: LearningCategory,
  difficulty: LearningDifficulty
): LearningChallenge {
  // If 'mixed', pick randomly between math, reading, chess
  let selectedCategory: 'math' | 'reading' | 'chess' = 'math';
  if (category === 'mixed') {
    const r = Math.random();
    if (r < 0.45) selectedCategory = 'math';
    else if (r < 0.8) selectedCategory = 'reading';
    else selectedCategory = 'chess';
  } else {
    selectedCategory = category;
  }

  if (selectedCategory === 'math') {
    return generateMathChallenge(difficulty);
  } else if (selectedCategory === 'reading') {
    return generateReadingChallenge(difficulty);
  } else {
    return generateChessChallenge(difficulty);
  }
}

// ------------------- MATH CHALLENGES -------------------
function generateMathChallenge(diff: LearningDifficulty): LearningChallenge {
  const id = 'math-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

  if (diff === 'easy') {
    // Kindergarten / Pre-K: Visual counting & Addition up to 10
    const type = Math.random();

    if (type < 0.5) {
      // Visual addition with emoji items
      const a = randInt(1, 5);
      const b = randInt(1, 4);
      const sum = a + b;
      const emoji = ['🍎', '⭐', '🎈', '🍪', '🐱', '🚀'][randInt(0, 5)];

      const visualA = Array(a).fill(emoji).join(' ');
      const visualB = Array(b).fill(emoji).join(' ');

      const question = `${a} + ${b} = ?`;
      const subtext = `Count the items: [ ${visualA} ] + [ ${visualB} ]`;
      const explanation = `Great job! ${a} plus ${b} equals ${sum}!`;

      const options = generateNumberOptions(sum, 1, 10);

      return {
        id,
        category: 'math',
        subject: 'Counting & Addition',
        question,
        subtext,
        visualEmoji: emoji,
        options: options.items.map(String),
        correctIndex: options.correctIndex,
        explanation,
        speechText: `Can you solve: ${a} plus ${b}? How many ${emoji} are there altogether?`,
      };
    } else {
      // Simple subtraction within 5 to 8
      const a = randInt(3, 8);
      const b = randInt(1, a - 1);
      const diffResult = a - b;

      const question = `${a} - ${b} = ?`;
      const subtext = `If you have ${a} cookies and eat ${b}, how many are left? 🍪`;
      const explanation = `Awesome! ${a} minus ${b} is ${diffResult}!`;

      const options = generateNumberOptions(diffResult, 0, 8);

      return {
        id,
        category: 'math',
        subject: 'Subtraction Fun',
        question,
        subtext,
        visualEmoji: '🍪',
        options: options.items.map(String),
        correctIndex: options.correctIndex,
        explanation,
        speechText: `What is ${a} minus ${b}?`,
      };
    }
  } else if (diff === 'medium') {
    // Elementary: Addition/subtraction to 20, skip counting, easy multiplication
    const mode = Math.random();

    if (mode < 0.35) {
      // Addition up to 20
      const a = randInt(6, 12);
      const b = randInt(4, 9);
      const sum = a + b;
      const options = generateNumberOptions(sum, 10, 25);

      return {
        id,
        category: 'math',
        subject: 'Addition Up to 20',
        question: `${a} + ${b} = ?`,
        subtext: `Add the two friendly numbers together!`,
        visualEmoji: '➕',
        options: options.items.map(String),
        correctIndex: options.correctIndex,
        explanation: `Super! ${a} + ${b} = ${sum}!`,
        speechText: `What is ${a} plus ${b}?`,
      };
    } else if (mode < 0.7) {
      // Skip counting pattern
      const step = [2, 5, 10][randInt(0, 2)];
      const start = randInt(1, 3) * step;
      const seq = [start, start + step, start + step * 2, start + step * 3];
      const target = start + step * 3;
      const displaySeq = `${seq[0]}, ${seq[1]}, ${seq[2]}, ❓`;

      const options = generateNumberOptions(target, Math.max(2, target - 10), target + 10);

      return {
        id,
        category: 'math',
        subject: `Counting by ${step}s`,
        question: `What comes next?`,
        subtext: displaySeq,
        visualEmoji: '🔢',
        options: options.items.map(String),
        correctIndex: options.correctIndex,
        explanation: `Brilliant! Counting by ${step}s gives ${target}!`,
        speechText: `What number comes next in the pattern: ${seq[0]}, ${seq[1]}, ${seq[2]}?`,
      };
    } else {
      // Easy multiplication (2s, 3s, 5s)
      const a = [2, 3, 5][randInt(0, 2)];
      const b = randInt(2, 6);
      const product = a * b;
      const options = generateNumberOptions(product, 4, 30);

      return {
        id,
        category: 'math',
        subject: 'Multiplication Sparks',
        question: `${a} × ${b} = ?`,
        subtext: `${a} groups of ${b}`,
        visualEmoji: '✨',
        options: options.items.map(String),
        correctIndex: options.correctIndex,
        explanation: `Spot on! ${a} times ${b} equals ${product}!`,
        speechText: `What is ${a} times ${b}?`,
      };
    }
  } else {
    // Master: Multiplication tables & division
    const mode = Math.random();
    if (mode < 0.6) {
      const a = randInt(4, 9);
      const b = randInt(4, 9);
      const product = a * b;
      const options = generateNumberOptions(product, 16, 81);

      return {
        id,
        category: 'math',
        subject: 'Multiplication Master',
        question: `${a} × ${b} = ?`,
        subtext: `Multiply like a chess grandmaster!`,
        visualEmoji: '🧠',
        options: options.items.map(String),
        correctIndex: options.correctIndex,
        explanation: `Impressive calculation! ${a} × ${b} = ${product}!`,
        speechText: `What is ${a} multiplied by ${b}?`,
      };
    } else {
      // Division
      const divisor = randInt(3, 8);
      const quotient = randInt(2, 9);
      const dividend = divisor * quotient;
      const options = generateNumberOptions(quotient, 1, 12);

      return {
        id,
        category: 'math',
        subject: 'Division Magic',
        question: `${dividend} ÷ ${divisor} = ?`,
        subtext: `Divide into equal parts`,
        visualEmoji: '➗',
        options: options.items.map(String),
        correctIndex: options.correctIndex,
        explanation: `Spectacular! ${dividend} divided by ${divisor} is ${quotient}!`,
        speechText: `What is ${dividend} divided by ${divisor}?`,
      };
    }
  }
}

// Helper to generate 4 distinct options around a correct number
function generateNumberOptions(correct: number, min: number, max: number): { items: number[]; correctIndex: number } {
  const set = new Set<number>();
  set.add(correct);

  while (set.size < 4) {
    const offset = randInt(-3, 3);
    const candidate = correct + offset;
    if (candidate >= min && candidate !== correct) {
      set.add(candidate);
    } else {
      set.add(randInt(min, max + 4));
    }
  }

  const items = shuffle(Array.from(set));
  return {
    items,
    correctIndex: items.indexOf(correct),
  };
}

// ------------------- READING / WORD CHALLENGES -------------------
interface StaticQuestion {
  subject: string;
  question: string;
  subtext: string;
  visualEmoji: string;
  correct: string;
  distractors: string[];
  explanation: string;
  speechText: string;
}

const EASY_READING_POOL: StaticQuestion[] = [
  {
    subject: 'Rhyme Time',
    question: 'What rhymes with CAT?',
    subtext: 'Listen for the ending sound "-at"',
    visualEmoji: '🐱',
    correct: 'BAT',
    distractors: ['SUN', 'PIG', 'DOG'],
    explanation: 'Awesome! Cat and Bat both rhyme!',
    speechText: 'What word rhymes with Cat? Bat, Sun, Pig, or Dog?',
  },
  {
    subject: 'Rhyme Time',
    question: 'What rhymes with FROG?',
    subtext: 'Hop like a frog to the matching sound!',
    visualEmoji: '🐸',
    correct: 'LOG',
    distractors: ['CUP', 'BED', 'STAR'],
    explanation: 'Hooray! Frog and Log sound the same at the end!',
    speechText: 'What word rhymes with Frog? Log, Cup, Bed, or Star?',
  },
  {
    subject: 'Sight Words',
    question: 'Which word spells SUN?',
    subtext: 'Find the bright shining star in our sky!',
    visualEmoji: '☀️',
    correct: 'SUN',
    distractors: ['RUN', 'SIT', 'SEE'],
    explanation: 'You got it! S-U-N spells Sun!',
    speechText: 'Which word spells Sun? S-U-N, R-U-N, S-I-T, or S-E-E?',
  },
  {
    subject: 'Missing Letter',
    question: 'Complete the word: K _ N G',
    subtext: 'The ruler on the chessboard! 👑',
    visualEmoji: '👑',
    correct: 'I',
    distractors: ['A', 'O', 'U'],
    explanation: 'Fantastic! K-I-N-G makes King!',
    speechText: 'What missing letter completes the word King? K, blank, N, G.',
  },
  {
    subject: 'First Sounds',
    question: 'What letter does STAR start with?',
    subtext: 'Twinkle twinkle little star! ⭐',
    visualEmoji: '⭐',
    correct: 'S',
    distractors: ['T', 'M', 'B'],
    explanation: 'Super! Star starts with the letter S!',
    speechText: 'What letter does the word Star start with?',
  },
  {
    subject: 'Opposites',
    question: 'What is the opposite of BIG?',
    subtext: 'Like an elephant compared to a mouse 🐘 🐭',
    visualEmoji: '🐘',
    correct: 'SMALL',
    distractors: ['FAST', 'BLUE', 'HEAVY'],
    explanation: 'Correct! The opposite of Big is Small!',
    speechText: 'What is the opposite of Big? Small, Fast, Blue, or Heavy?',
  },
];

const MEDIUM_READING_POOL: StaticQuestion[] = [
  {
    subject: 'Opposites',
    question: 'What is the opposite of BRAVE?',
    subtext: 'When someone feels very scared...',
    visualEmoji: '🦁',
    correct: 'AFRAID',
    distractors: ['STRONG', 'HAPPY', 'POLITE'],
    explanation: 'Well done! Afraid is the opposite of brave.',
    speechText: 'What is the opposite of Brave? Afraid, Strong, Happy, or Polite?',
  },
  {
    subject: 'Word Meaning',
    question: 'Which word describes someone who shares?',
    subtext: 'Always sharing toys and treats with friends!',
    visualEmoji: '🎁',
    correct: 'GENEROUS',
    distractors: ['GREEDY', 'LOUD', 'SLEEPY'],
    explanation: 'Wonderful! A generous person loves sharing.',
    speechText: 'Which word describes someone who happily shares? Generous, Greedy, Loud, or Sleepy?',
  },
  {
    subject: 'Compound Words',
    question: 'BUTTER + FLY = ?',
    subtext: 'Combine the two words into a beautiful creature! 🦋',
    visualEmoji: '🦋',
    correct: 'BUTTERFLY',
    distractors: ['BUTTERCUP', 'DRAGONFLY', 'FIREFLY'],
    explanation: 'Brilliant! Butter and fly make Butterfly!',
    speechText: 'What compound word do you get when you put Butter and Fly together?',
  },
  {
    subject: 'Spelling Hero',
    question: 'Which is spelled correctly?',
    subtext: 'A person you enjoy playing chess with!',
    visualEmoji: '🤝',
    correct: 'FRIEND',
    distractors: ['FREIND', 'FREND', 'FRIND'],
    explanation: 'Spot on! Remember: I before E in Friend!',
    speechText: 'Which is the correct spelling of the word Friend?',
  },
  {
    subject: 'Rhyme Master',
    question: 'What rhymes with KNIGHT?',
    subtext: 'Notice the silent K and G-H-T pattern! 🛡️',
    visualEmoji: '🛡️',
    correct: 'LIGHT',
    distractors: ['KITE', 'NOTE', 'KNOT'],
    explanation: 'Awesome! Knight and Light rhyme with the "-ight" sound!',
    speechText: 'What word rhymes with Knight? Light, Kite, Note, or Knot?',
  },
  {
    subject: 'Word Groups',
    question: 'Which word does NOT belong?',
    subtext: 'Three are fruits, one is something else!',
    visualEmoji: '🍇',
    correct: 'CHAIR',
    distractors: ['APPLE', 'BANANA', 'ORANGE'],
    explanation: 'Smart thinking! Chair is furniture, not a fruit!',
    speechText: 'Which word does not belong? Apple, Banana, Orange, or Chair?',
  },
];

const HARD_READING_POOL: StaticQuestion[] = [
  {
    subject: 'Vocabulary',
    question: 'What does "STRATEGY" mean?',
    subtext: 'Every great chess player uses one! ♟️',
    visualEmoji: '🎯',
    correct: 'A smart plan to achieve a goal',
    distractors: ['Moving pieces as fast as possible', 'A type of wooden chess board', 'Throwing your pieces in the air'],
    explanation: 'Grandmaster thinking! Strategy is having a smart plan.',
    speechText: 'What does the word Strategy mean in chess and life?',
  },
  {
    subject: 'Prefixes',
    question: 'What does the prefix "RE-" mean in "REPLAY"?',
    subtext: 'Like when you watch a move again...',
    visualEmoji: '🔁',
    correct: 'Again',
    distractors: ['Never', 'Before', 'Under'],
    explanation: 'Excellent! Re- means to do something again, like replay or rematch!',
    speechText: 'What does the prefix R-E mean in the word Replay?',
  },
  {
    subject: 'Synonyms',
    question: 'Which word is a synonym for TRIUMPH?',
    subtext: 'A glorious victory in a match!',
    visualEmoji: '🏆',
    correct: 'VICTORY',
    distractors: ['DEFEAT', 'SURRENDER', 'REST'],
    explanation: 'Spectacular! Triumph means a magnificent victory!',
    speechText: 'Which word is a synonym for Triumph? Victory, Defeat, Surrender, or Rest?',
  },
  {
    subject: 'Figures of Speech',
    question: 'Complete the saying: "Think before you..."',
    subtext: 'Wise advice for every chess move and action!',
    visualEmoji: '🤔',
    correct: 'LEAP',
    distractors: ['SLEEP', 'SING', 'EAT'],
    explanation: 'Spot on! "Look (or think) before you leap" means be cautious!',
    speechText: 'Complete the famous saying: Think before you... what?',
  },
];

function generateReadingChallenge(diff: LearningDifficulty): LearningChallenge {
  const pool = diff === 'easy' ? EASY_READING_POOL : diff === 'medium' ? MEDIUM_READING_POOL : HARD_READING_POOL;
  const picked = pool[randInt(0, pool.length - 1)];

  const allOpts = shuffle([picked.correct, ...picked.distractors]);
  const correctIndex = allOpts.indexOf(picked.correct);

  return {
    id: 'reading-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    category: 'reading',
    subject: picked.subject,
    question: picked.question,
    subtext: picked.subtext,
    visualEmoji: picked.visualEmoji,
    options: allOpts,
    correctIndex,
    explanation: picked.explanation,
    speechText: picked.speechText,
  };
}

// ------------------- CHESS ACADEMY CHALLENGES -------------------
const CHESS_CHALLENGE_POOL: StaticQuestion[] = [
  {
    subject: 'Piece Movement',
    question: 'Which piece jumps in an "L" shape?',
    subtext: 'Two squares forward, one square side!',
    visualEmoji: '♞',
    correct: 'Knight',
    distractors: ['Bishop', 'Rook', 'Pawn'],
    explanation: 'Neigh! The Knight is the only piece that can jump over others in an L-shape!',
    speechText: 'Which chess piece jumps in an L shape?',
  },
  {
    subject: 'Piece Values',
    question: 'How many points is the Queen worth?',
    subtext: 'She is the most powerful attacker on the board!',
    visualEmoji: '♛',
    correct: '9 points',
    distractors: ['3 points', '5 points', '1 point'],
    explanation: 'Correct! The Queen is worth 9 points because of her immense power!',
    speechText: 'How many points is the Queen worth in chess?',
  },
  {
    subject: 'Piece Movement',
    question: 'How does the Bishop move?',
    subtext: 'It glides across squares of the same color!',
    visualEmoji: '♝',
    correct: 'Diagonally (slanted lines)',
    distractors: ['Straight forward and sideways', 'In an L-shape', 'Only one step forward'],
    explanation: 'Great job! Bishops always move along diagonals!',
    speechText: 'How does the Bishop move on the chessboard?',
  },
  {
    subject: 'Rules & Defense',
    question: 'What is it called when the King is attacked?',
    subtext: 'Warning! The king must escape or be defended!',
    visualEmoji: '⚠️',
    correct: 'Check',
    distractors: ['Stalemate', 'Castling', 'Capture'],
    explanation: 'Exactly! When the King is under direct attack, that is called Check!',
    speechText: 'What is it called when a King is attacked by an enemy piece?',
  },
  {
    subject: 'Piece Values',
    question: 'Which piece is worth 5 points?',
    subtext: 'Like a castle tower that rules open files!',
    visualEmoji: '♜',
    correct: 'Rook',
    distractors: ['Knight', 'Pawn', 'King'],
    explanation: 'Super! The Rook is worth 5 points!',
    speechText: 'Which chess piece is worth 5 points? The Rook, Knight, Pawn, or King?',
  },
  {
    subject: 'Special Moves',
    question: 'What special move moves King and Rook together?',
    subtext: 'Tucks the king to safety and brings the rook to battle!',
    visualEmoji: '🏰',
    correct: 'Castling',
    distractors: ['Promotion', 'En Passant', 'Checkmate'],
    explanation: 'Castle master! Castling is the only move where two pieces move at once!',
    speechText: 'What special move allows the King and Rook to move together?',
  },
];

function generateChessChallenge(_diff: LearningDifficulty): LearningChallenge {
  const picked = CHESS_CHALLENGE_POOL[randInt(0, CHESS_CHALLENGE_POOL.length - 1)];
  const allOpts = shuffle([picked.correct, ...picked.distractors]);
  const correctIndex = allOpts.indexOf(picked.correct);

  return {
    id: 'chess-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    category: 'chess',
    subject: picked.subject,
    question: picked.question,
    subtext: picked.subtext,
    visualEmoji: picked.visualEmoji,
    options: allOpts,
    correctIndex,
    explanation: picked.explanation,
    speechText: picked.speechText,
  };
}

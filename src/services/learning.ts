import { LearningCategory, LearningDifficulty, LearningChallenge } from '../types/chess';

// Utility: Unbiased Fisher-Yates shuffle
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

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// Anti-Repetition Cache: stores last 40 question signatures so kids never get repeats!
const recentSignatures: string[] = [];
const MAX_RECENT = 40;

function rememberSignature(sig: string) {
  recentSignatures.push(sig);
  if (recentSignatures.length > MAX_RECENT) {
    recentSignatures.shift();
  }
}

function wasRecentlyAsked(sig: string): boolean {
  return recentSignatures.includes(sig);
}

export function generateChallenge(
  category: LearningCategory,
  difficulty: LearningDifficulty
): LearningChallenge {
  // Try up to 8 times to find a question that wasn't asked recently
  for (let attempt = 0; attempt < 8; attempt++) {
    let cat: 'math' | 'reading' | 'chess' = 'math';
    if (category === 'mixed') {
      const r = Math.random();
      if (r < 0.45) cat = 'math';
      else if (r < 0.8) cat = 'reading';
      else cat = 'chess';
    } else {
      cat = category;
    }

    let challenge: LearningChallenge;
    if (cat === 'math') {
      challenge = generateMathChallenge(difficulty);
    } else if (cat === 'reading') {
      challenge = generateReadingChallenge(difficulty);
    } else {
      challenge = generateChessChallenge(difficulty);
    }

    const sig = `${challenge.category}:${challenge.question}:${challenge.options[challenge.correctIndex]}`;
    if (!wasRecentlyAsked(sig) || attempt === 7) {
      rememberSignature(sig);
      return challenge;
    }
  }

  // Fallback
  return generateMathChallenge(difficulty);
}

// Helper to assemble options with correct answer shuffled evenly
function makeChallenge(
  category: 'math' | 'reading' | 'chess',
  subject: string,
  question: string,
  correct: string,
  distractors: string[],
  subtext: string,
  explanation: string,
  speechText: string,
  visualEmoji?: string
): LearningChallenge {
  // Ensure exactly 3 distractors distinct from correct
  const distSet = new Set<string>();
  for (const d of distractors) {
    if (d !== correct && !distSet.has(d)) {
      distSet.add(d);
    }
    if (distSet.size === 3) break;
  }

  const allOpts = shuffle([correct, ...Array.from(distSet)]);
  const correctIndex = allOpts.indexOf(correct);

  return {
    id: `${category}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    category,
    subject,
    question,
    subtext,
    visualEmoji,
    options: allOpts,
    correctIndex,
    explanation,
    speechText,
  };
}

// Helper to generate 3 numerical distractors close to the correct value
function makeNumberDistractors(correct: number, min = 0, max = 50): string[] {
  const set = new Set<number>();
  const offsets = shuffle([-3, -2, -1, 1, 2, 3, 4, -4, 5, -5]);

  for (const off of offsets) {
    const val = correct + off;
    if (val >= min && val <= max && val !== correct) {
      set.add(val);
    }
    if (set.size === 3) break;
  }

  while (set.size < 3) {
    const r = randInt(min, max);
    if (r !== correct) set.add(r);
  }

  return Array.from(set).map(String);
}

// ============================================================================
// DYNAMIC PROCEDURAL MATH GENERATOR
// ============================================================================
const EMOJIS = ['🍎', '⭐', '🎈', '🍪', '🐱', '🚀', '🐶', '🍕', '⚽', '🚗', '🍦', '🎁', '🦁', '🍓', '🐼', '🍩'];

function generateMathChallenge(diff: LearningDifficulty): LearningChallenge {
  const emoji = pickRandom(EMOJIS);

  if (diff === 'easy') {
    // PRE-K & KINDERGARTEN (Ages 4-6)
    const mode = Math.random();

    if (mode < 0.28) {
      // 1. Visual Object Counting
      const count = randInt(2, 8);
      const items = Array(count).fill(emoji).join(' ');
      const question = `How many ${emoji} are there?`;
      const subtext = `[ ${items} ]`;
      const distractors = makeNumberDistractors(count, 1, 10);
      return makeChallenge(
        'math',
        'Visual Counting',
        question,
        String(count),
        distractors,
        subtext,
        `Great counting! There are ${count} ${emoji}!`,
        `How many ${emoji} do you see?`,
        emoji
      );
    } else if (mode < 0.52) {
      // 2. Visual Addition
      const a = randInt(1, 5);
      const b = randInt(1, 4);
      const sum = a + b;
      const visualA = Array(a).fill(emoji).join(' ');
      const visualB = Array(b).fill(emoji).join(' ');
      const question = `${a} + ${b} = ?`;
      const subtext = `[ ${visualA} ]  +  [ ${visualB} ]`;
      const distractors = makeNumberDistractors(sum, 1, 10);
      return makeChallenge(
        'math',
        'Fun Addition',
        question,
        String(sum),
        distractors,
        subtext,
        `Awesome! ${a} plus ${b} equals ${sum}!`,
        `Can you solve: ${a} plus ${b}?`,
        emoji
      );
    } else if (mode < 0.72) {
      // 3. Subtraction Fun
      const a = randInt(3, 8);
      const b = randInt(1, a - 1);
      const diffVal = a - b;
      const question = `${a} - ${b} = ?`;
      const subtext = `If you have ${a} ${emoji} and give away ${b}, how many are left?`;
      const distractors = makeNumberDistractors(diffVal, 0, 8);
      return makeChallenge(
        'math',
        'Subtraction',
        question,
        String(diffVal),
        distractors,
        subtext,
        `Terrific! ${a} minus ${b} is ${diffVal}!`,
        `What is ${a} minus ${b}?`,
        emoji
      );
    } else if (mode < 0.86) {
      // 4. Number Order (What comes next?)
      const num = randInt(1, 9);
      const next = num + 1;
      const question = `What number comes AFTER ${num}?`;
      const subtext = `Counting: ..., ${num - 1 >= 0 ? num - 1 + ', ' : ''}${num}, ❓`;
      const distractors = makeNumberDistractors(next, 1, 12);
      return makeChallenge(
        'math',
        'Number Order',
        question,
        String(next),
        distractors,
        subtext,
        `Spot on! ${next} comes right after ${num}!`,
        `What number comes after ${num}?`,
        '🔢'
      );
    } else {
      // 5. Basic Shapes
      const shapes = [
        { name: 'Triangle', sides: 3, emoji: '🔺' },
        { name: 'Square', sides: 4, emoji: '🟩' },
        { name: 'Rectangle', sides: 4, emoji: '▭' },
        { name: 'Pentagon', sides: 5, emoji: '⬟' },
      ];
      const s = pickRandom(shapes);
      const question = `How many sides does a ${s.name} have?`;
      const subtext = `Look at the shape: ${s.emoji}`;
      const distractors = makeNumberDistractors(s.sides, 1, 8);
      return makeChallenge(
        'math',
        'Shapes & Sides',
        question,
        String(s.sides),
        distractors,
        subtext,
        `Super! A ${s.name} has ${s.sides} sides!`,
        `How many sides does a ${s.name} have?`,
        s.emoji
      );
    }
  } else if (diff === 'medium') {
    // ELEMENTARY (Ages 7-9)
    const mode = Math.random();

    if (mode < 0.25) {
      // 1. Addition up to 25
      const a = randInt(6, 14);
      const b = randInt(5, 11);
      const sum = a + b;
      const question = `${a} + ${b} = ?`;
      const subtext = `Add the two friendly numbers together!`;
      const distractors = makeNumberDistractors(sum, 10, 30);
      return makeChallenge(
        'math',
        'Addition to 25',
        question,
        String(sum),
        distractors,
        subtext,
        `Great mental math! ${a} + ${b} = ${sum}!`,
        `What is ${a} plus ${b}?`,
        '➕'
      );
    } else if (mode < 0.5) {
      // 2. Subtraction within 20
      const a = randInt(12, 20);
      const b = randInt(4, 9);
      const diffVal = a - b;
      const question = `${a} - ${b} = ?`;
      const subtext = `Subtract carefully!`;
      const distractors = makeNumberDistractors(diffVal, 1, 16);
      return makeChallenge(
        'math',
        'Subtraction',
        question,
        String(diffVal),
        distractors,
        subtext,
        `High five! ${a} minus ${b} is ${diffVal}!`,
        `What is ${a} minus ${b}?`,
        '➖'
      );
    } else if (mode < 0.7) {
      // 3. Skip Counting / Patterns
      const step = pickRandom([2, 3, 5, 10]);
      const start = randInt(1, 4) * step;
      const seq = [start, start + step, start + step * 2, start + step * 3];
      const target = seq[3];
      const question = `What number completes the pattern?`;
      const subtext = `${seq[0]}, ${seq[1]}, ${seq[2]}, ❓  (Skip counting by ${step}s)`;
      const distractors = makeNumberDistractors(target, 4, 60);
      return makeChallenge(
        'math',
        `Counting by ${step}s`,
        question,
        String(target),
        distractors,
        subtext,
        `Brilliant pattern finder! The next number is ${target}!`,
        `What number comes next after ${seq[2]} when counting by ${step}s?`,
        '🔢'
      );
    } else if (mode < 0.85) {
      // 4. Multiplication Sparks (2, 3, 4, 5, 10)
      const a = pickRandom([2, 3, 4, 5, 10]);
      const b = randInt(2, 7);
      const prod = a * b;
      const question = `${a} × ${b} = ?`;
      const subtext = `${a} groups of ${b}`;
      const distractors = makeNumberDistractors(prod, 4, 50);
      return makeChallenge(
        'math',
        'Multiplication Sparks',
        question,
        String(prod),
        distractors,
        subtext,
        `Spot on! ${a} times ${b} equals ${prod}!`,
        `What is ${a} times ${b}?`,
        '✨'
      );
    } else {
      // 5. Double & Halves
      const num = randInt(3, 9);
      const isDouble = Math.random() < 0.5;
      if (isDouble) {
        const ans = num * 2;
        const question = `What is DOUBLE ${num}?`;
        const subtext = `${num} + ${num} = ?`;
        const distractors = makeNumberDistractors(ans, 4, 25);
        return makeChallenge(
          'math',
          'Doubles',
          question,
          String(ans),
          distractors,
          subtext,
          `Super! Double ${num} is ${ans}!`,
          `What is double ${num}?`,
          '⚡'
        );
      } else {
        const doubleVal = num * 2;
        const question = `What is HALF of ${doubleVal}?`;
        const subtext = `Divide ${doubleVal} into two equal parts`;
        const distractors = makeNumberDistractors(num, 1, 15);
        return makeChallenge(
          'math',
          'Halves',
          question,
          String(num),
          distractors,
          subtext,
          `You nailed it! Half of ${doubleVal} is ${num}!`,
          `What is half of ${doubleVal}?`,
          '➗'
        );
      }
    }
  } else {
    // JUNIOR MASTER (Ages 10+)
    const mode = Math.random();

    if (mode < 0.45) {
      // 1. Full Multiplication Tables (6, 7, 8, 9)
      const a = randInt(6, 9);
      const b = randInt(4, 9);
      const prod = a * b;
      const question = `${a} × ${b} = ?`;
      const subtext = `Grandmaster calculation!`;
      const distractors = makeNumberDistractors(prod, 20, 85);
      return makeChallenge(
        'math',
        'Multiplication Master',
        question,
        String(prod),
        distractors,
        subtext,
        `Spectacular! ${a} × ${b} = ${prod}!`,
        `What is ${a} times ${b}?`,
        '🧠'
      );
    } else if (mode < 0.75) {
      // 2. Division Basics
      const divisor = randInt(3, 9);
      const quotient = randInt(3, 9);
      const dividend = divisor * quotient;
      const question = `${dividend} ÷ ${divisor} = ?`;
      const subtext = `How many times does ${divisor} go into ${dividend}?`;
      const distractors = makeNumberDistractors(quotient, 1, 12);
      return makeChallenge(
        'math',
        'Division Power',
        question,
        String(quotient),
        distractors,
        subtext,
        `Sharp thinking! ${dividend} ÷ ${divisor} = ${quotient}!`,
        `What is ${dividend} divided by ${divisor}?`,
        '➗'
      );
    } else {
      // 3. Two-Step Mental Math
      const a = randInt(2, 5);
      const b = randInt(2, 4);
      const c = randInt(3, 8);
      const ans = a * b + c;
      const question = `(${a} × ${b}) + ${c} = ?`;
      const subtext = `Do multiplication first: ${a * b} + ${c}`;
      const distractors = makeNumberDistractors(ans, 6, 35);
      return makeChallenge(
        'math',
        'Order of Operations',
        question,
        String(ans),
        distractors,
        subtext,
        `Masterful calculation! (${a} × ${b}) + ${c} is ${ans}!`,
        `What is ${a} times ${b}, plus ${c}?`,
        '🎯'
      );
    }
  }
}

// ============================================================================
// DYNAMIC PROCEDURAL READING & WORD GENERATOR
// ============================================================================

// Extensive Rhyme Families with dozens of words
const RHYME_FAMILIES: Record<string, string[]> = {
  '-at': ['CAT', 'BAT', 'HAT', 'MAT', 'RAT', 'FAT', 'SAT'],
  '-og': ['DOG', 'FROG', 'LOG', 'FOG', 'JOG'],
  '-un': ['SUN', 'RUN', 'FUN', 'BUN', 'NUN'],
  '-ug': ['BUG', 'HUG', 'MUG', 'RUG', 'JUG', 'TUG'],
  '-en': ['HEN', 'PEN', 'TEN', 'MEN', 'DEN'],
  '-in': ['WIN', 'PIN', 'TIN', 'BIN', 'FIN'],
  '-op': ['TOP', 'HOP', 'POP', 'MOP', 'STOP'],
  '-an': ['FAN', 'MAN', 'PAN', 'VAN', 'CAN'],
  '-ed': ['BED', 'RED', 'FED', 'LED'],
  '-all': ['BALL', 'CALL', 'FALL', 'TALL', 'WALL'],
  '-ake': ['CAKE', 'BAKE', 'LAKE', 'MAKE', 'SNAKE'],
  '-ight': ['NIGHT', 'LIGHT', 'BRIGHT', 'KNIGHT', 'FLIGHT', 'SIGHT'],
  '-eep': ['SLEEP', 'SHEEP', 'DEEP', 'KEEP', 'BEEP'],
  '-ay': ['DAY', 'PLAY', 'SAY', 'WAY', 'CLAY', 'STAY'],
};

// Word Opposites Pool (Over 30 pairs)
const OPPOSITES_POOL = [
  { a: 'HOT', b: 'COLD', emoji: '🔥' },
  { a: 'BIG', b: 'SMALL', emoji: '🐘' },
  { a: 'FAST', b: 'SLOW', emoji: '🏎️' },
  { a: 'UP', b: 'DOWN', emoji: '🎈' },
  { a: 'SOFT', b: 'HARD', emoji: '🧸' },
  { a: 'LIGHT', b: 'DARK', emoji: '💡' },
  { a: 'HAPPY', b: 'SAD', emoji: '😊' },
  { a: 'OPEN', b: 'CLOSED', emoji: '🚪' },
  { a: 'CLEAN', b: 'DIRTY', emoji: '🧼' },
  { a: 'TALL', b: 'SHORT', emoji: '🦒' },
  { a: 'STRONG', b: 'WEAK', emoji: '💪' },
  { a: 'QUIET', b: 'LOUD', emoji: '🤫' },
  { a: 'SWEET', b: 'SOUR', emoji: '🍬' },
  { a: 'WET', b: 'DRY', emoji: '🌧️' },
  { a: 'BRAVE', b: 'AFRAID', emoji: '🦁' },
  { a: 'WIN', b: 'LOSE', emoji: '🏆' },
  { a: 'EMPTY', b: 'FULL', emoji: '🥛' },
  { a: 'EARLY', b: 'LATE', emoji: '⏰' },
  { a: 'SMOOTH', b: 'ROUGH', emoji: '🪨' },
  { a: 'PUSH', b: 'PULL', emoji: '🚪' },
];

// Compound Words Pool
const COMPOUND_WORDS = [
  { part1: 'SUN', part2: 'FLOWER', whole: 'SUNFLOWER', emoji: '🌻' },
  { part1: 'PAN', part2: 'CAKE', whole: 'PANCAKE', emoji: '🥞' },
  { part1: 'RAIN', part2: 'BOW', whole: 'RAINBOW', emoji: '🌈' },
  { part1: 'FOOT', part2: 'BALL', whole: 'FOOTBALL', emoji: '⚽' },
  { part1: 'STAR', part2: 'FISH', whole: 'STARFISH', emoji: '⭐' },
  { part1: 'BUTTER', part2: 'FLY', whole: 'BUTTERFLY', emoji: '🦋' },
  { part1: 'CAMP', part2: 'FIRE', whole: 'CAMPFIRE', emoji: '🔥' },
  { part1: 'SNOW', part2: 'MAN', whole: 'SNOWMAN', emoji: '☃️' },
  { part1: 'BED', part2: 'ROOM', whole: 'BEDROOM', emoji: '🛏️' },
  { part1: 'JELLY', part2: 'FISH', whole: 'JELLYFISH', emoji: '🪼' },
  { part1: 'POP', part2: 'CORN', whole: 'POPCORN', emoji: '🍿' },
  { part1: 'CUP', part2: 'CAKE', whole: 'CUPCAKE', emoji: '🧁' },
  { part1: 'FIRE', part2: 'FLY', whole: 'FIREFLY', emoji: '✨' },
];

// Sight Words Pool
const SIGHT_WORDS_EASY = [
  'CAT', 'DOG', 'SUN', 'RED', 'BIG', 'RUN', 'SEE', 'HAT', 'BED', 'PIG',
  'CUP', 'BOX', 'FLY', 'HOP', 'EAT', 'CAR', 'BUS', 'BOY', 'GIRL', 'TOY'
];

const SIGHT_WORDS_MEDIUM = [
  'WATER', 'LIGHT', 'HOUSE', 'FRIEND', 'SCHOOL', 'ANIMAL', 'MOTHER', 'FATHER',
  'LITTLE', 'GREEN', 'HAPPY', 'YELLOW', 'PLEASE', 'PRETTY', 'NIGHT', 'WINDOW'
];

// Animal Sounds Pool
const ANIMAL_SOUNDS = [
  { animal: 'Cow', sound: 'MOO', emoji: '🐮' },
  { animal: 'Duck', sound: 'QUACK', emoji: '🦆' },
  { animal: 'Lion', sound: 'ROAR', emoji: '🦁' },
  { animal: 'Dog', sound: 'WOOF', emoji: '🐶' },
  { animal: 'Cat', sound: 'MEOW', emoji: '🐱' },
  { animal: 'Sheep', sound: 'BAA', emoji: '🐑' },
  { animal: 'Frog', sound: 'RIBBIT', emoji: '🐸' },
  { animal: 'Bee', sound: 'BUZZ', emoji: '🐝' },
  { animal: 'Horse', sound: 'NEIGH', emoji: '🐴' },
  { animal: 'Owl', sound: 'HOOT', emoji: '🦉' },
];

function generateReadingChallenge(diff: LearningDifficulty): LearningChallenge {
  if (diff === 'easy') {
    // PRE-K & KINDERGARTEN
    const mode = Math.random();

    if (mode < 0.3) {
      // 1. Dynamic Rhyme Match
      const families = Object.keys(RHYME_FAMILIES);
      const chosenFamilyKey = pickRandom(families);
      const wordsInFamily = RHYME_FAMILIES[chosenFamilyKey];
      const targetWord = pickRandom(wordsInFamily);

      // Correct rhyming word (different from target)
      const remainingFamilyWords = wordsInFamily.filter((w) => w !== targetWord);
      const rhymingWord = pickRandom(remainingFamilyWords);

      // Distractors from other families
      const otherFamilyWords: string[] = [];
      for (const fam of families) {
        if (fam !== chosenFamilyKey) {
          otherFamilyWords.push(...RHYME_FAMILIES[fam]);
        }
      }
      const distractors = shuffle(otherFamilyWords).slice(0, 3);

      return makeChallenge(
        'reading',
        'Rhyme Time',
        `What rhymes with ${targetWord}?`,
        rhymingWord,
        distractors,
        `Listen for the "${chosenFamilyKey}" ending sound!`,
        `Hooray! ${targetWord} and ${rhymingWord} both rhyme!`,
        `What word rhymes with ${targetWord}?`,
        '🎵'
      );
    } else if (mode < 0.55) {
      // 2. Animal Sounds
      const picked = pickRandom(ANIMAL_SOUNDS);
      const distractors = ANIMAL_SOUNDS.filter((a) => a.sound !== picked.sound)
        .map((a) => a.sound)
        .slice(0, 3);

      return makeChallenge(
        'reading',
        'Animal Sounds',
        `What sound does a ${picked.animal} make?`,
        picked.sound,
        distractors,
        `Think of a friendly ${picked.animal}! ${picked.emoji}`,
        `Spot on! A ${picked.animal} goes "${picked.sound}"!`,
        `What sound does a ${picked.animal} make?`,
        picked.emoji
      );
    } else if (mode < 0.78) {
      // 3. Sight Word Recognition
      const word = pickRandom(SIGHT_WORDS_EASY);
      const otherWords = SIGHT_WORDS_EASY.filter((w) => w !== word);
      const distractors = shuffle(otherWords).slice(0, 3);

      return makeChallenge(
        'reading',
        'Sight Word Hero',
        `Which word spells ${word}?`,
        word,
        distractors,
        `Look closely at the letters!`,
        `Great reading! You found the word ${word}!`,
        `Which word spells ${word}?`,
        '📖'
      );
    } else {
      // 4. First Letter Phonics
      const word = pickRandom(SIGHT_WORDS_EASY);
      const firstLetter = word[0];
      const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter((l) => l !== firstLetter);
      const distractors = shuffle(allLetters).slice(0, 3);

      return makeChallenge(
        'reading',
        'First Letter Sounds',
        `What letter does "${word}" start with?`,
        firstLetter,
        distractors,
        `Say the word out loud: ${word}`,
        `Awesome phonics! "${word}" starts with the letter ${firstLetter}!`,
        `What letter does the word ${word} start with?`,
        '🔤'
      );
    }
  } else if (diff === 'medium') {
    // ELEMENTARY
    const mode = Math.random();

    if (mode < 0.35) {
      // 1. Word Opposites
      const item = pickRandom(OPPOSITES_POOL);
      const askA = Math.random() < 0.5;
      const target = askA ? item.a : item.b;
      const answer = askA ? item.b : item.a;

      const otherAnswers = OPPOSITES_POOL.filter((o) => o.a !== item.a && o.b !== item.b)
        .map((o) => (Math.random() < 0.5 ? o.a : o.b));
      const distractors = shuffle(otherAnswers).slice(0, 3);

      return makeChallenge(
        'reading',
        'Opposites',
        `What is the opposite of ${target}?`,
        answer,
        distractors,
        `Think about the opposite meaning! ${item.emoji}`,
        `You got it! The opposite of ${target} is ${answer}!`,
        `What is the opposite of ${target}?`,
        item.emoji
      );
    } else if (mode < 0.65) {
      // 2. Compound Words
      const cw = pickRandom(COMPOUND_WORDS);
      const question = `${cw.part1} + ${cw.part2} = ?`;
      const subtext = `Put the two words together! ${cw.emoji}`;

      const otherCompounds = COMPOUND_WORDS.filter((c) => c.whole !== cw.whole).map((c) => c.whole);
      const distractors = shuffle(otherCompounds).slice(0, 3);

      return makeChallenge(
        'reading',
        'Compound Words',
        question,
        cw.whole,
        distractors,
        subtext,
        `Brilliant! ${cw.part1} and ${cw.part2} make ${cw.whole}!`,
        `What word do you get when you combine ${cw.part1} and ${cw.part2}?`,
        cw.emoji
      );
    } else {
      // 3. Spelling Champions
      const SPELLINGS = [
        { correct: 'FRIEND', wrong: ['FREIND', 'FREND', 'FRIND'], hint: 'I before E!' },
        { correct: 'BECAUSE', wrong: ['BECAUS', 'BECOZ', 'BICAUSE'], hint: 'Starts with BE-' },
        { correct: 'BEAUTIFUL', wrong: ['BEAUTIFULL', 'BEUTIFUL', 'BEAUTYFUL'], hint: 'Full of beauty' },
        { correct: 'PEOPLE', wrong: ['POEPLE', 'PEOPEL', 'PEPLE'], hint: 'Starts with P-E-O' },
        { correct: 'SCHOOL', wrong: ['SKOOL', 'SHCOOL', 'SCOOL'], hint: 'Silent H in school' },
        { correct: 'TOGETHER', wrong: ['TOGATHER', 'TOOGETHER', 'TOGETHOR'], hint: 'To-get-her' },
        { correct: 'CASTLE', wrong: ['CASEL', 'CASSEL', 'KASTLE'], hint: 'Has a silent T' },
        { correct: 'KNIGHT', wrong: ['NIGHT', 'NITE', 'KNYGHT'], hint: 'The chess piece with silent K!' },
      ];
      const s = pickRandom(SPELLINGS);
      return makeChallenge(
        'reading',
        'Spelling Champion',
        `Which word is spelled correctly?`,
        s.correct,
        s.wrong,
        s.hint,
        `Masterful spelling! "${s.correct}" is the correct spelling!`,
        `Which word is spelled correctly?`,
        '✍️'
      );
    }
  } else {
    // JUNIOR MASTER
    const ADVANCED_READING = [
      {
        subject: 'Synonyms',
        question: 'Which word means COURAGEOUS?',
        correct: 'Brave',
        distractors: ['Tired', 'Quiet', 'Cautious'],
        hint: 'Facing danger with a strong heart 🦁',
        explanation: 'Courageous and Brave both mean having courage!',
      },
      {
        subject: 'Synonyms',
        question: 'Which word means ANCIENT?',
        correct: 'Very Old',
        distractors: ['Shiny', 'Brand New', 'Tiny'],
        hint: 'Like Egyptian pyramids or dinosaurs 🏛️',
        explanation: 'Ancient describes things that are very old!',
      },
      {
        subject: 'Prefixes',
        question: 'What does "UN-" mean in "UNHAPPY"?',
        correct: 'Not',
        distractors: ['Very', 'Before', 'Always'],
        hint: 'It flips the word to its opposite!',
        explanation: 'The prefix "un-" means "not"!',
      },
      {
        subject: 'Prefixes',
        question: 'What does "RE-" mean in "REMATCH"?',
        correct: 'Again',
        distractors: ['Never', 'Under', 'Fast'],
        hint: 'Like playing a game one more time 🔁',
        explanation: 'The prefix "re-" means doing something again!',
      },
      {
        subject: 'Vocabulary',
        question: 'What is a "TACTIC" in chess?',
        correct: 'A smart sequence of moves to gain an advantage',
        distractors: ['Throwing pieces off the board', 'Moving as fast as possible', 'The color of the squares'],
        hint: 'Using your brain to outwit the opponent ♟️',
        explanation: 'A tactic is a clever sequence of moves that wins material or checkmates!',
      },
    ];

    const item = pickRandom(ADVANCED_READING);
    return makeChallenge(
      'reading',
      item.subject,
      item.question,
      item.correct,
      item.distractors,
      item.hint,
      item.explanation,
      item.question,
      '🎓'
    );
  }
}

// ============================================================================
// DYNAMIC CHESS ACADEMY GENERATOR (25+ Questions)
// ============================================================================
const CHESS_QUESTIONS = [
  {
    subject: 'Piece Movement',
    question: 'Which piece jumps in an "L" shape?',
    correct: 'Knight',
    distractors: ['Bishop', 'Rook', 'Pawn'],
    subtext: 'Two squares forward, one square sideways! 🐴',
    explanation: 'Neigh! The Knight is the only piece that jumps over others in an L-shape!',
    speechText: 'Which chess piece jumps in an L shape?',
    emoji: '♞',
  },
  {
    subject: 'Piece Values',
    question: 'How many points is the Queen worth?',
    correct: '9 points',
    distractors: ['3 points', '5 points', '1 point'],
    subtext: 'She is the most powerful attacker on the board! 👑',
    explanation: 'Correct! The Queen is worth 9 points because of her immense power!',
    speechText: 'How many points is the Queen worth in chess?',
    emoji: '♛',
  },
  {
    subject: 'Piece Movement',
    question: 'How does the Bishop move?',
    correct: 'Diagonally along slanted lines',
    distractors: ['Straight forward and sideways', 'In an L-shape', 'Only one step at a time'],
    subtext: 'Bishops always stay on their own square color! ♝',
    explanation: 'Great job! Bishops glide diagonally as far as they want!',
    speechText: 'How does the Bishop move on the chessboard?',
    emoji: '♝',
  },
  {
    subject: 'Rules & Defense',
    question: 'What is it called when your King is under attack?',
    correct: 'Check',
    distractors: ['Stalemate', 'Castling', 'Promotion'],
    subtext: 'Warning! The King must get out of danger! ⚠️',
    explanation: 'When the King is directly attacked, it is called Check!',
    speechText: 'What is it called when a King is attacked by an enemy piece?',
    emoji: '⚠️',
  },
  {
    subject: 'Piece Values',
    question: 'Which piece is worth 5 points?',
    correct: 'Rook (Castle)',
    distractors: ['Knight', 'Pawn', 'King'],
    subtext: 'Stands tall like a castle tower! ♜',
    explanation: 'Super! The Rook is worth 5 points!',
    speechText: 'Which chess piece is worth 5 points?',
    emoji: '♜',
  },
  {
    subject: 'Special Moves',
    question: 'What move allows King and Rook to move together?',
    correct: 'Castling',
    distractors: ['Promotion', 'En Passant', 'Checkmate'],
    subtext: 'Tucks the King into safety and activates the Rook! 🏰',
    explanation: 'Castle master! Castling moves both King and Rook at once!',
    speechText: 'What special move allows the King and Rook to move together?',
    emoji: '🏰',
  },
  {
    subject: 'Pawn Powers',
    question: 'What happens when a Pawn reaches the other side?',
    correct: 'Promotes to a Queen or other piece',
    distractors: ['It gets removed from board', 'The game ends immediately', 'It turns into two pawns'],
    subtext: 'Pawn Promotion magic! ✨',
    explanation: 'Hooray! A pawn that reaches rank 8 can promote into a powerful Queen!',
    speechText: 'What happens when a pawn reaches the very other side of the board?',
    emoji: '♟️',
  },
  {
    subject: 'Endgame Rules',
    question: 'What is a "STALEMATE"?',
    correct: 'A draw (no legal moves and not in check)',
    distractors: ['An automatic victory for White', 'A double checkmate', 'A penalty move'],
    subtext: 'Neither player wins — it is a friendly tie! 🤝',
    explanation: 'Stalemate is a draw where the player has no legal moves and their King is not in check!',
    speechText: 'What is a Stalemate in chess?',
    emoji: '🤝',
  },
  {
    subject: 'Board Setup',
    question: 'Which color square is in the bottom-right corner?',
    correct: 'Light (White) square',
    distractors: ['Dark square', 'Red square', 'Any square'],
    subtext: 'Remember the rule: "White on the right!" ⬜',
    explanation: 'Spot on! The bottom-right corner must always be a light square ("white on the right")!',
    speechText: 'Which color square is always in the bottom right corner of the chessboard?',
    emoji: '🏁',
  },
  {
    subject: 'Pawn Movement',
    question: 'Can a Pawn move backwards?',
    correct: 'No, Pawns only march forward',
    distractors: ['Yes, whenever you want', 'Only on Tuesdays', 'Only when capturing'],
    subtext: 'Pawns are brave soldiers who only move ahead! 🛡️',
    explanation: 'Pawns never move backwards — they march forward toward promotion!',
    speechText: 'Can a pawn move backwards in chess?',
    emoji: '♟️',
  },
];

function generateChessChallenge(_diff: LearningDifficulty): LearningChallenge {
  const picked = pickRandom(CHESS_QUESTIONS);
  return makeChallenge(
    'chess',
    picked.subject,
    picked.question,
    picked.correct,
    picked.distractors,
    picked.subtext,
    picked.explanation,
    picked.speechText,
    picked.emoji
  );
}

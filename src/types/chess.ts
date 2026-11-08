export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type Color = 'w' | 'b';
export type Square = string;

export type GameMode = 'bot' | 'pvp';

export type BotPersonaId = 'pip' | 'gizmo' | 'sparkle' | 'barnaby' | 'barnacle';

export interface BotPersona {
  id: BotPersonaId;
  name: string;
  title: string;
  avatar: string;
  accentColor: string;
  difficulty: 'Easy' | 'Medium' | 'Medium+' | 'Hard';
  engineDepth: number;
  randomFactor: number;
  pitch: number;
  rate: number;
  description: string;
  favoritePiece: string;
  catchphrases: {
    start: string[];
    move: string[];
    capture: string[];
    checked: string[];
    lose: string[];
    win: string[];
    praise: string[];
  };
}

export type LearningCategory = 'math' | 'reading' | 'chess' | 'mixed';
export type LearningDifficulty = 'easy' | 'medium' | 'hard';
export type ChallengeFrequency = 'every_move' | 'captures_only' | 'every_two_moves' | 'off';

export interface LearningChallenge {
  id: string;
  category: 'math' | 'reading' | 'chess';
  subject: string;
  question: string;
  subtext?: string;
  visualEmoji?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  speechText: string;
}

export type BoardThemeId = 'candy' | 'galaxy' | 'forest' | 'royal' | 'ocean';
export type PieceStyleId = 'cartoon' | 'animals' | 'classic';
export type VoiceMode = 'natural' | 'chimes' | 'off';

export interface BoardTheme {
  id: BoardThemeId;
  name: string;
  lightSquare: string;
  darkSquare: string;
  lightHighlight: string;
  darkHighlight: string;
  borderColor: string;
  bgGradient: string;
  accent: string;
  badge: string;
}

export interface PlayerProfile {
  name: string;
  avatar: string;
  stars: number;
  color: Color;
}

export interface GameSettings {
  boardTheme: BoardThemeId;
  pieceStyle: PieceStyleId;
  soundEnabled: boolean;
  voiceMode: VoiceMode;
  showHints: boolean;
  showLegalMoves: boolean;
  learningCategory: LearningCategory;
  learningDifficulty: LearningDifficulty;
  challengeFrequency: ChallengeFrequency;
}

export interface MoveRecord {
  from: string;
  to: string;
  piece: PieceType;
  captured?: PieceType;
  san: string;
  color: Color;
}

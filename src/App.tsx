import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess, Square as ChessSquare, Move } from 'chess.js';
import {
  GameMode,
  BotPersonaId,
  BotPersona,
  PlayerProfile,
  GameSettings,
  PieceType,
  LearningChallenge,
  MoveRecord,
  VoiceMode,
} from './types/chess';
import { BOTS, chooseBotMove, getBotPhrase } from './services/botEngine';
import { generateChallenge } from './services/learning';
import { THEMES } from './services/themes';
import { sounds } from './services/audio';

import { Board } from './components/Board';
import { BotProfile } from './components/BotProfile';
import { PlayerPanel } from './components/PlayerPanel';
import { LearningModal } from './components/LearningModal';
import { CustomizeModal } from './components/CustomizeModal';
import { GameOverModal } from './components/GameOverModal';
import { RulesModal } from './components/RulesModal';

import {
  Sparkles,
  RotateCcw,
  Lightbulb,
  Settings,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Users,
  Bot as BotIcon,
  Award,
  ChevronLeft,
  Music,
} from 'lucide-react';

export const App: React.FC = () => {
  // Game instance
  const [chess] = useState<Chess>(() => new Chess());
  // Force update trigger for chess state changes
  const [, setFenTick] = useState(0);

  // App Navigation View
  const [view, setView] = useState<'menu' | 'bot_select' | 'game'>('menu');

  // Mode & Bot
  const [gameMode, setGameMode] = useState<GameMode>('bot');
  const [selectedBotId, setSelectedBotId] = useState<BotPersonaId>('pip');
  const activeBot: BotPersona = useMemo(() => BOTS[selectedBotId], [selectedBotId]);

  // Player Profiles
  const [player1, setPlayer1] = useState<PlayerProfile>({
    name: 'Super Kid',
    avatar: '🦁',
    stars: 5,
    color: 'w',
  });

  const [player2, setPlayer2] = useState<PlayerProfile>({
    name: 'Player 2',
    avatar: '🦄',
    stars: 5,
    color: 'b',
  });

  // Settings
  const [settings, setSettings] = useState<GameSettings>({
    boardTheme: 'candy',
    pieceStyle: 'cartoon',
    showPieceBadges: true, // Enabled by default for crystal clear piece recognition!
    soundEnabled: true,
    voiceMode: 'natural', // 'natural' | 'chimes' | 'off'
    showHints: true,
    showLegalMoves: true,
    learningCategory: 'mixed',
    learningDifficulty: 'easy',
    challengeFrequency: 'every_move',
  });

  // Active Board State
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [hintSquare, setHintSquare] = useState<string | null>(null);
  const [capturedPieces, setCapturedPieces] = useState<{ w: PieceType[]; b: PieceType[] }>({
    w: [],
    b: [],
  });

  // Bot Reactions & Thinking
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [botSpeech, setBotSpeech] = useState<string>('');

  // Learning Challenge Modal State
  const [currentChallenge, setCurrentChallenge] = useState<LearningChallenge | null>(null);
  const [isLearningModalOpen, setIsLearningModalOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState<{
    from: string;
    to: string;
    promotion?: string;
  } | null>(null);

  // Modals
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  // Game Over
  const [isGameOver, setIsGameOver] = useState(false);
  const [winnerName, setWinnerName] = useState<string | null>(null);
  const [gameOverReason, setGameOverReason] = useState<'checkmate' | 'draw' | 'stalemate'>('checkmate');
  const [matchStarsEarned, setMatchStarsEarned] = useState(0);

  // Move History
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);

  const activeTheme = THEMES[settings.boardTheme] || THEMES.candy;

  // Initialize sounds config
  useEffect(() => {
    sounds.setSoundEnabled(settings.soundEnabled);
    sounds.setVoiceMode(settings.voiceMode);
  }, [settings.soundEnabled, settings.voiceMode]);

  // Set initial bot speech when selecting bot
  useEffect(() => {
    if (gameMode === 'bot' && activeBot) {
      const phrase = getBotPhrase(activeBot, 'start');
      setBotSpeech(phrase);
    }
  }, [selectedBotId, gameMode, activeBot]);

  // Check Game State Helper
  const checkGameOver = useCallback(() => {
    if (chess.isCheckmate()) {
      setIsGameOver(true);
      setGameOverReason('checkmate');
      const isWhiteTurn = chess.turn() === 'w';
      // If it's white's turn and checkmate, black won!
      const winner = isWhiteTurn
        ? gameMode === 'bot'
          ? activeBot.name
          : player2.name
        : player1.name;
      setWinnerName(winner);

      if (winner === player1.name) {
        setPlayer1((prev) => ({ ...prev, stars: prev.stars + 3 }));
        setMatchStarsEarned((prev) => prev + 3);
        if (gameMode === 'bot') {
          const phrase = getBotPhrase(activeBot, 'lose');
          setBotSpeech(phrase);
          sounds.botSpeak(activeBot.id, phrase);
        }
      } else {
        if (gameMode === 'bot') {
          const phrase = getBotPhrase(activeBot, 'win');
          setBotSpeech(phrase);
          sounds.botSpeak(activeBot.id, phrase);
        }
      }
      return true;
    } else if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition()) {
      setIsGameOver(true);
      setGameOverReason(chess.isStalemate() ? 'stalemate' : 'draw');
      setWinnerName(null);
      setPlayer1((prev) => ({ ...prev, stars: prev.stars + 1 }));
      setMatchStarsEarned((prev) => prev + 1);
      return true;
    }
    return false;
  }, [chess, gameMode, activeBot, player1.name, player2.name]);

  // Execute a chess move on the board
  const executeMove = useCallback(
    (from: string, to: string, promotion = 'q') => {
      try {
        const moveRes = chess.move({
          from: from as ChessSquare,
          to: to as ChessSquare,
          promotion,
        });

        if (!moveRes) return false;

        setLastMove({ from, to });
        setHintSquare(null);
        setSelectedSquare(null);
        setValidMoves([]);

        // Record captured piece
        if (moveRes.captured) {
          const capturedBy = moveRes.color;
          sounds.playCapture();
          setCapturedPieces((prev) => ({
            ...prev,
            [capturedBy]: [...prev[capturedBy], moveRes.captured as PieceType],
          }));
        } else {
          sounds.playMove();
        }

        // Add to history
        setMoveHistory((prev) => [
          ...prev,
          {
            from,
            to,
            piece: moveRes.piece,
            captured: moveRes.captured,
            san: moveRes.san,
            color: moveRes.color,
          },
        ]);

        // Check if move gave check
        if (chess.isCheck()) {
          sounds.playCheck();
          if (gameMode === 'bot' && moveRes.color === 'w') {
            const checkPhrase = getBotPhrase(activeBot, 'checked');
            setBotSpeech(checkPhrase);
            sounds.botSpeak(activeBot.id, checkPhrase);
          }
        }

        setFenTick((t) => t + 1);

        const ended = checkGameOver();
        return !ended;
      } catch (e) {
        console.error('Invalid move:', e);
        return false;
      }
    },
    [chess, checkGameOver, gameMode, activeBot]
  );

  // Trigger Bot Move
  const makeBotTurn = useCallback(() => {
    if (chess.isGameOver() || chess.turn() !== 'b' || gameMode !== 'bot') return;

    setIsBotThinking(true);

    const thinkTimer = setTimeout(() => {
      const bestMove: Move | null = chooseBotMove(chess, activeBot);
      if (bestMove) {
        executeMove(bestMove.from, bestMove.to, bestMove.promotion || 'q');

        // Bot reaction
        let context: 'move' | 'capture' | 'checked' = 'move';
        if (bestMove.captured) context = 'capture';
        if (chess.isCheck()) context = 'checked';

        const reaction = getBotPhrase(activeBot, context);
        setBotSpeech(reaction);
        sounds.botSpeak(activeBot.id, reaction);
      }
      setIsBotThinking(false);
    }, 700);

    return () => clearTimeout(thinkTimer);
  }, [chess, gameMode, activeBot, executeMove]);

  // Handle User Clicking on Board Square
  const handleSquareClick = (square: string) => {
    if (isGameOver || isBotThinking) return;

    const currentTurn = chess.turn();

    // If it's the bot's turn in bot mode, ignore user clicks
    if (gameMode === 'bot' && currentTurn === 'b') return;

    // If clicking on an already selected square, deselect
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    // If a piece was selected and clicking on a valid destination
    if (selectedSquare && validMoves.includes(square)) {
      const isCapture = !!chess.get(square as ChessSquare);

      // Check if learning challenge should be prompted
      let shouldChallenge = false;
      if (settings.challengeFrequency === 'every_move') {
        shouldChallenge = true;
      } else if (settings.challengeFrequency === 'captures_only' && isCapture) {
        shouldChallenge = true;
      } else if (
        settings.challengeFrequency === 'every_two_moves' &&
        moveHistory.length % 2 === 0
      ) {
        shouldChallenge = true;
      }

      if (shouldChallenge) {
        // Prepare challenge
        const challenge = generateChallenge(
          settings.learningCategory,
          settings.learningDifficulty
        );
        setPendingMove({ from: selectedSquare, to: square, promotion: 'q' });
        setCurrentChallenge(challenge);
        setIsLearningModalOpen(true);
        return;
      }

      // Execute move without challenge
      const gameContinues = executeMove(selectedSquare, square, 'q');
      if (gameContinues && gameMode === 'bot' && chess.turn() === 'b') {
        makeBotTurn();
      }
      return;
    }

    // Otherwise, check if user clicked on their own piece
    const piece = chess.get(square as ChessSquare);
    if (piece && piece.color === currentTurn) {
      setSelectedSquare(square);
      const moves = chess.moves({ square: square as ChessSquare, verbose: true });
      setValidMoves(moves.map((m) => m.to));
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  // When player successfully solves challenge
  const handleChallengeSuccess = () => {
    setIsLearningModalOpen(false);
    if (!pendingMove) return;

    // Award player stars!
    setPlayer1((prev) => ({ ...prev, stars: prev.stars + 1 }));
    setMatchStarsEarned((prev) => prev + 1);

    const gameContinues = executeMove(pendingMove.from, pendingMove.to, pendingMove.promotion || 'q');
    setPendingMove(null);
    setCurrentChallenge(null);

    // If bot mode, let bot make its move
    if (gameContinues && gameMode === 'bot' && chess.turn() === 'b') {
      makeBotTurn();
    }
  };

  const handleChallengeCancel = () => {
    setIsLearningModalOpen(false);
    setPendingMove(null);
    setCurrentChallenge(null);
    setSelectedSquare(null);
    setValidMoves([]);
  };

  // Undo Move (very friendly for kids!)
  const handleUndoMove = () => {
    if (isBotThinking || isGameOver) return;

    sounds.playTap();

    if (gameMode === 'bot') {
      if (chess.history().length >= 2) {
        chess.undo();
        chess.undo();
        setCapturedPieces((prev) => ({
          w: prev.w.slice(0, -1),
          b: prev.b.slice(0, -1),
        }));
      } else if (chess.history().length === 1) {
        chess.undo();
      }
    } else {
      chess.undo();
    }

    setSelectedSquare(null);
    setValidMoves([]);
    setLastMove(null);
    setHintSquare(null);
    setFenTick((t) => t + 1);
  };

  // Friendly Hint Helper
  const handleShowHint = () => {
    if (isBotThinking || isGameOver) return;
    sounds.playTap();

    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) return;

    const captures = moves.filter((m) => m.captured);
    const chosen = captures.length > 0 ? captures[0] : moves[Math.floor(Math.random() * moves.length)];

    setHintSquare(chosen.from);
    sounds.playCorrect();

    if (gameMode === 'bot') {
      const phrase = `💡 Hint from ${activeBot.name}: Try moving your piece on ${chosen.from}!`;
      setBotSpeech(phrase);
      sounds.botSpeak(activeBot.id, phrase);
    }
  };

  // Cycle Voice Mode: Natural Voice -> Musical Chimes -> Mute
  const handleCycleVoiceMode = () => {
    sounds.playTap();
    const modes: VoiceMode[] = ['natural', 'chimes', 'off'];
    const currIdx = modes.indexOf(settings.voiceMode);
    const nextMode = modes[(currIdx + 1) % modes.length];

    sounds.setVoiceMode(nextMode);
    if (nextMode === 'chimes') {
      sounds.playBotChime('gizmo');
    } else if (nextMode === 'natural') {
      sounds.speak('Natural voice active!');
    }

    setSettings({ ...settings, voiceMode: nextMode });
  };

  // Start New Match
  const startNewGame = (mode: GameMode, botId?: BotPersonaId) => {
    sounds.playTap();
    chess.reset();
    setSelectedSquare(null);
    setValidMoves([]);
    setLastMove(null);
    setHintSquare(null);
    setCapturedPieces({ w: [], b: [] });
    setMoveHistory([]);
    setIsGameOver(false);
    setWinnerName(null);
    setMatchStarsEarned(0);

    setGameMode(mode);
    if (botId) {
      setSelectedBotId(botId);
      const b = BOTS[botId];
      const startPhrase = getBotPhrase(b, 'start');
      setBotSpeech(startPhrase);
      sounds.botSpeak(b.id, startPhrase);
    }

    setFenTick((t) => t + 1);
    setView('game');
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${activeTheme.bgGradient} text-slate-800 flex flex-col font-friendly transition-colors duration-500`}
    >
      {/* Top Header Navbar */}
      <header className="px-4 py-3 sm:py-4 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {view === 'game' && (
              <button
                type="button"
                onClick={() => setView('menu')}
                className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold transition-all active:scale-95"
                title="Back to menu"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">👑</span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black font-bubble text-white tracking-wide drop-shadow-md">
                  KinderChess
                </h1>
                <p className="text-[10px] sm:text-xs text-amber-300 font-bold hidden sm:block">
                  Smart Moves & Fun Learning Quest! 🌟
                </p>
              </div>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Stars counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-400 text-amber-950 font-bubble font-black text-sm sm:text-base shadow-lg shadow-amber-500/20">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-900" />
              <span>{player1.stars} Stars</span>
            </div>

            {/* Quick Voice Mode Switcher (Natural -> Chimes -> Off) */}
            <button
              type="button"
              onClick={handleCycleVoiceMode}
              className="p-2 sm:px-3 sm:py-1.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bubble text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Change Voice Mode: Natural Voice / Chimes Only / Off"
            >
              {settings.voiceMode === 'natural' && (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Voice: Natural</span>
                </>
              )}
              {settings.voiceMode === 'chimes' && (
                <>
                  <Music className="w-4 h-4 text-cyan-300" />
                  <span className="hidden sm:inline">Voice: Chimes</span>
                </>
              )}
              {settings.voiceMode === 'off' && (
                <>
                  <VolumeX className="w-4 h-4 text-rose-400" />
                  <span className="hidden sm:inline">Voice: Off</span>
                </>
              )}
            </button>

            {/* Rules Button */}
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setIsRulesOpen(true);
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bubble text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="How pieces move"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Rules</span>
            </button>

            {/* Customize / Settings Button */}
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setIsCustomizeOpen(true);
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bubble text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Game Settings"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center max-w-5xl w-full mx-auto p-3 sm:p-6">
        {/* VIEW 1: Main Menu */}
        {view === 'menu' && (
          <div className="flex flex-col items-center justify-center py-6 sm:py-12 text-center animate-pop max-w-xl mx-auto w-full">
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/90 text-amber-950 font-bubble font-bold text-sm mb-4 shadow-lg border-2 border-white animate-bounce-short">
              <Sparkles className="w-4 h-4 text-amber-900" />
              <span>Learn Math, Words & Chess Fun!</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-black font-bubble text-white tracking-wide drop-shadow-lg mb-3">
              Ready to Play? ♟️
            </h2>
            <p className="text-base sm:text-lg text-amber-100 font-medium mb-8 max-w-md">
              Solve fun challenges, challenge playful computer buddies or friends, and become a Chess Superstar!
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col gap-4 w-full px-4">
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setView('bot_select');
                }}
                className="w-full py-4 sm:py-5 px-6 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-bubble font-black text-xl sm:text-2xl shadow-xl shadow-amber-500/30 flex items-center justify-center gap-3 transform hover:scale-102 active:scale-95 transition-all border-3 border-white"
              >
                <BotIcon className="w-7 h-7 text-amber-900" />
                <span>Play vs Robot & Animal Bots! 🤖</span>
              </button>

              <button
                type="button"
                onClick={() => startNewGame('pvp')}
                className="w-full py-4 sm:py-5 px-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bubble font-black text-xl sm:text-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 transform hover:scale-102 active:scale-95 transition-all border-3 border-white"
              >
                <Users className="w-7 h-7 text-white" />
                <span>Two-Player Pass & Play 👥</span>
              </button>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setIsRulesOpen(true);
                  }}
                  className="py-3 px-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bubble font-bold text-base flex items-center justify-center gap-2 border border-white/30 transition-all active:scale-95"
                >
                  <BookOpen className="w-5 h-5 text-amber-300" />
                  <span>How to Play</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setIsCustomizeOpen(true);
                  }}
                  className="py-3 px-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bubble font-bold text-base flex items-center justify-center gap-2 border border-white/30 transition-all active:scale-95"
                >
                  <Settings className="w-5 h-5 text-amber-300" />
                  <span>Customize App</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Choose Bot Persona Screen */}
        {view === 'bot_select' && (
          <div className="py-4 animate-pop max-w-2xl mx-auto w-full">
            <div className="text-center mb-6">
              <h2 className="text-3xl sm:text-4xl font-black font-bubble text-white drop-shadow-md mb-2">
                Choose Your Opponent! 🌟
              </h2>
              <p className="text-amber-200 text-sm sm:text-base font-medium">
                Each bot has a unique personality, speech lines, and chess style!
              </p>
            </div>

            {/* Persona Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {Object.values(BOTS).map((bot) => {
                const isSelected = selectedBotId === bot.id;
                return (
                  <button
                    key={bot.id}
                    type="button"
                    onClick={() => {
                      sounds.playTap();
                      setSelectedBotId(bot.id);
                      sounds.botSpeak(bot.id, bot.catchphrases.start[0]);
                    }}
                    className={`p-4 rounded-3xl text-left transition-all border-3 flex items-start gap-3.5 transform hover:scale-102 active:scale-95 ${
                      isSelected
                        ? 'bg-white border-amber-400 shadow-2xl ring-4 ring-amber-300/60 scale-102'
                        : 'bg-white/80 backdrop-blur-sm border-white/60 hover:bg-white'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${bot.accentColor} flex items-center justify-center text-3xl shadow-md border-2 border-white flex-shrink-0`}
                    >
                      <span>{bot.avatar}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h3 className="font-bubble font-black text-slate-800 text-base sm:text-lg">
                          {bot.name}
                        </h3>
                        <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          {bot.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mb-1 line-clamp-2">
                        {bot.description}
                      </p>
                      <p className="text-[11px] text-amber-800 font-bold">
                        Fav: {bot.favoritePiece}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Launch Button */}
            <div className="flex items-center justify-between gap-4 px-2">
              <button
                type="button"
                onClick={() => setView('menu')}
                className="px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bubble font-bold text-base transition-all"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => startNewGame('bot', selectedBotId)}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 font-bubble font-black text-lg shadow-xl shadow-amber-500/30 flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all border-2 border-white"
              >
                <Play className="w-5 h-5 fill-amber-950" />
                <span>Start Match with {BOTS[selectedBotId].name}!</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: Active Chess Match Screen */}
        {view === 'game' && (
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 sm:gap-6 w-full">
            {/* Left Column: Board + Top/Bottom Player Panels */}
            <div className="flex flex-col gap-3 w-full max-w-[540px]">
              {/* Opponent Profile (Bot or Player 2) */}
              {gameMode === 'bot' ? (
                <BotProfile
                  bot={activeBot}
                  currentSpeech={botSpeech}
                  isThinking={isBotThinking}
                />
              ) : (
                <PlayerPanel
                  player={player2}
                  isCurrentTurn={chess.turn() === 'b'}
                  isInCheck={chess.isCheck() && chess.turn() === 'b'}
                  capturedPieces={capturedPieces.b}
                  pieceStyle={settings.pieceStyle}
                />
              )}

              {/* The Chess Board */}
              <Board
                chess={chess}
                theme={activeTheme}
                pieceStyle={settings.pieceStyle}
                showPieceBadges={settings.showPieceBadges}
                selectedSquare={selectedSquare}
                validMoves={validMoves}
                lastMove={lastMove}
                hintSquare={hintSquare}
                orientation="w"
                onSquareClick={handleSquareClick}
                disabled={isGameOver || isBotThinking}
              />

              {/* Player 1 Profile (White) */}
              <PlayerPanel
                player={player1}
                isCurrentTurn={chess.turn() === 'w'}
                isInCheck={chess.isCheck() && chess.turn() === 'w'}
                capturedPieces={capturedPieces.w}
                pieceStyle={settings.pieceStyle}
              />
            </div>

            {/* Right Column: Controls, Tools, Move History & Learning Progress */}
            <div className="flex flex-col gap-3 w-full max-w-[540px] lg:max-w-xs">
              {/* Kids Helper Tool Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white/90 backdrop-blur-md p-3 rounded-3xl border-2 border-amber-300 shadow-xl">
                {/* Undo Button */}
                <button
                  type="button"
                  onClick={handleUndoMove}
                  disabled={moveHistory.length === 0 || isBotThinking || isGameOver}
                  className="py-2.5 px-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bubble font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-95 shadow-sm"
                  title="Take back last move"
                >
                  <RotateCcw className="w-4 h-4 text-amber-700" />
                  <span>Undo</span>
                </button>

                {/* Hint Button */}
                <button
                  type="button"
                  onClick={handleShowHint}
                  disabled={isBotThinking || isGameOver}
                  className="py-2.5 px-3 rounded-2xl bg-yellow-300 hover:bg-yellow-400 text-yellow-950 font-bubble font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 active:scale-95 shadow-sm"
                  title="Show a helpful hint"
                >
                  <Lightbulb className="w-4 h-4 text-yellow-800" />
                  <span>Hint</span>
                </button>

                {/* Sound Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !settings.soundEnabled;
                    sounds.setSoundEnabled(next);
                    if (next) sounds.playTap();
                    setSettings({ ...settings, soundEnabled: next });
                  }}
                  className="col-span-2 sm:col-span-1 py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bubble font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                >
                  {settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-rose-500" />
                  )}
                  <span>{settings.soundEnabled ? 'FX On' : 'FX Off'}</span>
                </button>
              </div>

              {/* Learning Subject Card */}
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border-2 border-emerald-300 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 font-bubble font-black text-emerald-800 text-sm">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Learning Mode
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {settings.learningDifficulty.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  {settings.learningCategory === 'math'
                    ? 'Fun math calculations unlock your chess moves!'
                    : settings.learningCategory === 'reading'
                    ? 'Sight words and rhymes power your chess pieces!'
                    : settings.learningCategory === 'chess'
                    ? 'Learn chess master tactics & piece rules!'
                    : 'Mixed math, words, and chess challenges!'}
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Frequency:</span>
                  <span className="text-indigo-600 font-bubble">
                    {settings.challengeFrequency === 'every_move'
                      ? 'Every Move'
                      : settings.challengeFrequency === 'captures_only'
                      ? 'Captures Only'
                      : settings.challengeFrequency === 'every_two_moves'
                      ? 'Every 2 Moves'
                      : 'Freeplay (Off)'}
                  </span>
                </div>
              </div>

              {/* Move History / Notation Box */}
              <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-3xl border-2 border-white/60 shadow-xl flex-1 max-h-48 overflow-y-auto">
                <h4 className="font-bubble font-bold text-slate-700 text-xs uppercase tracking-wider mb-2">
                  Move History ({moveHistory.length})
                </h4>
                {moveHistory.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No moves yet. Make your first move!</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {moveHistory.map((m, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-2 py-0.5 rounded-lg font-bubble font-semibold ${
                          m.color === 'w'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-800 text-slate-100'
                        }`}
                      >
                        {idx + 1}. {m.san}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      {/* 1. Learning Challenge Modal */}
      <LearningModal
        challenge={currentChallenge}
        isOpen={isLearningModalOpen}
        onSuccess={handleChallengeSuccess}
        onCancel={handleChallengeCancel}
      />

      {/* 2. Customization & Settings Modal */}
      <CustomizeModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        player1={player1}
        onUpdatePlayer1={setPlayer1}
        player2={player2}
        onUpdatePlayer2={setPlayer2}
        isPvpMode={gameMode === 'pvp'}
      />

      {/* 3. Game Over Celebration Modal */}
      <GameOverModal
        isOpen={isGameOver}
        winner={winnerName}
        reason={gameOverReason}
        starsEarned={matchStarsEarned}
        onPlayAgain={() => startNewGame(gameMode, selectedBotId)}
        onGoHome={() => setView('menu')}
      />

      {/* 4. Chess Rules Guide Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        pieceStyle={settings.pieceStyle}
      />
    </div>
  );
};

export default App;
